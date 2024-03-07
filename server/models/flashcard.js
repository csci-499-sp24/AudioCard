const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');

const Flashcard = db.define('flashcard', {
    term: {
        type: DataTypes.STRING,
        allowNull: false
    },
    definition: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Flashcard;