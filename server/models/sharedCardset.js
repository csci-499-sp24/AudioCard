const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');

const SharedCardset = db.define('sharedCardset',{
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cardsetId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    authority: {
        type: DataTypes.ENUM('read-only', 'edit', 'admin'),
        allowNull: false,
        defaultValue: 'read-only'
    }
}, {
    validate: {
        async checkDuplicate(){
            const existingEntry = await SharedCardset.findOne({
                where: {
                    userId: this.userId,
                    cardsetId: this.cardsetId
                }
            });
            if(existingEntry) {
                throw new Error('Duplicate Entry, entry not created');
            }
        }
    }
}

);

module.exports = SharedCardset;