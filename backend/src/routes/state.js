'use strict';

import { Router } from 'express';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import models from '../models';

const stateRouter = new Router();

stateRouter.get('/states', (request, response, next) => {
  logger.log(logger.INFO, 'Processing a get on /states');

  return models.sequelize.query(
    'SELECT "stateId", "total" FROM states ORDER BY "total" DESC', 
    { type: models.sequelize.QueryTypes.SELECT },
  )
    .then((states) => {
      logger.log(logger.INFO, 'Returning states in order of total parks');
      return response.json(states);
    })
    .catch(() => next(new HttpError(400, 'bad request')));
});

stateRouter.get('/states/breakdown', (request, response, next) => {
  logger.log(logger.INFO, 'Processing a get on /states');

  // return models.sequelize.query(
  //   'SELECT "stateId", "totalParks" FROM states ORDER BY "totalParks" DESC', 
  //   { type: models.sequelize.QueryTypes.SELECT },
  // )
  return models.sequelize.query(
    'SELECT "stateCode", "designation", COUNT(*)  FROM parks GROUP BY "designation", "stateCode"', 
    { type: models.sequelize.QueryTypes.SELECT },
  )
    .then((parks) => {
      logger.log(logger.INFO, 'Returning states in order of total parks');

      const obj = {};
      parks.map((state) => {
        if (!obj[state.stateCode]) {
          obj[state.stateCode] = {};
        }
        obj[state.stateCode][state.designation] = state.count;
        // obj.total = obj[]
        return obj;
      });
      return response.json(parks);
    })
    .catch(() => next(new HttpError(400, 'bad request')));
});

export default stateRouter;
