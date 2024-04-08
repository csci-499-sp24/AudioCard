const { User, Friend, Cardset, SharedCardset } = require('./modelRelations');

async function grantReadOnlyAccessToFriends(cardsetOwnerId, cardsetId) {
    try {
        const cardsetOwner = await User.findByPk(cardsetOwnerId);
        const cardset = await Cardset.findByPk(cardsetId);

        if (!cardsetOwner || !cardset) {
            throw new Error('Invalid cardset owner or cardset ID');
        }

        const friends = await User.findAll({
            include: [{
                model: Friend,
                where: {
                    [Op.or]: [
                        { user1Id: cardsetOwnerId },
                        { user2Id: cardsetOwnerId }
                    ],
                    status: 'accepted'
                },
                attributes: []
            }]
        });

        await Promise.all(friends.map(async (friend) => {
            if (friend !== null) {
                await SharedCardset.create({
                    userId: friend.id,
                    cardsetId,
                    authority: 'read-only'
                });
            }
        }));

        console.log('Read-only access granted to friends without share access.');
    } catch (error) {
        console.error('Error granting read-only access to friends:', error);
        throw error;
    }
}
module.exports = { grantReadOnlyAccessToFriends };