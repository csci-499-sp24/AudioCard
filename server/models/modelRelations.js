 const User = require('./user');
 const Cardset = require('./cardset');
 const Flashcard = require('./flashcard');

 
 Cardset.belongsTo(User);
 User.hasMany(Cardset);

 Cardset.hasMany(Flashcard);

 module.exports = {
    User,
    Cardset,
    Flashcard
 };