'use strict';

import HttpError from 'http-errors';
import models from '../models/index';

export default (request, response, next) => {
  console.log(request.headers.authorization);
  if (!request.headers.authorization) next(new HttpError(400, 'AUTH - invalid request'));

  const base64AuthHeader = request.headers.authorization.split('Basic ')[1];
  if (!base64AuthHeader) next(new HttpError(400, 'AUTH - invalid request'));

  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  console.log(stringAuthHeader);
  const [username, password] = stringAuthHeader.split(':');

  if (!username || !password) next(new HttpError(400, 'AUTH - invalid request'));

  console.log(username);
  return models.account.findOne({ where: { username } })
    .then((account) => {
      console.log(account);
      if (!account) {
        return next(new HttpError(400, 'AUTH -invalid request'));
      }
      console.log(account);
      return account.verifyPassword(password);
    })
    .then((account) => {
      request.account = account;
      return next();
    })
    .catch(next);
};
