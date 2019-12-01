const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Comment = sequelize.define(
  'comment',
  {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    detail: Sequelize.STRING
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Comment;
