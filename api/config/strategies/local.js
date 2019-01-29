const passport = require('passport');
const localStrategy = require('@passport-next/passport-local').Strategy;
const UserModel = require('mongoose').model('User');

module.exports = function() {
    passport.use('login', new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (username, password, done) => {
        try{
            //Verify that the information provided is valid
            const {error} = UserModel.validateLogin({email: username, password: password});
            if(error) return done(null, false, {message: error.details[0].message});

            //Find the user associated with the email provided
            const user = await UserModel.findOne({email: username});
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