'use strict';

require('dotenv').config();

if (!process.env.NODE_ENV) {
  throw new Error('NODE_ENV is undefined');
}

if (process.env.NODE_ENV !== 'production') {
  console.log('--- DEVELOPMENT SETTINGS ---');
  require('babel-register');
  require('./src/main');
} else {
  console.log('--- PRODUCTION SETTINGS ---');
  require('./build/main'); // eslint-disable-line
}
