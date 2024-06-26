const { Cardset, SharedCardset } = require('../models/modelRelations');

async function checkCardsetAuthority(userid, cardsetid) {
    try {
        const sharedCardset = await SharedCardset.findOne({
            where: {
                userId: userid,
                cardsetId: cardsetid
            }
        });
        const cardset = await Cardset.findOne({
            where: {
                userId: userid,
                id: cardsetid
            }
        });
        switch (true) {
            case cardset !== null:
                return 'owner';
            case sharedCardset === null:
                return 'no-access';
            case sharedCardset.authority === 'read-only':
                return 'read-only';
            case sharedCardset.authority === 'edit':
                return 'edit';
            case sharedCardset.authority === 'admin':
                return 'admin';
            case sharedCardset.authority === 'friend-only':
                return 'friend-only';
            default:
                return 'no-access';
        }
    } catch (error) {
        console.error('Error checking user authority:', error);
        // You should handle the error appropriately here
        throw error;
    }
}

module.exports = { checkCardsetAuthority };