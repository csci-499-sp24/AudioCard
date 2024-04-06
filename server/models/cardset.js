const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');

const Cardset = db.define('cardset',{
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isFriendsOnly: {
        type: DataTypes.BOOLEAN,
        default: false,
        allowNull: false
    }
});

module.exports = Cardset;