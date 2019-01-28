const passport = require('@passport-next/passport');
const JWTStrategy = require('passport-jwt');
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