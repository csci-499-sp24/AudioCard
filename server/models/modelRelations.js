 const User = require('./user');
 const Cardset = require('./cardset');
 const Flashcard = require('./flashcard');
 const SharedCardset = require('./sharedCardset');
 const Friend = require('./friend');
 const FriendNotification = require('./friendNotification');
 const CardsetNotification = require('./cardsetNotification');

 //Users and card sets
 Cardset.belongsTo(User);
 User.hasMany(Cardset);

 //Users and notifications
 FriendNotification.belongsTo(User, {foreignKey: 'senderId', as: 'sender'});
 User.hasMany(FriendNotification, {foreignKey: 'recipientId'});
 CardsetNotification.belongsTo(User, {foreignKey: 'senderId', as: 'sender'});
 User.hasMany(CardsetNotification, {foreignKey: 'recipientId'});

 //Notifications and card sets 
 CardsetNotification.belongsTo(Cardset, {foreignKey: 'cardsetId', constraints: false, as: 'cardset' });
 Cardset.hasMany(CardsetNotification, { foreignKey: 'cardsetId', as: 'cardsetNotifications' });

 //Shared card sets
 Cardset.belongsToMany(User, {through: SharedCardset, as: 'sharedWithUser'});
 User.belongsToMany(Cardset, {through: SharedCardset, as: 'sharedCardsets'});

 SharedCardset.belongsTo(Cardset, { foreignKey: 'cardsetId', as: 'cardset' });
 Cardset.hasMany(SharedCardset, {as: 'sharedCardsets'});

 Friend.belongsTo(User, {foreignKey: 'user1Id', as: 'requestor'});

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
    FriendNotification,
    CardsetNotification
 };