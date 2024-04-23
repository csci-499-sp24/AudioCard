const { DataTypes, Op } = require('sequelize');
const db = require('../config/db');

const GrantedCardsetNotification = db.define('grantedCardsetNotification',{
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
    sharedCardsetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sharedCardsets',
            key: 'id'
        }
    },
});

module.exports = GrantedCardsetNotification;