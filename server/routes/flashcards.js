const express = require('express');
const router = express.Router(); // Create the router instance

const { Cardset, Flashcard } = require('../models/modelRelations');

// Route for flashcards of a set (uses api/users/:userid/cardsets/:cardsetid)
router.route('/:cardsetid/flashcards')
  .post(async (req, res) => {
    try {
      const { cardsetId, newCardData } = req.body;
      const id = cardsetId;
      const cardset = await Cardset.findOne({ where: { id } });
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

module.exports = router;
