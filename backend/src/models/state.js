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
  models.state.hasMany(models.Park, {
    foreignKey: 'stateCode',
    sourceKey: 'stateCode',
  });
};

export default State;
