const express = require('express');
const router = express.Router({mergeParams: true}); // Create the router instance
const {checkCardsetAuthority} = require('./functions');

const { Cardset, Flashcard } = require('../models/modelRelations');

// Route for flashcards of a set (uses api/users/:userid/cardsets/:cardsetid)
router.route('/:cardsetid/flashcards')
  .post(async (req, res) => {
    try {
      const cardset = await Cardset.findOne({ where: { id } });
      if (cardset.isPublic === false){ // Only check authority if not a public set
        const authLevel = await checkCardsetAuthority(req.params.userid, req.params.cardsetid);
        if (authLevel === 'read-only' || authLevel === 'no-access'){
          res.status(403).send('User is not authorized to make this request');
          return;
        }
      }
      const { cardsetId, newCardData } = req.body;
      const id = cardsetId;
      const flashcard = await Flashcard.create(newCardData);
      await cardset.addFlashcard(flashcard);
      res.status(201).json({ flashcard });
    } catch (error) {
      console.error('Error creating flashcard:', error);
      res.status(500).json({ error: 'Error creating a flashcard' });
    }
  })
  .get(async (req, res) => {
    try {
      const authLevel = await checkCardsetAuthority(req.params.userid, req.params.cardsetid);
      if (authLevel === 'no-access'){
        res.status(403).send('User is not authorized to make this request');
        return;
      }
      const flashcards = await Flashcard.findAll({ where: { cardsetid: req.params.cardsetid } });
      res.status(200).json({ flashcards });
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      res.status(500).json({ error: 'Error fetching flashcards' });
    }
  });

router.route('/:cardsetid/flashcards/:flashcardid')
  .put(async (req, res) => {
    try {
      const authLevel = await checkCardsetAuthority(req.params.userid, req.params.cardsetid);
      if (authLevel === 'read-only' || authLevel === 'no-access'){
        res.status(403).send('User is not authorized to make this request');
        return;
      }
      const { updatedData } = req.body;
      const flashcard = await Flashcard.update(updatedData, { where: { id: req.params.flashcardid } });
      res.status(200).json(flashcard);
    } catch (error) {
      console.error('Error updating flashcard:', error);
      res.status(500).json({ error: 'Error updating a flashcard' });
    }
  })
  .delete(async (req, res) => {
    try {
      const authLevel = await checkCardsetAuthority(req.params.userid, req.params.cardsetid);
      if (authLevel === 'read-only' || authLevel === 'no-access'){
        res.status(403).send('User is not authorized to make this request');
        return;
      }
      const flashcard = await Flashcard.findOne({ where: { id: req.params.flashcardid } });
      if (!flashcard) {
        return res.status(404).json({ error: 'Flashcard not found' });
      }
      await flashcard.destroy();
      res.status(200).send('Flashcard deleted');
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      res.status(500).json({ error: 'Error deleting a flashcard' });
    }
  });

// New function for deleting a flashcard
router.delete('/:cardsetid/flashcards/:flashcardid', async (req, res) => {
  try {
    const authLevel = await checkCardsetAuthority(req.params.userid, req.params.cardsetid);
    if (authLevel === 'read-only' || authLevel === 'no-access' ){
      res.status(403).send('User is not authorized to make this request');
      return;
    }
    const flashcard = await Flashcard.findOne({ where: { id: req.params.flashcardid } });
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    await flashcard.destroy();
    res.status(200).send('Flashcard deleted');
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    res.status(500).json({ error: 'Error deleting a flashcard' });
  }
});


router.post('/updateflashcard/:flashcardId', async (req, res) => {
  try {
      const { flashcardId } = req.params;
      const { term, definition } = req.body; // Separate term (question) and definition (answer)

      // Update the flashcard
      const flashcard = await Flashcard.findByPk(flashcardId);
      if (!flashcard) {
          return res.status(404).json({ error: 'Flashcard not found' });
      }

      // Update the question and/or answer
      if (term) {
          flashcard.term = term; // Update question
      }
      if (definition) {
          flashcard.definition = definition; // Update answer
      }

      await flashcard.save();

      res.status(200).json({ flashcard });
  } catch (error) {
      console.error('Error updating flashcard:', error);
      res.status(500).json({ error: 'Error updating flashcard' });
  }
});

module.exports = router;
