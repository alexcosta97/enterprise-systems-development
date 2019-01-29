const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const Joi = require('../config/joi');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('../config/config');


// Create user schema for the database
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    password:{
        type: String,
        required: true,
    }
});

UserSchema.pre('save', async function(next){
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

UserSchema.methods.isValidPassword = async function(password){
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

UserSchema.methods.signToken = function(){
    const body = _.pick(this, ['_id', 'name', 'email', 'phone']);
    const token = jwt.sign({user: body}, config.jwtSecret);
    return token;
}

UserSchema.statics.validateInput = function(userInput){
    const input = {
        name: Joi.string().required(),
        email: Joi.string().email().min(5).max(255).required(),
        phone: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(8).required()
    };

    return Joi.validate(userInput, input);
}

UserSchema.statics.validateLogin = function(loginInput){
    const input = {
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(8).required()
    }

    return Joi.validate(loginInput, input);
}

module.exports = mongoose.model('User', UserSchema);