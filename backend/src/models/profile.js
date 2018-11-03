'use strict';

const Profile = (sequelize, DataTypes) => sequelize.define('profile', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  homeState: {
    type: DataTypes.STRING,
  },
});

export default Profile;
