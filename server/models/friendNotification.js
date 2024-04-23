const { DataTypes, Op } = require('sequelize');
const db = require('../config/db');

const FriendNotification = db.define('friendNotification',{
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
    type: {
        type: DataTypes.ENUM('pending', 'confirmed', 'denied', 'unfriended'),
        allowNull: false
    },
}
);

module.exports = FriendNotification;