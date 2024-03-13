const express = require('express');
const app = express();
const cardsetsRoutes = require('./cardsets');
const usersRoutes = require('./users');

app.use('/cardsets', cardsetsRoutes);
app.use('/users', usersRoutes);

module.exports = app;