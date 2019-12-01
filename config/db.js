const Sequelize = require('sequelize');

const sequelize = new Sequelize('servicebooking', 'root', '0603018liu', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
