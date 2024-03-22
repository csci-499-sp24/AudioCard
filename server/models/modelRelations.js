 const User = require('./user');
 const Cardset = require('./cardset');
 const Flashcard = require('./flashcard');
 const SharedCardset = require('./sharedCardset');

 Cardset.belongsTo(User);
 User.hasMany(Cardset);
 Cardset.belongsToMany(User, {through: SharedCardset, as: 'sharedWithUser'});
 User.belongsToMany(Cardset, {through: SharedCardset, as: 'sharedCardsets'});

 Cardset.hasMany(Flashcard);
 Flashcard.belongsTo(Cardset);

 module.exports = {
    User,
    Cardset,
    Flashcard,
    SharedCardset
 };