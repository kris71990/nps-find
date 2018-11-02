'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';
import models from '../models/index';
import basicAuthMiddleware from '../lib/basic-auth-middleware';
import logger from '../lib/logger';

const accountRouter = new Router();
const jsonParser = json();

accountRouter.post('/signup', jsonParser, (request, response, next) => {
  return models.account.create(request.body.username, request.body.email, request.body.password)
    .then((account) => {
      delete request.body.password;
      logger.log(logger.INFO, 'Creating auth token');
      return account.generateToken();
    })
    .then((token) => {
      logger.log(logger.INFO, 'Successfully created token');
      response.cookie('nps-token', token, { maxAge: 900000 });
      return response.send(token);
    })
    .catch(next);
});

accountRouter.get('/login', basicAuthMiddleware, (request, response, next) => {
  if (!request.account) return next(new HttpError(400), 'No account exists with these credentials');
  return request.account.generateToken()
    .then((token) => {
      logger.log(logger.INFO, 'Successfully created token');
      response.cookie('nps-token', token, { maxAge: 900000 });
      return response.send(token);
    })
    .catch(next);
});

export default accountRouter;
