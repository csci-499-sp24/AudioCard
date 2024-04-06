const express = require('express');
const router = express.Router();
const { Cardset, User, Flashcard, SharedCardset, Friend } = require('../models/modelRelations');
const flashcards = require ('./flashcards');
const { Sequelize, Op } = require('sequelize');

router.use('/:cardsetid/flashcards', flashcards);

router.route('/')
.get(async (req, res) => {
    try {
        // sequelize doesn't support subqueries
        // so I am using a dirty workaround
        //const my_userid = await User.findOne({where: { id: req.params.userid }});
        const my_userid=56
        // Using two literals because mySQL doesn't like it when I put them together
        // into one query
        const get_friend_sql = `(SELECT user2Id FROM friends WHERE user1Id IN (${my_userid})
        UNION SELECT user1Id FROM friends WHERE user2Id IN (${my_userid}))`
        
        const publicSets = await Cardset.findAll({
            where: { 
                isPublic: true, 
                userId: { // if the userID is null
                    [Op.not]: null
                },
                [Op.or]: [
                    {isFriendsOnly: false},
                    {
                        //isFriendsOnly: true,
                        [Op.or]: [
                            {
                                userId: {
                                    [Op.in]: Sequelize.literal(get_friend_sql),
                                    //[Op.in]: Sequelize.literal(get_friend2_sql),
                                },
                                
                            }
                        ]
                    }
                ]
            },
            include: [
                {
                    model: Flashcard,
                    attributes: [],
                    duplicating: false,
                },
                {
                    model: User,
                    attributes: ['id', 'username'] 
                },
            ],
            attributes: {
                include: [
                    [Sequelize.fn("COUNT", Sequelize.col("flashcards.id")), "flashcardCount"]
                ]
            },
            group: ['cardset.id', 'user.id'],
        });
        console.log(publicSets.map(set => set.get({ plain: true }))[2])
        res.status(200).json({ publicSets: publicSets.map(set => set.get({ plain: true })) });
    } catch (error) {
        console.error('Error fetching public cardsets:', error);
        res.status(500).json({ error: 'Error fetching public cardsets' });
    }
})
.post(async(req, res) => {
    try{
        const { newSetData } = req.body;
        const user = await User.findOne({where: { id: req.params.userid }});
        const cardset = await Cardset.create(newSetData);
        await user.addCardset(cardset);
        res.status(201).json({ cardset });
    } catch (error) {
        console.error('Error creating cardset:', error);
        res.status(500).json({ error: 'Error creating a cardset' });
    }
});

router.route('/:cardsetId')
.get(async (req, res) => {
    try {
        const { cardsetId } = req.params;
        const cardset = await Cardset.findByPk(cardsetId, {
            include: [
                {
                    model: Flashcard,
                    attributes: ['id', 'term', 'definition'], 
                    duplicating: false,
                },
                {
                    model: User,
                    attributes: ['id', 'username'] 
                }
            ]
        });

        if (!cardset) {
            return res.status(404).json({ error: 'Cardset not found' });
        }

        res.status(200).json(cardset);
    } catch (error) {
        console.error('Error fetching cardset:', error);
        res.status(500).json({ error: 'Error fetching cardset' });
        
    }
});

module.exports = router;