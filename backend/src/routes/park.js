'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import logger from '../lib/logger';
import models from '../models';

import getData from '../lib/get-parks';
import customizeParks from '../lib/customize-parks';

const jsonParser = json();
const parkRouter = new Router();

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
      // if it exists, return all parks associated with the state
      if (results.length > 0) {
        if (!parkTypes) {
          return models.park.findAll({
            where: {
              stateCode: request.params.state,
            },
          })
            .then((retrievedParks) => {
              logger.log(logger.INFO, `Returning ${retrievedParks.length} parks in ${request.params.state}`);
              return response.json(retrievedParks);
            });
        }
        return models.park.findAll({
          where: {
            stateCode: request.params.state,
            designation: parkTypes,
          },
        })
          .then((retrievedParks) => {
            logger.log(logger.INFO, `Returning ${retrievedParks.length} parks in ${request.params.state} that meet user requirements`);
            return response.json(retrievedParks);
          });
      }

      // if it doesn't, call this function to get data from the api
      return getData(request.params.state)
        .then(() => {
          if (!parkTypes) {
            return models.park.findAll({
              where: {
                stateCode: request.params.state,
              },
            })
              .then((retrievedParks) => {
                logger.log(logger.INFO, `Returning ${retrievedParks.length} parks in ${request.params.state}`);
                return response.json(retrievedParks);
              });
          }
          return models.park.findAll({
            where: {
              stateCode: request.params.state,
              designation: parkTypes,
            },
          })
            .then((retrievedParks) => {
              logger.log(logger.INFO, `Returning ${retrievedParks.length} parks in ${request.params.state} that meet user requirements`);
              return response.json(retrievedParks);
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
});

parkRouter.put('/parks/:state', jsonParser, (request, response, next) => {
  return models.campground.findAll({
    where: {
      state: request.params.state,
    },
    attributes: ['state', 'parkId', 'name'],
  })
    .then((campgrounds) => {
      const mapped = campgrounds.map(cg => cg.dataValues.parkId);
      const uniqueParkCodes = mapped.filter((cg, i) => {
        return mapped.indexOf(cg) === i;
      });
      return uniqueParkCodes;
    })
    .then((uniqueParks) => {
      uniqueParks.forEach((park) => {
        return models.park.update(
          { camping: true },
          { where: { pKeyCode: park } },
        );
      });
    })
    .then(() => {
      return response.sendStatus(204);
    })
    .catch(next);
});

export default parkRouter;
