const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

// Create user schema for the database
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'You need to add a name']
    },
    username: {
        type: String,
        required: [true, 'You need to add a username']
    },
    password: {
        type: String,
        required: [true, 'You must add a password']
    },
    salt: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'You must add an email'],
        minlength: 5,
        maxlength: 255,
        match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
    }
});

//Create pre-save hashing
UserSchema.pre('save', (next) => {
    if(this.password){
        this.salt = Buffer.from(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

//Create hashing method using crypto
UserSchema.methods.hashPassword = (password) => {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

//Create pass validation method
UserSchema.methods.verifyPassword = (password) => {
    return this.password === this.hashPassword(password);
}

//Check existing usernames and help find unique
UserSchema.statics.findUniqueUsername = (username, suffix, callback) => {
    let _this = this;
    let possibleUsername = username + (suffix || '');
    _this.findOne({
        username: possibleUsername
    }, (err, user) => {
        if(!err){
            if(!user){
                callback(possibleUsername);
            } else{
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else{
            callback(null);
        }
    });
};

UserSchema.set('toJSON', {
    getters: true
});

mongoose.model('User', UserSchema);