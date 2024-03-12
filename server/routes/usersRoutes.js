const express = require('express');
const router = express.Router();
const { User, Cardset } = require('../models/modelRelations');

router.route('/signup')
.post(async (req, res) => {
    try {
        const { firebaseId, username, email } = req.body;
        const user = await User.create({ firebaseId, username, email });
        res.status(201).json({ user });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ error: 'Error signing up user' });
    }
});

//Get user's database entry using their firebaseId
router.route('/getuser')
.get(async(req, res) => {
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