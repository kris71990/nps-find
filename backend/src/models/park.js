'use strict';

const Park = (sequelize, DataTypes) => sequelize.define('park', {
  parkCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stateCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pKeyCode: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING,
  },
  directionsInfo: {
    type: DataTypes.STRING(1000),
  },
  fullName: {
    type: DataTypes.STRING,
  },
  imageUrl: {
    type: DataTypes.STRING(4000),
  },
  imageCaptions: {
    type: DataTypes.STRING(2000),
  },
  latLong: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  states: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
  },
  weatherInfo: {
    type: DataTypes.STRING(1000),
  },
});

export default Park;
