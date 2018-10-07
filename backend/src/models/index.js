'use strict';

import Sequelize from 'sequelize';
import logger from '../lib/logger';

const db = {};
const DATABASE_URL = process.env.DATABASE_URL;
const sequelize = new Sequelize(DATABASE_URL, {
  logging: logger.info,
});

const state = sequelize.import('./state.js');
const park = sequelize.import('./park.js');
db[state.name] = state;
db[park.name] = park;

Object.keys(db).forEach((model) => {
  if (db[model].associate) {
    db[model].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
