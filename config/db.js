const Sequelize = require('sequelize');

const sequelize = new Sequelize('servicebooking', 'root', '0603018liu', {
  //host: 'localhost',
  host: 'servicebookingrds.c2g4pj5ev9gn.us-east-2.rds.amazonaws.com',
  dialect: 'mysql'
});

module.exports = sequelize;
