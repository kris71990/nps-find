'use strict';

import { Router } from 'express';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import models from '../models';

import getData from '../lib/get-parks';

const stateRouter = new Router();

stateRouter.get('/state/:state', (request, response, next) => {
  logger.log(logger.INFO, `Processing a get for /state/${request.params.state}...`);

  // find if state exists in db
  models.state.findAll({
    where: {
      stateId: request.params.state,
    },
  })
    .then((results) => {
      // if it exists, return all parks associated with the state
      if (results.length > 0) {
        return models.park.findAll({
          where: {
            stateCode: request.params.state,
          },
        })
          .then((retrievedParks) => {
            return response.json(retrievedParks);
          });
      }

      // if it doesn't, call this function to get data from the api
      return getData(request.params.state)
        .then(() => {
          return models.park.findAll({
            where: {
              stateCode: request.params.state,
            },
          })
            .then((retrievedParks) => {
              return response.json(retrievedParks);
            });
          // return response.json(response2);
        })
        .catch(next);
    })
    .catch(error => new HttpError(400, `Bad request ${error}`));
});

export default stateRouter;
