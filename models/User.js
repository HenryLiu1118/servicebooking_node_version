const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define(
  'user',
  {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: Sequelize.STRING,
    create_at: {
      type: Sequelize.DATE
    },
    update_at: {
      type: Sequelize.DATE
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = User;
