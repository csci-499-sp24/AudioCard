const express = require('express');
const router = express.Router();
const { Cardset, User, Flashcard, SharedCardset } = require('../models/modelRelations');
const flashcards = require ('./flashcards');
const { Sequelize } = require('sequelize');

router.route('/')
.get(async (req, res) => {
    try {
        const publicSets = await Cardset.findAll({
            where: { isPublic: true },
            include: [
                {
                    model: Flashcard,
                    attributes: [],
                    duplicating: false,
                },
                {
                    model: User,
                    attributes: ['username'] 
                }
            ],
            attributes: {
                include: [
                    [Sequelize.fn("COUNT", Sequelize.col("flashcards.id")), "flashcardCount"]
                ]
            },
            group: ['cardset.id', 'user.id'],
        });
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

//Get specific card set and users with access
router.route('/:cardsetid')
.get(async(req,res) => {
    try{
        const cardset = await Cardset.findOne({
            where: { id: req.params.cardsetid }, 
            include: [{
                model: User,
                as: 'sharedWithUser',
                attributes: ['id', 'username', 'email'],
                through: {
                    attributes: ['authority']
                }
            }],
        });
        res.status(200).json(cardset);
    } catch(error) {
        console.error('Error getting cardset:', error);
        res.status(500).json({ error: 'Error getting cardset' });
    }
});

router.use('/', flashcards);

module.exports = router;