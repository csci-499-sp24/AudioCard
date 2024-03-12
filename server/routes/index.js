const express = require('express');
const app = express();
const cardsetRoutes = require('./cardsetRoutes');
const usersRoutes = require('./usersRoutes');
const flashcardRoutes = require('./flashcardRoutes');

app.use('/cardsets', cardsetRoutes);
app.use('/users', usersRoutes);
app.use('/flashcards', flashcardRoutes);

module.exports = app;