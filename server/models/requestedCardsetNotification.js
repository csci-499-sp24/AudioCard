const { DataTypes, Op } = require('sequelize');
const db = require('../config/db');

const RequestedCardsetNotification = db.define('requestedCardsetNotification',{
    id: {
        field: 'id',
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    recipientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    cardsetId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    authority: {
        type: DataTypes.ENUM('read-only', 'edit', 'admin'),
        allowNull: false
    }
});

module.exports = RequestedCardsetNotification;