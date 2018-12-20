const passport = require('@passport-next/passport');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const compose = require('composable-middleware');
const user = require('mongoose').model('User');

let validateJwt = expressJwt({
    secret: config.sessionSecret
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated(){
    return compose()
    // Validate jwt
    .use(function(req, res, next){
        //allow access_token to be passed through query parameter as well
        if(req.query && req.query.hasOwnProperty('access_token')){
            req.headers.authorization = 'Bearer ' + req.query.access_token;
        }
        validateJwt(req, res, next);
    })
    //Attach user to request
    .use(function(req, res, next){
        user.findById(req.user._id, function(err, user){
            if(err) return next(err);
            if(!user) return res.status(401).end();
            req.user = user;
            next();
        });
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id){
    return jwt.sign({_id: id},
        config.sessionSecret, {
            expiresIn: 60*60*5
        });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res){
    if(!req,user) return res.status(404).send('Something went wrong, please try again.');
    let token = signToken(req.user._id);
    res.cookie('token', token);
    res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;