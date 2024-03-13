const express = require('express');
const router = express.Router();
const { Cardset, Flashcard } = require('../models/modelRelations');

//route for flashcards of a set (uses api/users/:userid/cardsets/:cardsetid)
router.route('/:cardsetid')
.post(async(req, res) => {
    try{
        const { cardsetId, newCardData } = req.body;
        const id = cardsetId
        const cardset = await Cardset.findOne({where: { id }});
        const flashcard = await Flashcard.create(newCardData);
        await cardset.addFlashcard(flashcard);
        res.status(201).json({ flashcard });
    } catch (error) {
        console.error('Error creating flashcard:', error);
        res.status(500).json({ error: 'Error creating a flashcard' });
    }
})
.get(async(req, res) => {
    try{
        const flashcards = await Flashcard.findAll({ where: { cardsetid: req.params.cardsetid }})
        res.status(200).json({ flashcards });
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        res.status(500).json({ error: 'Error fetching flashcards' });
    }
});

module.exports = router;