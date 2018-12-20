const passport = require('@passport-next/passport');
const Strategy = require('@passport-next/passport-google-oauth2').Strategy;
const config = require('../config');
const User = require('mongoose').model('User');

module.exports = function(){
    passport.use(new Strategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    }, function(accessToken, refreshToken, profile, done){
        User.findOne({'google.id': profile.id}, function(err, user){
            if(err){
                return done(err);
            }
            if(!user){
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value.split('@')[0],
                    provider: 'google',
                    facebook: profile._json
                });
                user.save(function(err, user){
                    if(err) done(err);
                    return done(null, user);
                });
            } else{
                return done(null, user);
            }
        })
    }))
}