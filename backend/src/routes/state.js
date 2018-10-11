'use strict';

import { Router } from 'express';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import models from '../models';

import getData from '../lib/get-parks';

const stateRouter = new Router();
stateRouter.get('/rankings', (request, response, next) => {
  logger.log(logger.INFO, 'Processing a get on /state/rankings');

  return models.sequelize.query(
    'SELECT "stateId", "totalParks" FROM states ORDER BY "totalParks" DESC', 
    { type: models.sequelize.QueryTypes.SELECT },
  )
    .then((states) => {
      logger.log(logger.INFO, 'Returning states in order of total parks');
      return response.json(states);
    })
    .catch(next);
});

stateRouter.get('/state/:state', (request, response, next) => {
  logger.log(logger.INFO, `Processing a get for /state/${request.params.state}...`);

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
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(error => new HttpError(400, `Bad request ${error}`));
});


export default stateRouter;
