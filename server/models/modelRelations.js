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

 SharedCardset.belongsTo(Cardset, { foreignKey: 'cardsetId', as: 'cardset' });
 Cardset.hasMany(SharedCardset, {as: 'sharedCardsets'});

 Friend.belongsTo(User, {foreignKey: 'user1Id', as: 'requestor'});

 Notification.belongsTo(SharedCardset, { foreignKey: 'sourceId', constraints: false, as: 'sharedCardsetItem' });
 Notification.belongsTo(Friend, { foreignKey: 'sourceId', constraints: false, as: 'friendItem' });
 SharedCardset.hasOne(Notification, { foreignKey: 'sourceId', constraints: false });
 Friend.hasOne(Notification, { foreignKey: 'sourceId', constraints: false });

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