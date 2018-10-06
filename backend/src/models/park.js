'use strict';

const Park = (sequelize, DataTypes) => sequelize.define('park', {
  parkCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },

  // stateCode: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  //   references: {
  //     model: models.state,

  //   }
  // }
});

Park.associate = (models) => {
  models.park.belongsTo(models.state, {
    onDelete: 'Cascade',
    foreignKey: {
      allowNull: false,
    },
  });
};

export default Park;
