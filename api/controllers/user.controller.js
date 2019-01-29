const User = require('mongoose').model('User');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const signup = async (req, res) => {
    const {error} = User.validateInput(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});

    try{
        const user = await User.create(_.pick(req.body, ['name', 'email', 'phone', 'password']));
        const token = user.signToken();
        res.json({message: 'Signup successful', token: token});
    } catch(error){
        res.json({message: error.message});
    }
}

const getUser = async (req, res) => {
    let user;
    try{
        user = await User.findById(req.params.id).select('-password').exec();
    } catch(err){
        return res.status(400).json({message: 'Invalid User ID'});
    }

    if(!user) return res.status(404).json({message: `There was no user with the given ID.`});
    return res.json(user);
}

const update = async(req, res) => {
    const {error} = User.validateInput(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});

    let user;
    try{
        user = await User.findByIdAndUpdate(req.user._id, req.body).select('-password').exec();
    } catch(err){
        return res.status(400).json({message: 'Invalid User ID'});
    }

    if(!user) return res.status(404).json({message: 'There was no user with the given ID'});
    return res.json(user);
}

const del = async(req, res) => {
    let user;
    try{
        user = await User.findByIdAndDelete(req.user._id).exec();
    } catch(err){
        return res.status(400).json({message: 'Invalid User ID'});
    }

    if(!user) return res.stauts(404).json({message: 'There was no user with the given ID'});
    return res.json(user);
}

exports.signup = signup;
exports.getUser = getUser;
exports.update = update;
exports.delete = del;