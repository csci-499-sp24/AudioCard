const express = require('express');
const router = express.Router({ mergeParams: true });
const { Cardset, User, SharedCardset, CardsetNotification } = require('../models/modelRelations');
const { checkCardsetAuthority } = require('./functions');
const { Sequelize } = require('sequelize');

//Cardsets shared with user
router.route('/:userid/cardsets/:cardsetid/shared')
    .get(async (req, res) => {
        try {
            const { userid, cardsetid } = req.params;
            const sharedCardsets = await SharedCardset.findAll({
                where: {
                    userId: userid,
                    cardsetId: cardsetid
                }
            });
            res.status(200).json(sharedCardsets);
        } catch (error) {
            console.error('Error fetching shared cardsets:', error);
            res.status(500).json({ error: 'Error fetching shared cardsets' });
        }
    });

router.route('/:userid/cardsets/shared')
    .get(async (req, res) => {
        try {
            const { userid } = req.params;
            const sharedCardsets = await SharedCardset.findAll({
                where: {
                    userId: userid,
                    authority: {
                        [Sequelize.Op.ne]: 'revoked'
                    }
                }
            });
            res.status(200).json(sharedCardsets);
        } catch (error) {
            console.error('Error fetching shared cardsets:', error);
            res.status(500).json({ error: 'Error fetching shared cardsets' });
        }
    });

//Managing a cardsets share options
//takes userid(user making the request) and cardsetid in url params
//and takes query params userid(user to be granted access) and authority ('read-only', 'edit', 'admin')
router.route('/:cardsetid/share')
    .post(async (req, res) => { //Grant a user access to cardset
        try {
            const authLevel = await checkCardsetAuthority(req.params.userid, req.params.cardsetid);
            if (authLevel == 'admin' || authLevel == 'edit' || authLevel == 'owner') {
                if (authLevel == 'edit' && req.params.authority == 'admin') {
                    res.status(403).json('User is not authorized to assign this authority level');
                    return;
                }
                const user = await User.findOne({ where: { id: req.query.userid } });
                const cardset = await Cardset.findOne({ where: { id: req.params.cardsetid } });
                const existingSharedCardset = await SharedCardset.findOne({
                    where: {
                        userId: user.id,
                        cardsetId: cardset.id
                    }
                });

                if (existingSharedCardset) {
                    if (existingSharedCardset.authority === req.params.authority){
                        return res.status(409).json('User already has access to the cardset');
                    } else {
                        await existingSharedCardset.update({
                            authority: req.query.authority
                        });
                        await existingSharedCardset.destroy();
                    }
                }
                //
                const sharedCardset = await cardset.addSharedWithUser(user, {
                    through: { authority: req.query.authority },
                    attributes: ['id']
                });
                if (!sharedCardset) {
                    res.status(409).json('User already has access to the cardset');
                    return;
                }
                const existingRequestNotification = await CardsetNotification.findOne({
                    where: {
                        senderId: user.id,
                        cardsetId: req.params.cardsetid, 
                        type: 'request', 
                    }
                });
                if (existingRequestNotification){
                    await existingRequestNotification.destroy();
                }
                await user.createCardsetNotification({
                    senderId: req.params.userid, 
                    cardsetId: req.params.cardsetid, 
                    type: 'grant', 
                    authority: req.query.authority
                });
                res.status(200).json({
                    message: `Card set shared with user ${user.username}`,
                    data: sharedCardset
                });
            } else {
                res.status(403).send('User is not authorized to make this request');
            }
        } catch (error) {
            console.error('Error sharing cardset:', error);
            res.status(500).json({ error: 'Error sharing cardset' });
        }
    })
    .delete(async (req, res) => { //Remove user access to cardset
        try {
            const authLevel = await checkCardsetAuthority(req.params.userid, req.params.cardsetid);
            if (authLevel == 'admin' || authLevel == 'owner') {
                const user = await User.findOne({ where: { id: req.query.userid } });
                const cardset = await Cardset.findOne({ where: { id: req.params.cardsetid } });
                const sharedCardset = await SharedCardset.findOne({
                    where: {
                        userId: req.query.userid,
                        cardsetId: req.params.cardsetid,
                        include: ['id']
                    }
                })
                if (sharedCardset) {
                    user.createCardsetNotification({
                        senderId: req.params.userid, 
                        cardsetId: req.params.cardsetid, 
                        type: 'revoke', 
                        authority: sharedCardset[0].dataValues.authority
                    });

                    res.status(200).send(`User ${user.username}'s access to cardset ${cardset.title} has been revoked`);
                } else {
                    res.status(404).send(`User ${user.username}'s association record was not found`);
                }
            } else {
                res.status(403).send(`User is not authorized to make this request`);
            }
        } catch (error) {
            console.error('Error removing cardset access:', error);
            res.status(500).json({ error: 'Error removing cardset access' });
        }
    })
    .put(async (req, res) => { //Update user access level. Takes userid and authority in query params
        try {
            const authLevelofRequest = await checkCardsetAuthority(req.params.userid, req.params.cardsetid);
            const authLevelofTarget = await checkCardsetAuthority(req.query.userid, req.params.cardsetid);
            if (authLevelofTarget == 'owner' || (authLevelofRequest == 'admin' && authLevelofTarget == 'admin')) {
                res.status(403).send(`User is authorization is too low to make this request`);
                return;
            }
            if (authLevelofRequest == 'admin' || authLevelofRequest == 'owner') {
                const sharedCardset = await SharedCardset.update(
                    { authority: req.query.authority },
                    {
                        where: {
                            userId: req.query.userid,
                            cardsetId: req.params.cardsetid
                        }
                    });
                if (sharedCardset[0] === 0) {
                    res.status(404).send(`User association record was not found`);
                    return;
                }
                res.status(200).json('Updated user access level');
            } else {
                res.status(403).send(`User is not authorized to make this request`);
            }
        } catch (error) {
            console.error('Error updating card set access:', error);
            res.status(500).json({ error: 'Error updating card set access' });
        }
    });


router.route('/:cardsetid/emails')
    .get(async (req, res) => {
        try {
            const { cardsetid } = req.params;
            const sharedCardsets = await SharedCardset.findAll({
                where: {
                    cardsetId: cardsetid,
                    authority: {
                        [Sequelize.Op.ne]: 'revoked' //Exclude entries of revoked access
                    }
                }

            });

            // Extracting user IDs from the sharedCardsets
            const userIds = sharedCardsets.map(sharedCardset => sharedCardset.userId);

            res.status(200).json({ userIds: userIds }); // Return user IDs in a JSON object
        } catch (error) {
            console.error('Error fetching user IDs associated with cardset:', error);
            res.status(500).json({ error: 'Error fetching user IDs associated with cardset' });
        }
    });

router.route('/:cardsetid/:userId/authority')
    .get(async (req, res) => {
        try {
            const { cardsetid, userId } = req.params;
            const sharedCardset = await SharedCardset.findOne({
                where: {
                    cardsetId: cardsetid,
                    userId: userId,
                }
            });

            if (!sharedCardset) {
                return res.status(404).json({ error: 'User not authorized for this cardset' });
            }

            res.status(200).json({ authority: sharedCardset.authority }); // Return authority
        } catch (error) {
            console.error('Error fetching authority associated with user and cardset:', error);
            res.status(500).json({ error: 'Error fetching authority associated with user and cardset' });
        }
    });

router.route('/:cardsetid/:userId/authority')
    .delete(async (req, res) => {
        try {
            const { cardsetid, userId } = req.params;
            const { currentUserId } = req.body;
            const user = await User.findOne({ where: { id: userId } });
            const sharedCardset = await SharedCardset.findOne({
                where: {
                    cardsetId: cardsetid,
                    userId: userId,
                }
            });
            if (!sharedCardset) {
                return res.status(404).json({ error: 'User not authorized for this cardset' });
            }
            user.createCardsetNotification({
                senderId: currentUserId, 
                cardsetId: req.params.cardsetid, 
                type: 'revoke', 
                authority: sharedCardset.authority
            });
            await sharedCardset.destroy(); // Delete the sharedCardset record
            res.status(200).json({ message: 'Authority deleted successfully' });
        } catch (error) {
            console.error('Error deleting authority associated with user and cardset:', error);
            res.status(500).json({ error: 'Error deleting authority associated with user and cardset' });
        }
    });

router.route('/:cardsetid/:userId/authority')
    .put(async (req, res) => {
        try {
            const { cardsetid, userId } = req.params; //userId is id of target user
            const sharedCardset = await SharedCardset.findOne({
                where: {
                    cardsetId: cardsetid,
                    userId: userId,
                }
            });
            if (!sharedCardset) {
                return res.status(404).json({ error: 'User not authorized for this cardset' });
            }
            await sharedCardset.destroy(); 

            res.status(200).json({ message: 'Authority deleted successfully' });
        } catch (error) {
            console.error('Error deleting authority associated with user and cardset:', error);
            res.status(500).json({ error: 'Error deleting authority associated with user and cardset' });
        }
    });


router.route('/:cardsetid/delete')
    .delete(async (req, res) => {
        try {
            const { cardsetid } = req.params;
            const deletedRows = await SharedCardset.destroy({
                where: {
                    cardsetId: cardsetid,
                    authority: 'friend-only'
                }
            });
            res.status(200).json({ message: `Deleted ${deletedRows} rows associated with cardsetid ${cardsetid}` });
        } catch (error) {
            console.error('Error deleting rows associated with cardsetid:', error);
            res.status(500).json({ error: 'Error deleting rows associated with cardsetid' });
        }
    });



module.exports = router;