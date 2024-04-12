 const User = require('./user');
 const Cardset = require('./cardset');
 const Flashcard = require('./flashcard');
 const SharedCardset = require('./sharedCardset');
 const Friend = require('./friend');
 const Notification = require('./notification');

 //Users and card sets
 Cardset.belongsTo(User);
 User.hasMany(Cardset);

 //Users and notifications
 Notification.belongsTo(User);
 User.hasMany(Notification);

 //Shared card sets
 Cardset.belongsToMany(User, {through: SharedCardset, as: 'sharedWithUser'});
 User.belongsToMany(Cardset, {through: SharedCardset, as: 'sharedCardsets'});

 //Only using this association to define the table | in managing friends, the associated functions are not used
 User.belongsToMany(User, {through: Friend, as: 'friends', foreignKey: 'user1Id', otherKey: 'user2Id'});

 //Cardsets and flashcards
 Cardset.hasMany(Flashcard);
 Flashcard.belongsTo(Cardset);

 module.exports = {
    User,
    Cardset,
    Flashcard,
    SharedCardset,
    Friend,
    Notification
 };