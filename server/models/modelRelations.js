 const User = require('./user');
 const Cardset = require('./cardset');
 const Flashcard = require('./flashcard');
 const SharedCardset = require('./sharedCardset');
 const Friend = require('./friend');
const CardsetNotifcation = require('./cardsetNotification');
const FriendNotification = require('./friendNotification');
const RevokedCardsetNotification = require('./revokedCardsetNotification');
const GrantedCardsetNotification = require('./grantedCardsetNotification');
const RequestedCardsetNotification = require('./requestedCardsetNotification');
 //const Notification = require('./notification');

 //Users and card sets
 Cardset.belongsTo(User);
 User.hasMany(Cardset);

 //Users and notifications
 //Notification.belongsTo(User);
 //User.hasMany(Notification);
 // CardsetNotifcation.belongsTo(User);
 //Notifcations and users
 FriendNotification.belongsTo(User, {foreignKey: 'recipientId'});
 RevokedCardsetNotification.belongsTo(User, {foreignKey: 'recipientId'});
 RequestedCardsetNotification.belongsTo(User, {foreignKey: 'recipientId'});
 GrantedCardsetNotification.belongsTo(User, {foreignKey: 'recipientId'});
 User.hasMany(FriendNotification, {foreignKey: 'recipientId'});
 User.hasMany(RevokedCardsetNotification, {foreignKey: 'recipientId'});
 User.hasMany(RequestedCardsetNotification, {foreignKey: 'recipientId'});
 User.hasMany(GrantedCardsetNotification, {foreignKey: 'recipientId'});

 //Notifications and cardsets 
 RevokedCardsetNotification.belongsTo(Cardset, {foreignKey: 'cardsetId', constraints: false, as: 'cardsetItem' });
 RequestedCardsetNotification.belongsTo(Cardset, {foreignKey: 'cardsetId', constraints: false, as: 'cardsetItem' });
 GrantedCardsetNotification.belongsTo(SharedCardset, {foreignKey: 'sharedCardsetId', constraints: false, as: 'sharedCardsetItem' });
 Cardset.hasMany(RevokedCardsetNotification, { foreignKey: 'cardsetId', as: 'revokedNotifications' });
 Cardset.hasMany(RequestedCardsetNotification, { foreignKey: 'cardsetId', as: 'requestedNotifications' });
 SharedCardset.hasOne(GrantedCardsetNotification, { foreignKey: 'sharedCardsetId', as: 'grantedNotification' });
 // User.hasMany(CardsetNotifcation);
 // CardsetNotifcation.belongsTo(Cardset, {foreignKey: 'cardsetId', constraints: false, as: 'cardsetItem' });

 //Shared card sets
 Cardset.belongsToMany(User, {through: SharedCardset, as: 'sharedWithUser'});
 User.belongsToMany(Cardset, {through: SharedCardset, as: 'sharedCardsets'});

 SharedCardset.belongsTo(Cardset, { foreignKey: 'cardsetId', as: 'cardset' });
 Cardset.hasMany(SharedCardset, {as: 'sharedCardsets'});

 Friend.belongsTo(User, {foreignKey: 'user1Id', as: 'requestor'});

 //Notification.belongsTo(SharedCardset, { foreignKey: 'sourceId', constraints: false, as: 'sharedCardsetItem' });
 //Notification.belongsTo(Friend, { foreignKey: 'sourceId', constraints: false, as: 'friendItem' });
 //SharedCardset.hasOne(Notification, { foreignKey: 'sourceId', constraints: false });
 //Friend.hasOne(Notification, { foreignKey: 'sourceId', constraints: false });

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
    RevokedCardsetNotification,
    RequestedCardsetNotification,
    GrantedCardsetNotification
    //Notification
 };