'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';
import models from '../models';
import basicAuthMiddleware from '../lib/basic-auth-middleware';
import logger from '../lib/logger';

const accountRouter = new Router();
const jsonParser = json();

accountRouter.post('/signup', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, `Creating account for username '${request.body.username}'`);

  return models.account.createAccount(
    request.body.username, 
    request.body.email, 
    request.body.password,
  )
    .then((account) => {
      delete request.body.password;
      logger.log(logger.INFO, 'Creating auth token');
      return models.account.generateToken(account);
    })
    .then((token) => {
      logger.log(logger.INFO, 'Successfully created token');
      response.cookie('nps-token', token, { maxAge: 900000 });
      return response.send(token);
    })
    .catch(next);
});

accountRouter.get('/login', basicAuthMiddleware, (request, response, next) => {
  if (!request.account) return next(new HttpError(400), 'Invalid account');
  return models.account.generateToken(request.account)
    .then((token) => {
      logger.log(logger.INFO, 'Successfully created token');
      response.cookie('nps-token', token, { maxAge: 900000 });
      return response.send(token);
    })
    .catch(next);
});

export default accountRouter;
