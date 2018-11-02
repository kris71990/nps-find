'use strict';

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jsonWebToken from 'jsonwebtoken';
import HttpError from 'http-errors';

const HASH_ROUNDS = 8;
const TOKEN_SEED_LENGTH = 128;

export default (sequelize, DataTypes) => {
  const Account = sequelize.define('account', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    tokenSeed: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      unique: true,
    },
  });

  Account.generateToken = function (account) { // eslint-disable-line
    account.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
    return account.save()
      .then(() => {
        return jsonWebToken.sign({
          tokenSeed: account.tokenSeed,
        }, process.env.ACCOUNT_SECRET);
      })
      .catch(() => new HttpError(401, 'Error creating token'));
  };
  
  Account.verifyPassword = function (password, account) { // eslint-disable-line
    return bcrypt.compare(password, account.passwordHash)
      .then((result) => {
        if (!result) {
          throw new HttpError(400, 'AUTH - incorrect password');
        }
        return account;
      });
  };

  Account.createAccount = function (username, email, password) { // eslint-disable-line
    return bcrypt.hash(password, HASH_ROUNDS)
      .then((passwordHash) => {
        password = null; //eslint-disable-line
        const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
        return Account.create({
          username,
          email,
          passwordHash,
          tokenSeed,
        });
      });
  };
  return Account;
};
