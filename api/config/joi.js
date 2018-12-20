const Joi = require('joi');

//Configuring joi -> adding dependencies to deal with certain data types
Joi.objectId = require('joi-objectid')(Joi);

module.exports = Joi;