const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const ServiceProvide = sequelize.define(
  'service_provide',
  {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    detail: Sequelize.STRING,
    price: Sequelize.STRING
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = ServiceProvide;
