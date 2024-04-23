const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');

const SharedCardset = db.define('sharedCardset',{
    id: {
        field: 'id',
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
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
            if (this.constructor.findOne({ where: { id: this.id } })) {
                return;
            }
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