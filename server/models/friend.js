const { DataTypes, Op } = require('sequelize');
const db = require('../config/db');

const Friend = db.define('friend',{
    user1Id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user2Id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        allowNull: false
    },
}
);

module.exports = Friend;