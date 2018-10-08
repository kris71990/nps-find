'use strict';

const Park = (sequelize, DataTypes) => sequelize.define('park', {
  parkCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  stateCode: {
    type: DataTypes.STRING,
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
    type: DataTypes.STRING,
  },
  fullName: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
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
    type: DataTypes.STRING,
  },
});

// Park.associate = (models) => {
//   models.park.belongsTo(models.state, {
//     foreignKey: 'stateCode',
//     targetKey: 'stateId',
//   });
// };

export default Park;
