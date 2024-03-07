const express = require('express');
const router = express.Router();
const {User, Cardset} = require('../models/modelRelations');

// Route for user sign-up
router.post('/signup', async (req, res) => {
    try {
        const { username, email } = req.body;

        // Create user in the database using Sequelize
        const user = await User.create({ username, email });

        res.status(201).json({ user });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ error: 'Error signing up user' });
    }
});

router.post('/createcardset', async(req, res) => {
    try{
        const cardsetData = req.body;
        const cardset = await Cardset.create(cardsetData);
        res.status(201).json({ cardset });
    } catch (error) {
        console.error('Error creating cardset:', error);
        res.status(500).json({ error: 'Error creating a cardset' });
    }
});

module.exports = router;