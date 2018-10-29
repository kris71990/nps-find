'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import logger from '../lib/logger';
import models from '../models';

import getData from '../lib/get-parks';
import customizeParks from '../lib/customize-parks';

const jsonParser = json();
const parkRouter = new Router();

// retrieve initial data, either from database or API
parkRouter.get('/parks/:state', (request, response, next) => {
  logger.log(logger.INFO, `Processing a get for /parks/${request.params.state}...`);

  let parkTypes;
  if (request.query.interests) {
    parkTypes = customizeParks(request.query);
  }

  // find if state exists in db
  return models.state.findAll({
    where: {
      stateId: request.params.state,
    },
  })
    .then((results) => {
      // if it exists, return status
      if (results.length > 0) {
        return response.json(parkTypes);
      }

      // if it doesn't, call this function to get data from the api, then return status
      return getData(request.params.state)
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
      state: request.params.state,
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
      if (request.body.parkTypes) {
        return models.park.findAll({
          where: {
            stateCode: request.params.state,
            designation: request.body.parkTypes,
          },
        })
          .then((retrievedParks) => {
            logger.log(logger.INFO, `Returning ${retrievedParks.length} parks in ${request.params.state} that meet user requirements`);
            return response.json(retrievedParks);
          });
      }
      return models.park.findAll({
        where: {
          stateCode: request.params.state,
        },
      })
        .then((retrievedParks) => {
          logger.log(logger.INFO, `Returning ${retrievedParks.length} parks in ${request.params.state}`);
          return response.json(retrievedParks);
        })
        .catch(next);
    })
    .catch(next);
});

export default parkRouter;
