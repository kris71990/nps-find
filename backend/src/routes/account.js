'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jsonWebToken from 'jsonwebtoken';

import models from '../models';
import basicAuthMiddleware from '../lib/basic-auth-middleware';
import logger from '../lib/logger';

const accountRouter = new Router();
const jsonParser = json();

const HASH_ROUNDS = 8;
const TOKEN_SEED_LENGTH = 128;

// Account.createAccount = function (username, email, password) { // eslint-disable-line
//   console.log('dfdsfdsf');
//   return bcrypt.hash(password, HASH_ROUNDS)
//     .then((passwordHash) => {
//       password = null; //eslint-disable-line
//       const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
//       return Account.create({
//         username,
//         email,
//         passwordHash,
//         tokenSeed,
//       });
//     });
// };

const generateToken = function generateToken(account) {
  return account.update({ tokenSeed: crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex') })
    .then((updatedAccount) => {
      return jsonWebToken.sign({
        tokenSeed: updatedAccount.tokenSeed,
      }, process.env.ACCOUNT_SECRET);
    })
    .catch(() => new HttpError(401, 'Error creating token'));
};

// const verifyPassword = function verifyPassword(password) {
//   return bcrypt.compare(password, this.passwordHash)
//     .then((result) => {
//       if (!result) {
//         throw new HttpError(400, 'AUTH - incorrect password');
//       }
//       return this;
//     });
// };

accountRouter.post('/signup', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, `Creating account for username '${request.body.username}'`);

  return bcrypt.hash(request.body.password, HASH_ROUNDS)
    .then((passwordHash) => {
      request.body.password = null; //eslint-disable-line
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');

      return models.account.create({ 
        username: request.body.username, 
        email: request.body.email, 
        passwordHash, 
        tokenSeed,
      })
        .then((account) => {
          console.log(account);
          delete request.body.password;
          logger.log(logger.INFO, 'Creating auth token');
          return generateToken(account);
        })
        .then((token) => {
          logger.log(logger.INFO, 'Successfully created token');
          response.cookie('nps-token', token, { maxAge: 900000 });
          return response.send(token);
        })
        .catch(next);
    });
});

accountRouter.get('/login', basicAuthMiddleware, (request, response, next) => {
  if (!request.account) return next(new HttpError(400), 'Invalid account');
  return generateToken(request.account)
    .then((token) => {
      logger.log(logger.INFO, 'Successfully created token');
      response.cookie('nps-token', token, { maxAge: 900000 });
      return response.send(token);
    })
    .catch(next);
});

export default accountRouter;
