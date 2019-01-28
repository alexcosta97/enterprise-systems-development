const passport = require('passport');
const jwt = require('jsonwebtoken');
const express = require('express');
const config = require('../config/config');
const users = require('../controllers/user.controller');

const router = express.Router();

router.post('/signup', users.signup);

router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try{
            if(err || !user){
                const error = new Error('An Error occured');
                return next(error);
            }
            req.login(user, {session: false}, async (error) => {
                if(error) return next(error);
                const token = user.signToken();
                return res.json({token});
            });
        } catch(error){
            return next(error);
        }
    })(req, res, next);
});

module.exports = router;