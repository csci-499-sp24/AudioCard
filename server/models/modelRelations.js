 const User = require('./user');
 const Cardset = require('./cardset');
 const Flashcard = require('./flashcard');
 const SharedCardset = require('./sharedCardset');
 const Friend = require('./friend');


 Cardset.belongsTo(User);
 User.hasMany(Cardset);
 Cardset.belongsToMany(User, {through: SharedCardset, as: 'sharedWithUser'});
 User.belongsToMany(Cardset, {through: SharedCardset, as: 'sharedCardsets'});

 //Only using this association to define the table | in managing friends, the associated functions are not used
 User.belongsToMany(User, {through: Friend, as: 'friends', foreignKey: 'user1Id', otherKey: 'user2Id'});

 Cardset.hasMany(Flashcard);
 Flashcard.belongsTo(Cardset);

 module.exports = {
    User,
    Cardset,
    Flashcard,
    SharedCardset,
    Friend
 };