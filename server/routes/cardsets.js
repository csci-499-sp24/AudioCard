const express = require('express');
const router = express.Router();
const { Cardset, User } = require('../models/modelRelations');
const flashcards = require ('./flashcards');

router.route('/')
.get(async(req, res) => {
    try{
        const publicSets = await Cardset.findAll({ where:{ isPublic: true}});
        res.status(200).json({publicSets});
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
})

router.use('/', flashcards);

module.exports = router;