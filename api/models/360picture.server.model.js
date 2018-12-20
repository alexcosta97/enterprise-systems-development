const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('../config/joi');


//Creating Mongoose database schema
var pictureSchema = new Schema({
    room: {
        // Creating a custom schema to keep certain details of the room inside the picture document
        type: new Schema({
            // No extra validation is necessary inside the schema since the info comes from the original room's document
            name: {
                type: String,
                required: true
            }
        }),
        required: true
    },
    imageURL: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true
    }
});

//Creating model class
const Picture = mongoose.model('Picture', pictureSchema);

//Creating client-side input validation method
const validatePicture = (picture) => {
    //declaring a Joi-specific schema for the input
    const schema = {
        room: Joi.objectId().required(),
        imageURL: Joi.string().min(5).max(255).uri().required()
    };

    //using joi to validate the user input and returns the result
    return Joi.validate(picture, schema);
}