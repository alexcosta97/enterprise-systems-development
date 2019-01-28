const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('../config/joi');

//Creating custom model schema to help simplify the property schema
const AddressSchema = new Schema({
    houseNumber: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20
    },
    street: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true
    },
    town: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true
    },
    postCode: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: true
    },
    county: {
        type: String,
        minlength: 3,
        maxlength: 255
    },
    country: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    }
});


//Creating the schema that mongoose will use to model a Property
var PropertySchema = new Schema({
    address: {
        type: AddressSchema,
        required: true
    },
    description: {
        type: String,
        minlength: 10,
        maxlength: 2048
    },
    imageURL: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true,
        default: 'noImage'
    },
    agent: {
        //Creating a custom schema for the agent since it allows for better query performance
        type: new Schema({
            //No extra attribute validation is needed since the information comes from original users' document
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            }
        }),
        required: true
    }
});

//Creating a virtual property name value to help sending relevant information to the client
PropertySchema.virtual('propertyName').get(function(){
    return {
        propertyName: `${this.address.houseNumber}, ${this.address.street}`
    };
});

//Using mongoose to create the model class and storing the class in an object
const Property = mongoose.model('Property', PropertySchema);

//Creating client-side input validation method
const validateProperty = (property) => {
    //declaring a joi-specific schema for the client input
    const schema = {
        houseNumber: Joi.string().min(1).max(20).required(),
        street: Joi.string().min(3).max(255).required(),
        town: Joi.string().min(3).ax(255).required(),
        postCode: Joi.string().min(2).max(20).required(),
        county: Joi.string().min(3).max(255),
        country: Joi.string().min(3).max(255),
        description: Joi.string().min(10).max(2048),
        imageURL: Joi.string().min(5).max(255).required().uri,
        agentID: Joi.objectId().required()
    };

    //returning the result of the validation
    return Joi.validate(property, schema);
};

//exporting the model and the validation method
exports.Property = Property;
exports.validate = validateProperty;