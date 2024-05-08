const express = require('express');
const router = express.Router();
const { Cardset, User, Flashcard, CardsetNotification } = require('../models/modelRelations');
const flashcards = require ('./flashcards');
const { Sequelize } = require('sequelize');

router.use('/:cardsetid/flashcards', flashcards);

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
                    attributes: ['id', 'username'] 
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

router.route('/:cardsetId/request')
.get(async (req, res) => {
    try {
        const { cardsetId } = req.params;
        const requestorId = req.query.requestorId;
        
        const notification = await CardsetNotification.findOne({
            where: { 
                senderId: requestorId,
                cardsetId: cardsetId,
                type: "request" 
            }
            
        });
        if (notification) {
            res.status(200).json(notification);
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        console.error('Error fetching users card set request:', error);
        res.status(500).json({ error: 'Error fetching users card set request' });
    }
})
.post(async (req, res) => {
    try {
        const { cardsetId } = req.params;
        const { requestorId, requestedAuthority } = req.body;
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
        const cardsetOwner = await User.findByPk(cardset.userId);
        if (!cardsetOwner) {
            return res.status(404).json({ error: 'Cardset owner not found' });
        }
        const newNotification = await cardsetOwner.createCardsetNotification({
            senderId: requestorId, 
            cardsetId: cardset.id, 
            type: 'request', 
            authority: requestedAuthority
        })

        res.status(200).json(newNotification);
    } catch (error) {
        console.error('Error fetching cardset:', error);
        res.status(500).json({ error: 'Error fetching cardset' });
        
    }
});

module.exports = router;