const express = require('express');
const router = express.Router();
const User = require('../models/user');

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

module.exports = router;