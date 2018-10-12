'use strict';

import { Router } from 'express';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import models from '../models';

const stateRouter = new Router();

stateRouter.get('/states', (request, response, next) => {
  logger.log(logger.INFO, 'Processing a get on /states');

  // return models.sequelize.query(
  //   'SELECT "stateId", "totalParks" FROM states ORDER BY "totalParks" DESC', 
  //   { type: models.sequelize.QueryTypes.SELECT },
  // )
  return models.sequelize.query(
    'SELECT "designation", COUNT(*) FROM parks GROUP BY "designation"', 
    { type: models.sequelize.QueryTypes.SELECT },
  )
    .then((states) => {
      logger.log(logger.INFO, 'Returning states in order of total parks');
      return response.json(states);
    })
    .catch(() => next(new HttpError(400, 'bad request')));
});

export default stateRouter;

/* 
LEFT JOIN parks to tables:

'SELECT "stateCode", "designation" FROM parks LEFT JOIN states ON "stateCode"="stateId" ORDER BY "totalParks" DESC';
*/
