const express = require('express');
const app = express();
const cardsetsRoutes = require('./cardsets');
const usersRoutes = require('./users');
const flashcardRoutes = require('./flashcards');
const speechRoutes = require('./speechIncoming');
const textToSpeechRoutes = require('./textToSpeech.js');
const sharedRoutes = require('./sharedCardsets');
const userAvatarRoutes = require('./userAvatar');

app.use('/cardsets', cardsetsRoutes);
app.use('/users', usersRoutes);
app.use('/flashcards',flashcardRoutes);
app.use('/speechIncoming', speechRoutes);
app.use('/textToSpeech',textToSpeechRoutes);
app.use('/shared', sharedRoutes)
app.use('/userAvatar', userAvatarRoutes);

module.exports = app;