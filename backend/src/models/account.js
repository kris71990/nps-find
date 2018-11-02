'use strict';

// import bcrypt from 'bcrypt';
// import crypto from 'crypto';
// import jsonWebToken from 'jsonwebtoken';
// import HttpError from 'http-errors';

// const HASH_ROUNDS = 8;
// const TOKEN_SEED_LENGTH = 128;

const Account = (sequelize, DataTypes) => sequelize.define('account', {
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

// Account.generateToken = function generateToken() {
//   this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
//   return this.save()
//     .then((account) => {
//       return jsonWebToken.sign({
//         tokenSeed: account.tokenSeed,
//       }, process.env.ACCOUNT_SECRET);
//     })
//     .catch(() => new HttpError(401, 'Error creating token'));
// };

// Account.verifyPassword = function verifyPassword(password) {
//   return bcrypt.compare(password, this.passwordHash)
//     .then((result) => {
//       if (!result) {
//         throw new HttpError(400, 'AUTH - incorrect password');
//       }
//       return this;
//     });
// };

export default Account;
