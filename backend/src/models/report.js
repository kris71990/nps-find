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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lengthOfStay: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  activities: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wildlife: {
    type: DataTypes.STRING,
  },
});

export default Report;
