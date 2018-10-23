'use strict';

import { Router } from 'express';
import logger from '../lib/logger';
import models from '../models';

import getData from '../lib/get-parks';
import customizeParks from '../lib/customize-parks';

const parkRouter = new Router();

parkRouter.get('/parks/:state', (request, response, next) => {
  logger.log(logger.INFO, `Processing a get for /parks/${request.params.state}...`);

  const parkTypes = customizeParks(request.query);

  // find if state exists in db
  return models.state.findAll({
    where: {
      stateId: request.params.state,
    },
  })
    .then((results) => {
      // if it exists, return all parks associated with the state
      if (results.length > 0) {
        logger.log(logger.INFO, `Returning park data from db for ${request.params.state}`);

        if (parkTypes.length === 0) {
          return models.park.findAll({
            where: {
              stateCode: request.params.state,
            },
          })
            .then((retrievedParks) => {
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
            return response.json(retrievedParks);
          });
      }

      // if it doesn't, call this function to get data from the api
      return getData(request.params.state)
        .then(() => {
          if (parkTypes.length === 0) {
            return models.park.findAll({
              where: {
                stateCode: request.params.state,
              },
            })
              .then((retrievedParks) => {
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
              return response.json(retrievedParks);
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
});

export default parkRouter;
