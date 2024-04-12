const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');

const Notification = db.define('notification', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
  },
  type: {
    type: DataTypes.ENUM('sharedCardset', 'friend'),
    allowNull: false
  },
  sourceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

});

module.exports = Notification;