const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const UserInfo = sequelize.define(
  'user_info',
  {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    streetname: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    zipcode: Sequelize.INTEGER,
    phone: Sequelize.STRING
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = UserInfo;
