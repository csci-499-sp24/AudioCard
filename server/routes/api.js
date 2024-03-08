const express = require('express');
const router = express.Router();
const {User, Cardset, Flashcard} = require('../models/modelRelations');

// Route for user sign-up
router.post('/signup', async (req, res) => {
    try {
        const { firebaseId, username, email } = req.body;

        // Create user in the database using Sequelize
        const user = await User.create({ firebaseId, username, email });

        res.status(201).json({ user });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ error: 'Error signing up user' });
    }
});

router.post('/createcardset', async(req, res) => {
    try{
        const { userId, newSetData } = req.body;
        const firebaseId = userId;
        const user = await User.findOne({where: { firebaseId }});
        const cardset = await Cardset.create(newSetData);
        await user.addCardset(cardset);
        res.status(201).json({ cardset });
    } catch (error) {
        console.error('Error creating cardset:', error);
        res.status(500).json({ error: 'Error creating a cardset' });
    }
});

router.post('/createflashcard', async(req, res) => {
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
});

router.get('/getcardsets', async(req, res) => {
    try{
        const { userId } = req.query;
        const cardsets = await Cardset.findAll({ where: { userId }})
        res.status(200).json({ cardsets });
    } catch (error) {
        console.error('Error fetching card sets:', error);
        res.status(500).json({ error: 'Error fetching card sets' });
    }
});

router.get('/getflashcards', async(req, res) => {
    try{
        const { cardsetId } = req.query;
        const flashcards = await Flashcard.findAll({ where: { cardsetId }})
        res.status(200).json({ flashcards });
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        res.status(500).json({ error: 'Error fetching flashcards' });
    }
});

router.get('/getuser', async(req, res) => {
    try{
        const { firebaseId } = req.query;
        const user = await User.findOne({ where: { firebaseId }});
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching database user:', error);
        res.status(500).json({ error: 'Error fetching database user' });
    }
});

module.exports = router;