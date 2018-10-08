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

state.hasMany(park, {
  foreignKey: 'stateCode',
  sourceKey: 'stateId',
});

park.belongsTo(state, {
  foreignKey: 'stateCode',
  targetKey: 'stateId',
});

db[state.name] = state;
db[park.name] = park;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
