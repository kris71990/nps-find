'use strict';

const Profile = (sequelize, DataTypes) => sequelize.define('profile', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  homeState: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  interests: {
    type: DataTypes.STRING,
  },
  residentialLocaleType: {
    type: DataTypes.STRING,
  },
  favoredClimate: {
    type: DataTypes.STRING,
  },
  favoredLandscape: {
    type: DataTypes.STRING,
  },
});

export default Profile;
