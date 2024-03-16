const express = require('express');
const app = express();
const cardsetsRoutes = require('./cardsets');
const usersRoutes = require('./users');
const flashcardRoutes = require('./flashcards')


app.use('/cardsets', cardsetsRoutes);
app.use('/users', usersRoutes);
app.use('/flashcards',flashcardRoutes);


module.exports = app;