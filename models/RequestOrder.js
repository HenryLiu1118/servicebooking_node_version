const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Request0rder = sequelize.define(
  'request_order',
  {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    info: Sequelize.STRING,
    active: Sequelize.BOOLEAN,
    create_at: {
      type: Sequelize.DATE,
      default: Date.now
    },
    update_at: {
      type: Sequelize.DATE,
      default: Date.now
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Request0rder;
