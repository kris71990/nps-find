'use strict';

const Campground = (sequelize, DataTypes) => sequelize.define('campground', {
  parkId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(2000),
  },
  latLong: {
    type: DataTypes.STRING,
  },
  directionsOverview: {
    type: DataTypes.STRING(1000),
  },
  campsites: {
    type: DataTypes.JSON,
  },
  amenities: {
    type: DataTypes.JSON,
  },
  accessibility: {
    type: DataTypes.JSON,
  },
});

export default Campground;
