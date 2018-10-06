'use strict';

const State = (sequelize, DataTypes) => sequelize.define('state', {
  stateCode: {
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

State.associate = (models) => {
  models.state.hasMany(models.Park);
};

export default State;
