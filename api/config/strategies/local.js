const passport = require('@passport-next/passport');
const LocalStrategy = require('@passport-next/passport-local').Strategy;
const User = require('mongoose').model('User');

module.exports = function() {
    passport.use(new LocalStrategy((email, password, done) => {
        User.findOne({email: email.toLowerCase()}, (err, user) => {
            if(err) done(err);
            if(!user) return done(null, false, {message: 'This email is not registered'});
            if(!user.authenticate(password)) return done(null, false, {message: `The password isn't correct`});
            return done(null, user);
        }).catch((err) => {return done(err);});
    }));
};