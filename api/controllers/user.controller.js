const User = require('mongoose').model('User');
const passport = require('passport');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const auth = require('../services/auth');

const getErrorMessage = (err) => {
    let message = '';
    if(err.code){
        switch(err.code){
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for(var errName in err.errors){
            if(err.errors[errName].message) message= err.errors[errName].message;
        }
    }
    return message;
};

const validateError = (res, statusCode) => {
    statusCode = statusCode || 422;
    return function(err){
        res.status(statusCode).json(err);
    };
};

const handleError = (res, statusCode) => {
    statusCode = statusCode || 500;
    return function(err){
        res.status(statusCode).send(err);
    };
};

const responsdWith = (res, statusCode) =>{
    statusCode = statusCode || 200;
    return function(){
        res.status(statusCode).end();
    };
};

exports.signup = function(req, res, next){
    if(!req.user){
        let user = new User(req.body);
        user.provider = 'local';

        user.save(function(err){
            if(err){
                var message = getErrorMessage(err);
                res.json(message);
            }
            req.login(user, function(err){
                if(err) return next(err);
                //TODO: Add token generating method
                res.json(user);
            });
        });
    }
};

/**
 * Creates a new user
 */
exports.create = function(req, res, next){
    let newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.save(function(err, user){
        if(err) validateError(res);
        let token = jwt.sign({_id: user._id},
            config.sessionSecret, {
                expiresIn: 60*60*5
            });
        res.json({token: token});
    });
};

/**
 * Get a single user
 */
exports.show = function(req, res, next){
    var userId = req.params.id;
    User.findById(userId, (err, user) =>{
        if(err) return next(err);
        if(!user) return res.status(404).end();
        res.json(user.profile);
    });
};

/**
 * Change a user's password
 */
exports.changePassword = function(req, res, next){
    let userId = req.user._id;
    let oldPass = String(req.body.oldPassword);
    let newPass = String(req.body.newPassword);
    User.findById(userId, (err, user) => {
        if(user.authenticate(oldPass)){
            user.password = newPass;
            user.save((err, user) => {
                if(err) validateError(res);
                res.status(204).end();
            });
        }
    });
};

/**
 * Get my info
 */
exports.me = function(req, res, next){
    let userId = req.user._id;

    User.findOne({_id: userId}, '-salt -hashedPassword', (err, user) =>{
        if(err) return next(err);
        if(!user) return res.status(401).end();
        else res.json(user); 
    });
};

exports.signin = function(req, res, next){
    passport.authenticate('local', function(err, user){
        if(err) return res.status(401).json(err);
        if(!user) return res.status(404).json({message: 'Something went wrong, please try again'});

        let token = auth.signToken(user._id);
        res.json({token: token});
    });
};