'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
// import HttpError from 'http-errors';

import logger from '../lib/logger';
import models from '../models/index';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';

const jsonParser = json();
const reportRouter = new Router();

reportRouter.post('/report', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'Processing a POST on /report');

  return models.report.create({
    ...request.body,
  })
    .then((report) => {
      logger.log(logger.INFO, `Creating report for ${request.body.parkId}`);
      return response.json(report);
    })
    .catch(next);
});

reportRouter.get('/report/profile/:profileId', bearerAuthMiddleware, (request, response, next) => {
  logger.log(logger.INFO, 'Processing a GET on /report/:profileId');

  return models.report.findAll({
    where: {
      profileId: request.params.profileId,
    },
  })
    .then((reports) => {
      logger.log(logger.INFO, `Returning all reports posted by ${request.params.profileId}`);
      return response.json(reports);
    })
    .catch(next);
});

reportRouter.get('/report/park/:parkId', (request, response, next) => {
  logger.log(logger.INFO, 'Processing a GET on /report/:parkId');

  return models.report.findAll({
    where: {
      parkId: request.params.parkId,
    },
  }) 
    .then((reports) => {
      logger.log(logger.INFO, `Returning all reports for ${request.params.parkId}`);
      return response.json(reports);
    })
    .catch(next);
});

export default reportRouter;
