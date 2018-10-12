'use strict';

const State = (sequelize, DataTypes) => sequelize.define('state', {
  stateId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalParks: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalMonuments: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalMemorials: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalHistoricSites: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalHistoricTrails: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalRecreationAreas: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalHistoricalPark: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalHistoricalReserve: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalGeologicTrails: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalAffiliatedAreas: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalBattlefields: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalBattlefieldParks: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalBattlefieldSites: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalMilitaryParks: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalInternationalHistoricSites: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalLakeshores: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalParkways: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalPreserves: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalReserves: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalRivers: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalWildRiverways: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalScenicTrails: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalSeashores: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalHeritageAreas: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalNationalTrailSystems: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalOther: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

export default State;
