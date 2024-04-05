const express = require('express');
const router = express.Router({ mergeParams: true });
const { Cardset, User, SharedCardset } = require('../models/modelRelations');
const { checkCardsetAuthority } = require('./functions');

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
                    userId: userid
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
                const sharedCardset = await cardset.addSharedWithUser(user, {
                    through: { authority: req.query.authority }
                });
                if (!sharedCardset) {
                    res.status(409).json('User already has access to the cardset');
                    return;
                }
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
                        cardsetId: req.params.cardsetid
                    }
                })
                if (sharedCardset) {
                    await cardset.removeSharedWithUser(user);
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
                    authority: ['admin', 'edit']
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






module.exports = router;