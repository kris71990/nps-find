'use strict';

import Sequelize from 'sequelize';
import logger from '../lib/logger';

const db = {};
const DATABASE_URL = process.env.DATABASE_URL;
const sequelize = new Sequelize(DATABASE_URL, {
  logging: logger.info,
});

const state = sequelize.import('state');
db[state.name] = state;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
