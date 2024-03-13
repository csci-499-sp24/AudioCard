const express = require('express');
const router = express.Router();
const { User, Cardset } = require('../models/modelRelations');
const flashcards = require ('./flashcards');

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
})

//Users cardsets
router.route('/:userid/cardsets')
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
.get(async(req, res) => {
    try{
        const cardsets = await Cardset.findAll({ where: { userId: req.params.userid }})
        res.status(200).json({ cardsets });
    } catch (error) {
        console.error('Error fetching card sets:', error);
        res.status(500).json({ error: 'Error fetching card sets' });
    }
})
.delete(
    async(req, res) => {
        try{
            //Implementation for deleting cardsets from a user
        } catch (error) {
            console.error('Error fetching card sets:', error);
            res.status(500).json({ error: 'Error fetching card sets' });
        }
})

router.use('/:userid/cardsets', flashcards);

module.exports = router;