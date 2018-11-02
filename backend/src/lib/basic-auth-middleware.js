'use strict';

import HttpError from 'http-errors';
import models from '../models/index';

// const verifyPassword = function verifyPassword(password, account) {
//   return bcrypt.compare(password, account.passwordHash)
//     .then((result) => {
//       if (!result) {
//         throw new HttpError(400, 'AUTH - incorrect password');
//       }
//       return this;
//     });
// };

export default (request, response, next) => {
  console.log(request.headers.authorization);
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }

  const base64AuthHeader = request.headers.authorization.split('Basic ')[1];
  console.log(base64AuthHeader);
  if (!base64AuthHeader) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }

  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  const [username, password] = stringAuthHeader.split(':');

  if (!username || !password) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }

  console.log(username);
  return models.account.findOne({ where: { username } })
    .then((account) => {
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
