'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';

import logger from '../lib/logger';
import models from '../models/index';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';

const jsonParser = json();
const reportRouter = new Router();
const Op = models.Sequelize.Op;

reportRouter.post('/report', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (Object.keys(request.body).length < 9) return next(new HttpError(400, 'Bad request'));

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
  logger.log(logger.INFO, `Processing a GET on /report/${request.params.profileId}`);

  return models.report.findAll({
    where: {
      profileId: { [Op.eq]: request.params.profileId },
    },
    order: [['updatedAt', 'DESC']],
  })
    .then((reports) => {
      logger.log(logger.INFO, `Returning all reports posted by ${request.params.profileId}`);
      return response.json(reports);
    })
    .catch(next);
});

reportRouter.get('/report/park/:parkId', (request, response, next) => {
  logger.log(logger.INFO, `Processing a GET on /report/${request.params.parkId}`);

  return models.report.findAll({
    where: {
      parkId: { [Op.eq]: request.params.parkId },
    },
    order: [['updatedAt', 'DESC']],
  }) 
    .then((reports) => {
      logger.log(logger.INFO, `Returning all reports for ${request.params.parkId}`);
      return response.json(reports);
    })
    .catch(next);
});

reportRouter.delete('/report/:id', bearerAuthMiddleware, (request, response, next) => {
  logger.log(logger.INFO, `Processing a DELETE on /report/${request.params.id}`);

  return models.report.destroy({ where: { id: { [Op.eq]: request.params.id } } })
    .then((report) => {
      if (!report) next(new HttpError(404, 'report not found'));
      logger.log(logger.INFO, 'Report deleted');
      return response.sendStatus(204);
    });
});

export default reportRouter;
