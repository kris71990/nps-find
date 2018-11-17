'use strict';

const Report = (sequelize, DataTypes) => sequelize.define('report', {
  parkId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  parkName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lengthOfStay: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  activities: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  wildlife: {
    type: DataTypes.STRING(1000),
  },
});

export default Report;
