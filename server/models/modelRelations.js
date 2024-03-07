 const User = require('./user');
 const Cardset = require('./cardset');
 
 Cardset.belongsTo(User);
 User.hasMany(Cardset);

 module.exports = {
    User,
    Cardset
 };