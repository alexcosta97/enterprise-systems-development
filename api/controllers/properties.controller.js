const {Property, validate} = require('../models/property.server.model');
const _ = require('lodash');
const {uploadPhoto} = require('../services/AWSS3');

const getAll = async (req, res) => {
    let properties;
    try{
        if(req.query.agent) properties = await Property.find({'agent._id': req.query.agent}).exec();
        else properties = await Property.find({}).exec();
    } catch(err){
        return res.status(500).json({message: 'There was an error processing your request.'});
    }
    return res.json(properties);
};

const getProperty = async(req, res) => {
    let property;
    try{
        property = await Property.findById(req.params.id).exec();
    } catch(err){
        return res.status(400).json({message: `The given ID isn't valid`});
    }

    if(!property){
        return res.status(404).json({message: `There was no property with the given ID.`});
    }

    return res.json(property);
};

const createProperty = async (req, res) => {
    const {error} = validate(req.body);
    if(error) {
        console.log(error);
        return res.status(400).json({message: error.details[0].message});
    }

    let imageURL = (req.file) ? req.file.location : 'noImage';

    try{
        const property = await Property.create({
            address: {
                houseNumber: req.body.houseNumber,
                street: req.body.street,
                town: req.body.town,
                postCode: req.body.postCode,
                county: req.body.county,
                country: req.body.country
            },
            description: req.body.description,
            imageURL: imageURL,
            agent: req.user
        });

        return res.json(property);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
};

const updateProperty = async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});

    let imageURL = (req.file) ? req.file.location : 'noImage';

    let property;
    try{
        property = await Property.findByIdAndUpdate(req.params.id, {
            address: {
                houseNumber: req.body.houseNumber,
                street: req.body.street,
                town: req.body.town,
                postCode: req.body.postCode,
                county: req.body.county,
                country: req.body.country
            },
            description: req.body.description,
            imageURL: imageURL,
            agent: req.user
        });
    }catch(err){
        return res.status(400).json({message: `The given ID isn't valid`});
    }

    if(!property){
        return res.status(404).json({message: `There was no property with the given ID.`});
    }

    return res.json(property);
};

const del = async (req, res) => {
    let property;
    try{
        property = await Property.findByIdAndDelete(req.params.id).exec();
    } catch(err){
        return res.status(400).json({message: 'Invalid Property ID'});
    }

    if(!property) return res.status(404).json({message: 'There was no property with the given ID.'});
    return res.json(property);
}

exports.getAll = getAll;
exports.getProperty = getProperty;
exports.createProperty = createProperty;
exports.updateProperty = updateProperty;
exports.delete = del;