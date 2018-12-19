'use strict';

import Sequelize from 'sequelize';

const db = {};

const DATABASE_URL = process.env.DATABASE_URL;
const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
});

const state = sequelize.import('./state.js');
const park = sequelize.import('./park.js');
const campground = sequelize.import('./campground.js');
const account = sequelize.import('./account.js');
const profile = sequelize.import('./profile.js');
const report = sequelize.import('./report.js');

profile.belongsTo(account, { as: 'account' });

state.hasMany(park, {
  foreignKey: 'stateCode',
  sourceKey: 'stateId',
});

park.belongsTo(state, {
  foreignKey: 'stateCode',
  targetKey: 'stateId',
});

campground.belongsTo(park, {
  foreignKey: 'parkId',
  targetKey: 'pKeyCode',
});

profile.hasMany(report, {
  foreignKey: 'profileId',
  sourceKey: 'id',
});

park.hasMany(report, {
  foreignKey: 'parkId',
  sourceKey: 'pKeyCode',
});

db[account.name] = account;
db[profile.name] = profile;
db[state.name] = state;
db[park.name] = park;
db[campground.name] = campground;
db[report.name] = report;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
