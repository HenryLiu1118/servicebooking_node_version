const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Role = sequelize.define(
  'role',
  {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      unique: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Role;
