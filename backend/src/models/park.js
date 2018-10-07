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
});

Park.associate = (models) => {
  models.park.belongsTo(models.state, {
    foreignKey: 'stateCode',
    targetKey: 'stateCode',
  });
};

export default Park;
