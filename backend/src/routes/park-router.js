'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import models from '../models';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';

import { stateData } from '../lib/states';
import getData from '../lib/get-parks';
import customizeParks from '../lib/customize-parks';
import { filterUserParks, generateRx, generateUserSQLQuery } from '../lib/filter-userprefs';

const jsonParser = json();
const parkRouter = new Router();
const Op = models.Sequelize.Op;

// retrieve initial data, either from database or API
parkRouter.get('/parks/:state', (request, response, next) => {
  if (!stateData[request.params.state]) return next(new HttpError(400, 'Bad request'));
  logger.log(logger.INFO, `Processing a get for /parks/${request.params.state}...`);

  let parkTypes = null;
  if (request.query.interests) {
    parkTypes = customizeParks(request.query);
  }

  // find if state exists in db
  return models.state.findAll({
    where: {
      stateId: { [Op.eq]: request.params.state },
    },
  })
    .then((results) => {
      // if it exists, return status
      if (results.length > 0) {
        return response.json(parkTypes);
      }

      // if it doesn't, call this function to get data from the api, then return status
      return getData(request.params.state, stateData[request.params.state].region)
        .then(() => {
          return response.json(parkTypes);
        })
        .catch(next);
    })
    .catch(next);
});

// once data has been retrieved, perform necessary updates and return data
parkRouter.put('/parks/:state', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, `Updating ${request.params.state}`);

  // find all campgrounds in state
  return models.campground.findAll({
    where: {
      state: { [Op.eq]: request.params.state },
    },
    attributes: ['state', 'parkId', 'name'],
  })
    // find only the parks with campgrounds and update camping data
    .then((campgrounds) => {
      logger.log(logger.INFO, `Finding parks with campgrounds in ${request.params.state}`);

      const mapped = campgrounds.map(cg => cg.dataValues.parkId);
      const uniqueParkCodes = mapped.filter((cg, i) => {
        return mapped.indexOf(cg) === i;
      });
      return uniqueParkCodes;
    })
    .then((uniqueParks) => {
      logger.log(logger.INFO, `Updating ${uniqueParks.length} parks in ${request.params.state} with campgrounds`);

      return models.park.update(
        { camping: true },
        { where: { pKeyCode: [...uniqueParks] } },
      );
    })
    // return all data, depending on user preferences
    .then(() => {
      if (request.body && !request.body.parkTypes) {
        return models.sequelize.query(
          'SELECT parks.*, "reports" FROM parks LEFT JOIN (SELECT "parkId", COUNT(*) as "reports" FROM reports GROUP BY "parkId") AS reports ON "pKeyCode"="parkId" WHERE "stateCode"=?', 
          { 
            replacements: [request.params.state], 
            type: models.sequelize.QueryTypes.SELECT, 
          },
        )
          .then((retrievedParks) => {
            logger.log(logger.INFO, `Returning ${retrievedParks.length} parks in ${request.params.state}`);
            return response.json(retrievedParks);
          })
          .catch(next);
      }

      const { parkTypes, camping } = request.body;
      /* camping interest of false still returns parks that have camping, as there is much more to do besides camp. Camping interest of true only returns parks with camping options. camping = false merely implies a lack of interest, not a park requirement */
      
      if (parkTypes.length > 0 && !camping) {
        const desigParams = parkTypes.map(() => '?');
        parkTypes.unshift(request.params.state);

        return models.sequelize.query(
          `SELECT parks.*, "reports" FROM parks LEFT JOIN (SELECT "parkId", COUNT(*) as "reports" FROM reports GROUP BY "parkId") AS reports ON "pKeyCode"="parkId" WHERE "stateCode"=? AND "designation" IN (${desigParams.join(',')})`, 
          { 
            replacements: parkTypes, 
            type: models.sequelize.QueryTypes.SELECT, 
          },
        )
          .then((retrievedParks) => {
            logger.log(logger.INFO, `Returning ${retrievedParks.length} parks in ${request.params.state} that meet user requirements`);
            return response.json(retrievedParks);
          });
      } 

      if (parkTypes.length > 0 && camping) {
        const desigParams = parkTypes.map(() => '?');
        parkTypes.unshift(request.params.state, camping);

        return models.sequelize.query(
          `SELECT parks.*, "reports" FROM parks LEFT JOIN (SELECT "parkId", COUNT(*) as "reports" FROM reports GROUP BY "parkId") AS reports ON "pKeyCode"="parkId" WHERE "stateCode"=? AND "camping"=? AND "designation" IN (${desigParams.join(',')})`, 
          { 
            replacements: parkTypes, 
            type: models.sequelize.QueryTypes.SELECT, 
          },
        )
          .then((retrievedParks) => {
            logger.log(logger.INFO, `Returning ${retrievedParks.length} parks in ${request.params.state} with camping`);
            return response.json(retrievedParks);
          });
      }

      if (parkTypes.length === 0 && camping) {
        return models.sequelize.query(
          'SELECT parks.*, "reports" FROM parks LEFT JOIN (SELECT "parkId", COUNT(*) as "reports" FROM reports GROUP BY "parkId") AS reports ON "pKeyCode"="parkId" WHERE "stateCode"=? AND "camping"=?', 
          { 
            replacements: [request.params.state, camping], 
            type: models.sequelize.QueryTypes.SELECT, 
          },
        )
          .then((parksWithCampgrounds) => {
            logger.log(logger.INFO, `Returning ${parksWithCampgrounds.length} parks in ${request.params.state} with camping`);
            return response.json(parksWithCampgrounds);
          });
      }
      return null;
    })
    .catch(next);
});

// get a single park, join with report to update park view immediately
parkRouter.get('/park/:parkId', (request, response, next) => {
  logger.log(logger.INFO, `Processing a get on /park/${request.params.parkId}`);

  return models.sequelize.query(
    'SELECT parks.*, "reports" FROM parks LEFT JOIN (SELECT "parkId", COUNT(*) as "reports" FROM reports GROUP BY "parkId") AS reports ON "pKeyCode"="parkId" WHERE "pKeyCode"=?;',
    {
      replacements: [request.params.parkId],
      type: models.sequelize.QueryTypes.SELECT,
    },
  )
    .then((singlePark) => {
      logger.log(logger.INFO, `Returning ${singlePark[0].fullName}`);
      return response.json(singlePark[0]);
    })
    .catch(next);
});

parkRouter.get('/parks/all/top', (request, response, next) => {
  logger.log(logger.INFO, 'Processing a get on /park/all/top');

  return models.sequelize.query(
    'SELECT parks.*, "reports" FROM parks INNER JOIN (SELECT "parkId", COUNT(*) as "reports" FROM reports GROUP BY "parkId") AS reports ON "pKeyCode"="parkId" ORDER BY reports DESC;',
    {
      type: models.sequelize.QueryTypes.SELECT,
    },
  )
    .then((parks) => {
      logger.log(logger.INFO, `Returning top ${parks.length} parks with most reviews`);
      return response.json(parks);
    })
    .catch(next);
});

parkRouter.get('/parks/all/random', (request, response, next) => {
  logger.log(logger.INFO, 'Processing a get on /park/all/random');

  return models.sequelize.query(
    'SELECT parks.*, "reports" FROM parks LEFT JOIN (SELECT "parkId", COUNT(*) as "reports" FROM reports GROUP BY "parkId") AS reports ON "pKeyCode"="parkId" WHERE reports IS NULL ORDER BY RANDOM() LIMIT 15;',
    {
      type: models.sequelize.QueryTypes.SELECT,
    },
  )
    .then((parks) => {
      logger.log(logger.INFO, `Returning 15 random ${parks.length} parks`);
      return response.json(parks);
    })
    .catch(next);
});

// get all parks in a geographic region
parkRouter.get('/parks/region/:regionId', bearerAuthMiddleware, (request, response, next) => {
  logger.log(logger.INFO, `Processing a get on /parks/region/${request.params.regionId}`);

  return models.sequelize.query(
    'SELECT parks.*, states.region FROM parks LEFT JOIN states ON "stateCode"="stateId" WHERE states.region=?',
    {
      replacements: [request.params.regionId],
      type: models.sequelize.QueryTypes.SELECT,
    },
  )
    .then((parks) => {
      logger.log(logger.INFO, `Returning ${parks.length} in ${request.params.regionId}`);
      return response.json(parks);
    })
    .catch(next);
});

parkRouter.get('/parks/userprefs/all', bearerAuthMiddleware, (request, response, next) => {
  logger.log(logger.INFO, 'Processing a get on /parks/userprefs/all');

  const searchTypeData = {};
  if (request.query.climate) {
    searchTypeData.searchType = 'weather';
    searchTypeData.userPrefs = request.query.climate.split(',');
    searchTypeData.joinType = 'left';
    searchTypeData.joinAs = 'weatherReport';
  } else if (request.query.environment) {
    const environments = ['urban', 'suburban', 'rural'];
    environments.splice(environments.indexOf(request.query.environment), 1);
    searchTypeData.searchType = 'parkEnvironment';
    searchTypeData.userPrefs = environments;
    searchTypeData.joinType = 'inner';
    searchTypeData.joinAs = 'environment';
  } else if (request.query.landscape) {
    searchTypeData.searchType = 'parkLandscape';
    searchTypeData.userPrefs = request.query.landscape.split(',');
    searchTypeData.joinType = 'inner';
    searchTypeData.joinAs = 'landscape';
  }

  logger.log(logger.INFO, searchTypeData);
  logger.log(logger.INFO, request.body);

  if (!searchTypeData.searchType) return next(new HttpError(400, 'Bad Request'));

  const rx = generateRx(searchTypeData.searchType, searchTypeData.userPrefs);
  const sqlQuery = generateUserSQLQuery(searchTypeData.joinType, searchTypeData.searchType, searchTypeData.joinAs, rx);

  return models.sequelize.query(sqlQuery, {
    type: models.sequelize.QueryTypes.SELECT,
  })
    .then((parks) => {
      const filteredParks = filterUserParks(parks, searchTypeData.searchType, rx);
      switch (searchTypeData.searchType) {
        case 'weather':
          logger.log(logger.INFO, `Returning ${filteredParks.length} parks with ${request.query.climate} weather`);
          break;
        case 'parkEnvironment':
          logger.log(logger.INFO, `Returning ${filteredParks.length} parks in ${searchTypeData.userPrefs.join(' or ')} locales`);
          break;
        case 'parkLandscape':
          logger.log(logger.INFO, `Returning ${filteredParks.length} in ${request.query.landscape}`);
          break;
        default: 
          logger.log(logger.INFO, `Returning ${filteredParks.length} - unknown search parameters`);
      }
      return response.json(filteredParks);
    })
    .catch(next);
});

export default parkRouter;
