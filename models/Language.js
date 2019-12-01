const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Language = sequelize.define(
  'language',
  {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Language;
