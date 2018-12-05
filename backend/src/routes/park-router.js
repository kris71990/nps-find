'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import models from '../models';

import { stateData } from '../lib/states';
import getData from '../lib/get-parks';
import customizeParks from '../lib/customize-parks';

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

// get all parks in a geographic region
parkRouter.get('/parks/region/:regionId', (request, response, next) => {
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

parkRouter.get('/parks/weather/all', (request, response, next) => {
  logger.log(logger.INFO, 'Processing a get on /parks/weather/all');

  if (!request.query.climate) return next(new HttpError(400, 'Bad Request'));

  const weatherPrefs = request.query.climate.split(',');
  let rx = '';
  weatherPrefs.forEach((pref, i) => {
    rx += `(${pref.trim()})`; 
    if (i !== weatherPrefs.length - 1) rx += '|';
  });

  return models.sequelize.query(
    'SELECT * FROM parks LEFT JOIN (SELECT "weather", "parkId", COUNT(*) as "reports" FROM reports GROUP BY "parkId", "weather") AS weatherReport ON "pKeyCode"="parkId" WHERE "weatherInfo" ~* ? OR "weather" ~* ?;',
    {
      replacements: [rx, rx],
      type: models.sequelize.QueryTypes.SELECT,
    },
  )
    .then((parks) => {
      const filtered = {};
      parks.forEach((park) => {
        if (!filtered[park.pKeyCode]) filtered[park.pKeyCode] = park;
      });
      const filteredParks = Object.values(filtered);
      logger.log(logger.INFO, `Returning ${filteredParks.length} with ${request.query.climate} weather`);
      return response.json(filteredParks);
    })
    .catch(next);
});

parkRouter.get('/parks/environment/all', (request, response, next) => {
  logger.log(logger.INFO, 'Processing a get on /parks/environment');

  const environments = ['urban', 'suburban', 'rural'];
  environments.splice(environments.indexOf(request.query.environment), 1);
  const rx = `(${environments[0]})|(${environments[1]})`;

  return models.sequelize.query(
    'SELECT * FROM parks INNER JOIN (SELECT "parkEnvironment", "parkId", COUNT(*) as "reports" FROM reports GROUP BY "parkId", "parkEnvironment") AS environment ON "pKeyCode"="parkId" WHERE "parkEnvironment" ~* ?;',
    {
      replacements: [rx],
      type: models.sequelize.QueryTypes.SELECT,
    },
  )
    .then((parks) => {
      logger.log(logger.INFO, `Returning ${parks.length} in ${environments.join(' and ')} locales`);
      return response.json(parks);
    })
    .catch(next);
});

export default parkRouter;
