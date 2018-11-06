'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';
import models from '../models/index';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';

const jsonParser = json();
const profileRouter = new Router();

profileRouter.post('/profile', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.account) next(new HttpError(400, 'AUTH - invalid request'));
  logger.log(logger.INFO, 'Processing POST on /profile');

  return models.profile.create({
    ...request.body,
    accountId: request.account.id,
  })
    .then((profile) => {
      logger.log(logger.INFO, 'Returning new profile');
      return response.json({ profile });
    })
    .catch(next);
});

profileRouter.get('/profile/me', bearerAuthMiddleware, (request, response, next) => {
  logger.log(logger.INFO, 'Processing GET /profile/me');

  return models.profile.findOne(
    { where: { accountId: request.account.id } },
  )
    .then((profile) => {
      if (!profile) next(new HttpError(404, 'Profile Not Found'));
      return response.json(profile);
    })
    .catch(next);
});

profileRouter.put('/profile/:id', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'Processing PUT on /profile');

  return models.profile.update(
    { ...request.body },
    { where: { id: request.params.id }, returning: true },
  )
    .then((profile) => {
      if (profile[0] === 0) return next(new HttpError(404, 'Profile does not exist'));
      logger.log(logger.INFO, 'Returning updated profile');
      return response.json(profile);
    });
});

profileRouter.delete('/profile/:id', bearerAuthMiddleware, (request, response, next) => {
  logger.log(logger.INFO, 'Processing DELETE on /profile/:id');

  if (!request.params.id) { 
    return next(new HttpError(404, 'Profile not found'));
  }

  return models.profile.destroy({ where: { id: request.params.id } })
    .then((profile) => {
      if (!profile) next(new HttpError(404, 'profile not found'));
      logger.log(logger.INFO, 'Profile deleted');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default profileRouter;
