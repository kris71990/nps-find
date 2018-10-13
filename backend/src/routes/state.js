'use strict';

import { Router } from 'express';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import models from '../models';

const stateRouter = new Router();

stateRouter.get('/states', (request, response, next) => {
  logger.log(logger.INFO, 'Processing a get on /states');

  return models.sequelize.query(
    'SELECT "stateCode", "designation", COUNT(*) FROM parks GROUP BY "designation", "stateCode"', 
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
        return 0;
      });
      return obj;
    })
    .then((stateObj) => {
      return models.sequelize.query(
        'SELECT "stateId", "total" FROM states ORDER BY "total" DESC', 
        { type: models.sequelize.QueryTypes.SELECT },
      )
        .then((states) => {
          logger.log(logger.INFO, 'Returning states in order of total parks');
          const finalObj = states.map((state) => {
            state.types = stateObj[state.stateId];
            return state;
          });
          return response.json(finalObj);
        })
        .catch(() => next(new HttpError(400, 'bad request')));
    })
    .catch(() => next(new HttpError(400, 'bad request')));
});

stateRouter.get('/states/types', (request, response, next) => {
  logger.log(logger.INFO, 'Processing a get on /states/types');

  return models.sequelize.query(
    'SELECT DISTINCT "designation" FROM parks',
    { type: models.sequelize.QueryTypes.SELECT },
  )
    .then((distinctTypes) => {
      const typesArr = distinctTypes.map(type => type.designation);
      return response.json(typesArr);
    })
    .catch(() => next(new HttpError(400, 'bad request')));
});


// stateRouter.get('/states/breakdown', (request, response, next) => {
//   logger.log(logger.INFO, 'Processing a get on /states');

//   // return models.sequelize.query(
//   //   'SELECT "stateId", "totalParks" FROM states ORDER BY "totalParks" DESC', 
//   //   { type: models.sequelize.QueryTypes.SELECT },
//   // )
//   return models.sequelize.query(
//     'SELECT "stateCode", "designation", COUNT(*) FROM parks GROUP BY "designation", "stateCode"', 
//     { type: models.sequelize.QueryTypes.SELECT },
//   )
//     .then((parks) => {
//       logger.log(logger.INFO, 'Returning states in order of total parks');

//       const obj = {};
//       parks.map((state) => {
//         if (!obj[state.stateCode]) {
//           obj[state.stateCode] = {};
//         }
//         obj[state.stateCode][state.designation] = state.count;
//         return 0;
//       });

//       console.log(obj);
//       return response.json(obj);
//     })
//     .catch(() => next(new HttpError(400, 'bad request')));
// });

export default stateRouter;
