const { DataTypes, Op } = require('sequelize');
const db = require('../config/db');

const CardsetNotification = db.define('cardsetNotification',{
    id: {
        field: 'id',
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    recipientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cardsetId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('grant', 'revoke', 'request', 'requestDenied'),
        allowNull: false
    },
    authority: {
        type: DataTypes.ENUM('read-only', 'edit', 'admin'),
        allowNull: false,
    }
});

module.exports = CardsetNotification;