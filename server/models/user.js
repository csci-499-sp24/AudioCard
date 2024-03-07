const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');

const User = db.define('user', {
  firebaseId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

});

module.exports = User;