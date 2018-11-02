'use strict';

const Profile = (sequelize, DataTypes) => sequelize.define('profile', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.NUMBER,
  },
  homeState: {
    type: DataTypes.STRING,
  },
  account: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Profile;
