'use strict';

const State = (sequelize, DataTypes) => sequelize.define('state', {
  stateId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default State;
