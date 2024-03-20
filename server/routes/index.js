const express = require('express');
const app = express();
const cardsetsRoutes = require('./cardsets');
const usersRoutes = require('./users');
const flashcardRoutes = require('./flashcards');
const speechRoutes = require('./speechIncoming');
const recorderRoutes = require('./recorder.js');


app.use('/cardsets', cardsetsRoutes);
app.use('/users', usersRoutes);
app.use('/flashcards',flashcardRoutes);
app.use('/speechIncoming', speechRoutes);
app.use('/recorder', recorderRoutes);

module.exports = app;