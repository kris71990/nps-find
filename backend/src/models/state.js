'use strict';

const State = (sequelize, DataTypes) => sequelize.define('state', {
  stateId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  totalParks: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

export default State;
