const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const authTypes = ['facebook', 'google'];

// Create user schema for the database
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'You need to add a name']
    },
    email: {
        type: String,
        required: [true, 'You must add an email'],
        minlength: 5,
        maxlength: 255,
        match: [/.+\@.+\..+/, "Please fill a valid e-mail address"],
        unique: true
    },
    hashedPassword: {
        type: String,
        required: [true, 'You must add a password']
    },
    salt: {
        type: String
    },
    //Provides data for OAuth providers
    facebook: {},
    twitter: {},
    google: {}
});

/**
 * Virtuals
 */

 //Public profile information
 UserSchema.virtual('profile').get(function(){
     return {
         'name': this.name,
         'email': this.email
     };
 });

 //Token information
 UserSchema.virtual('token').get(function(){
     return {
         '_id': this._id
     };
 });

 /**
 * Validations
 */

 //Validate empty email
 UserSchema.path('email').validate(function(email){
     if(authTypes.indexOf(this.provider) !== -1) return true;
     return email.length;
 }, 'Email cannot be blank');

 //Validate empty password
UserSchema.path('hashedPassword').validate(function(password){
     if(authTypes.indexOf(this.provider) !== -1) return true;
     return password.length;
 }, 'Password cannot be blank');

 //Validate email is not taken
 UserSchema.path('email').validate(function(value, respond){
     let self = this;
     return this.constructor.findOneAsync({email: value}).then(function(user){
         if(user){
             if(self.id === user.id) return true;
             return false;
         } return true;
     }).catch((err) => {throw err;});
 }, 'The specified email address is already in use.');

 const validatePresenceOf = function(value){
     return value && value.length;
 };

 /**
 * Pre-save hook
 */
UserSchema.pre('save', function(next){
    //Handle new/update passwords
    if(this.isModified('password')){
        if(!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) next(new Error('Invalid password'));

        //Make salt with a callback
        let _this = this;
        this.makeSalt(function(saltErr, salt){
            if(saltErr) next(saltErr);
            _this.salt = salt;
            _this.encryptPassword(_this.password, function(encryptErr, hashedPassword){
                if(encryptErr) next(encryptErr);
                _this.password = hashedPassword;
                next();
            });
        });
    } else next();
});

/**
 * Methods
 */
UserSchema.methods = {
    /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate: function(password, callback){
      if(!callback) return this.password === this.encryptPassword(password);
      let _this = this;
      this.encryptPassword(password, function(err, pwdGen){
          if(err) callback(err);
          if(_this.password === pwdGen) callback(null, true);
          else callback(null, false);
      });
  },

    /**
     * Make salt
     *
     * @param {Number} byteSize Optional salt byte size, default to 16
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    makeSalt: function(byteSize, callback){
        let defaultByteSize = 16;
        if(typeof arguments[0] === 'function'){
            callback = arguments[0];
            byteSize = defaultByteSize;
        } else if(typeof arguments[1] === 'function') callback = arguments[1];

        if(!byteSize) byteSize = defaultByteSize;
        if(!callback) return crypto.randomBytes(byteSize).toString('base64');

        return crypto.randomBytes(byteSize, function(err, salt){
            if(err) callback(err);
            return callback(null, salt.toString('base64'));
        });
    },
    /**
     * Encrypt password
     *
     * @param {String} password
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    encryptPassword: function(password, callback){
        if(!password || this.salt) return null;
        
        var defaultIterations = 10000;
        var defaultKeyLength = 64;
        var salt = Buffer.from(this.salt, 'base64');

        if(!callback) return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength).toString('base64');

        return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, function(err, key){
            if(err) callback(err);
            return callback(null, key.toString('base64'));
        });
    }
};

module.exports = mongoose.model('User', UserSchema);