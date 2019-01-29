const passport = require('passport');
const jwt = require('jsonwebtoken');
const express = require('express');
const config = require('../config/config');
const users = require('../controllers/user.controller');

const router = express.Router();

router.post('/signup', users.signup);

router.post('/login', async (req, res, next) => {
   passport.authenticate('login', function(err, user){
       if(err) return res.status(500).json({message: err.message});
       else if(!user) return res.status(400).json({message: 'Invalid email or password'});
       const token = user.signToken();
       return res.status(200).json({token: token});
   })(req, res, next);
});

module.exports = router;