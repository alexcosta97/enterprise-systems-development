const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('../config/joi');


//Creating Mongoose database schema
var pictureSchema = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    imageURL: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true,
    }
});

//Creating client-side input validation method
pictureSchema.statics.validatePicture = (picture) => {
    //declaring a Joi-specific schema for the input
    const schema = {
        room: Joi.objectId().required(),
        imageURL: Joi.string().uri()
    };

    //using joi to validate the user input and returns the result
    return Joi.validate(picture, schema);
};

//Creating model class
const Picture = mongoose.model('Picture', pictureSchema);
module.exports = Picture;