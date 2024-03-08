 const User = require('./user');
 const Cardset = require('./cardset');
 const Flashcard = require('./flashcard');

 
 Cardset.belongsTo(User);
 User.hasMany(Cardset);

 Cardset.hasMany(Flashcard);
 Flashcard.belongsTo(Cardset);

 module.exports = {
    User,
    Cardset,
    Flashcard
 };