var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Joi = require('../config/joi');

var roomSchema = new Schema({
    floor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Floor',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    pixelsXMin: {
        type: Number,
        required: true
    },
    pixelsXMax: {
        type: Number,
        required: true
    },
    pixelsY: {
        type: Number,
        required: true
    }
});

roomSchema.statics.validateInput = (input) => {
    const inputSchema = {
        _id: Joi.objectId(),
        floor: Joi.objectId().required(),
        name: Joi.string().max(255).required(),
        pixelsXMin: Joi.number().required(),
        pixelsXMax: Joi.number().required(),
        pixelsY: Joi.number().required()
    }

    return Joi.validate(input, inputSchema);
};

module.exports = mongoose.model('Room', roomSchema);