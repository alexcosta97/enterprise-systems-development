const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const config = require('../config');

module.exports = () => {
    passport.use(new JWTStrategy({
        secretOrKey: config.jwtSecret,
        jwtFromRequest: ExtractJWT.fromHeader('x-auth-token')
    }, async (token, done) => {
        try{
            return done(null, token.user);
        } catch(error) {
            done(error);
        }
    }));
}