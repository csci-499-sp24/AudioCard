const { DataTypes, Op } = require('sequelize');
const db = require('../config/db');

const RevokedCardsetNotification = db.define('revokedCardsetNotification',{
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
});

module.exports = RevokedCardsetNotification;