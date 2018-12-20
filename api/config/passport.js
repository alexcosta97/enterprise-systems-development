const passport = require('@passport-next/passport');
const mongoose = require('mongoose');

module.exports =() => {
    let User = mongoose.model('User');
    //Manages how passport handles user serialization
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => User.findOne({_id: id}, '-password -salt', (err, user) => done(err, user)));

    //including local strategy file
    require('./strategies/local')();
    //including facebook strategy file
    require('./strategies/facebook');
    //including google strategy file
    require('./strategies/google');
};