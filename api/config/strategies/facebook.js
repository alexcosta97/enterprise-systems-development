const passport = require('@passport-next/passport');
let Strategy = require('@passport-next/passport-facebook').Strategy;
const config = require('../config');
const User = require('mongoose').model('User');


module.exports = function(){
    passport.use(new Strategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['displayName', 'emails']
    }), function(accessToken, refreshToken, profile, done){
        User.findOne({ 'facebook.id': profile.id }, function(err, user){
            if(err){
                return done(err);
            }
            if(!user){
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    provider: 'facebook',
                    facebook: profile._json
                });
                user.save(function(err, user){
                    if(err) done(err);
                    return done(null, user);
                });
            } else{
                return done(null, user);
            }
        });
    });
};