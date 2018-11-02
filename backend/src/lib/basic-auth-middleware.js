'use strict';

import bcrypt from 'bcrypt';
import HttpError from 'http-errors';
import models from '../models/index';

const verifyPassword = function verifyPassword(password, account) {
  return bcrypt.compare(password, account.passwordHash)
    .then((result) => {
      if (!result) {
        throw new HttpError(400, 'AUTH - incorrect password');
      }
      return this;
    });
};

export default (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }

  const base64AuthHeader = request.headers.authorization.split('Basic ')[1];
  if (!base64AuthHeader) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }

  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  console.log(stringAuthHeader);
  const [username, password] = stringAuthHeader.split(':');

  if (!username || !password) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }

  console.log(username);
  return models.account.findOne({ 
    where: { username },
  })
    .then((account) => {
      console.log(account);
      if (!account) {
        return next(new HttpError(400, 'AUTH - invalid request'));
      }
      return verifyPassword(password, account);
    })
    .then((account) => {
      request.account = account;
      return next();
    })
    .catch(next);
};
