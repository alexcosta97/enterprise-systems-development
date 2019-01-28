const User = require('mongoose').model('User');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const signup = (req, res) => {
    const {error} = User.validateInput(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});

    try{
        const user = await User.create(_.pick(req.body, ['name', 'email', 'phone', 'password']));
        let resUser = _.pick(user, ['_id', 'name', 'email', 'phone']);
        const token = jwt.sign({user: resUser}, config.jwtSecret);
        res.json({message: 'Signup successful', token: token});
    } catch(error){
        res.json({message: error.message});
    }
}

exports.signup = signup;