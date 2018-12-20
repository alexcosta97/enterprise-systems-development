const express = require('express');
const users = require('../controllers/users.server.controller');
const passport = require('passport');
const auth = require('../services/auth');

module.exports = function(app){
    //Sign-in routes
    app.route('/signin').post(users.signin);
    app.route('/signin/google').get(
        passport.authenticate('google', {
            failureRedirect: '/signup/google',
            scope: [
                'profile',
                'email'
            ],
            session: false
        })
    );
    app.route('/signin/google/callback').get(
        passport.authenticate('google', {
            failureRedirect: '/signup/google',
            session: false
        }), auth.setTokenCookie
    );
    app.route('/signin/facebook').get(
        passport.authenticate('facebook', {
            scope: ['email', 'user_about_me'],
            failureRedirect: '/signup/facebook',
            session: false
        })
    );
    app.route('/signin/facebook/callback').get(
        passport.authenticate('facebook', {
            failureRedirect: '/signup/facebook',
            session: false
        }), auth.setTokenCookie
    );

    const router = express.Router();
    router.get('/me', auth.isAuthenticated(), users.me);
    router.put('/:id/password', auth.isAuthenticated(), users.changePassword);
    router.get('/:id', users.show);
    router.post('/', users.create);
};