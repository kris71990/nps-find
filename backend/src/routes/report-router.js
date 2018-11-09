'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';

import logger from '../lib/logger';
import models from '../models/index';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';

const jsonParser = json();
const reportRouter = new Router();

reportRouter.post('/report', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'Processing a POST on /report');

  return models.report.create({
    lengthOfStay: 3,
    activities: 'hiking',
    profileId: 1,
    rating: 1,
  })
    .then((report) => {
      logger.log(logger.INFO, `Creating report for ${'parkId'}`);
      return response.json(report);
    })
    .catch(next);
});

export default reportRouter;
