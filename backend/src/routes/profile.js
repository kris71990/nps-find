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

  return models.profile.create({
    ...request.body,
    account: request.account._id,
  })
    .then((profile) => {
      logger.log(logger.INFO, 'Returning new profile');
      return response.json(profile);
    })
    .catch(next);
});

export default profileRouter;
