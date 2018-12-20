const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

//Defining the mongoose schema for the model
var floorSchema = new Schema({
    property: {
        type: new Schema({
            //Creating custom schema to store the most frequently used
            //data for the property
            //No validation needed here since the
            //information comes from the property's original documents
            name:{
                type: String,
                required: true
            }
        }),
        required: true
    },
    level: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10
    },
    imageURL: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true,
        default: 'noImage'
    }
});

//Creating the model for the floor
const Floor = mongoose.model('Floor', floorSchema);

//Creating client-side input validation method
const validateFloor = (floor) => {
    //declaring the Joi-specific schema for the input
    const schema = {
        property: Joi.objectId().required(),
        level: Joi.string().min(1).max(10).required(),
        imageURL: Joi.string().min(5).max(255).uri().required()
    };

    //using joi to validate the input and returning the result
    return Joi.validate(floor, schema);
};

//Exporting the model and the validation method
exports.Floor = Floor;
exports.validate = validatePicture;