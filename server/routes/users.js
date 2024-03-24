const express = require('express');
const router = express.Router();
const { Cardset, User, Flashcard } = require('../models/modelRelations');
const flashcards = require ('./flashcards');
const sharedCardsets = require ('./sharedCardsets');

const { Sequelize } = require('sequelize');
const {checkCardsetAuthority} = require('./functions');

router.use('/:userid/cardsets/:cardsetid/flashcards', flashcards);
router.use('/:userid/cardsets/:cardsetid/shared', sharedCardsets);

router.route('/signup')
.post(async (req, res) => {
    try {
        const { firebaseId, username, email } = req.body;
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const user = await User.create({ firebaseId, username, email });
        res.status(201).json({ user });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ error: 'Error signing up user' });
    }
});

router.route('/usernameCheck')
.get(async(req,res) => {
    const { username } = req.query;
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
        return res.status(200).json({ exists: true });
    } else {
        return res.status(200).json({ exists: false });
    }
})

//Get all Users
router.route('/')
.get(async(req, res) => {
    try{
        const users = await User.findAll();
        res.status(200).json( users );
    } catch (error) {
        console.error('Error fetching users from database:', error);
        res.status(500).json({ error: 'Error fetching users from database' });
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

//Get user by ID
router.route('/:userid')
.get(async (req, res) => {
    try {
        const { userid } = req.params;
        const user = await User.findOne({ where: { id: userid }});
        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ error: 'Error fetching user by ID' });
    }
});


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
            const cardsets = await Cardset.findAll({ 
                where: { userId: req.params.userid },
                include: [{
                    model: Flashcard,
                    attributes: [],
                    duplicating: false,
                }],
                attributes: {
                    include: [
                        [Sequelize.fn("COUNT", Sequelize.col("flashcards.id")), "flashcardCount"]
                    ]
                },
                group: ['cardset.id']
            })
            res.status(200).json({ cardsets });
        } catch (error) {
            console.error('Error fetching card sets:', error);
            res.status(500).json({ error: 'Error fetching card sets' });
        }
});

//Get user's single cardset using a cardset Id
router.route('/:userid/cardsets/:cardsetid')
    .get(async(req,res)=> {
        try{
            const { updatedData } = req.body;
            const cardset = await Cardset.findOne({
            where: { id: req.params.cardsetid },
                include: [{
                model: Flashcard,
                attributes: [],
                duplicating: false,
            }],
            attributes: {
                include: [
                    [Sequelize.fn("COUNT", Sequelize.col("flashcards.id")), "flashcardCount"]
                ]
            },
            group: ['cardset.id']
            });
            res.status(200).json(cardset);
        } catch (error) {
        console.error('Error fetching a cardset:', error);
        res.status(500).json({ error: 'Error fetching a cardset' });
    }
})

//Update specific cardset
router.route('/:userid/cardsets/:cardsetid')
.put(async(req,res)=> {
    try{
        const authLevel = await checkCardsetAuthority(req.params.userid, req.params.cardsetid);
        if (authLevel === 'read-only' || authLevel === 'no-access' ){
            res.status(403).send('User is not authorized to make this request');
            return;
        }
        const { updatedData } = req.body;
        const cardset = await Cardset.update(updatedData, {where: { id: req.params.cardsetid }});
        res.status(200).json(cardset);
    } catch (error) {
        console.error('Error updating cardset:', error);
        res.status(500).json({ error: 'Error updating a cardset' });
    }
})
.delete(async(req,res) => {
    try{
        const authLevel = await checkCardsetAuthority(req.params.userid, req.params.cardsetid);
        if (authLevel !== 'owner'){//Only cardset owner is able to delete the cardset
            res.status(403).send(`User is not authorized to make this request with auth level: '${authLevel}'`);
            return;
        }
        const cardset = await Cardset.findOne({where: { id: req.params.cardsetid }});
        if (!cardset) {
            return res.status(404).json({ error: 'Cardset not found' });
        }
        const flashcards = await cardset.getFlashcards();
        await Promise.all(flashcards.map(async (flashcard) => {
            await flashcard.destroy();
        }));
        await cardset.destroy();
        res.status(200).send('Cardset and its flashcards deleted');
    } catch (error) {
        console.error('Error deleting cardset:', error);
        res.status(500).json({ error: 'Error deleting a cardset' });
    }
});

//Get all public cardset of a specific user
router.get('/:userid/public-cardsets', async (req, res) => {
    try {
        const userId = req.params.userid;
        const publicCardsets = await Cardset.findAll({
            where: { 
                userId: userId,
                isPublic: true 
            },
            include: [{
                model: Flashcard,
                attributes: [],
                duplicating: false,
            }],
            attributes: {
                include: [
                    [Sequelize.fn("COUNT", Sequelize.col("flashcards.id")), "flashcardCount"]
                ]
            },
            group: ['Cardset.id']
        });
        res.status(200).json({ cardsets: publicCardsets });
    } catch (error) {
        console.error('Error fetching user public card sets:', error);
        res.status(500).json({ error: 'Error fetching user public card sets' });
    }
});

module.exports = router;