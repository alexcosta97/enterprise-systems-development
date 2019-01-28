const passport = require('@passport-next/passport');
const localStrategy = require('@passport-next/passport-local').Strategy;
const UserModel = require('mongoose').model('User');

module.exports = function() {
    passport.use('signup', new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try{
            const user = await UserModel.create({email, password});
            return done(null, user);
        } catch(error){
            done(error);
        }
    }));
    
    passport.use('login', new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try{
            //Find the user associated with the email provided
            const user = UserModel.findOne({email: email});
            if(!user){
                return done(null, false, {message: 'User not found'});
            }
    
            //Validate password and make sure it matches with the user
            //If the passwords match, it returns a value of true
            const validate = await user.isValidPassword(password);
            if(!validate){
                return done(null, false, {message: 'Wrong Password'});
            }
    
            return done(null, user, {message: 'Logged in Successfully'});
        } catch(error){
            return done(error);
        }
    }));
};