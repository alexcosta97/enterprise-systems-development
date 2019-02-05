const {Floor, validate} = require('../models/floor.server.model');
const {Property} = require('../models/property.server.model');
const _ = require('lodash');

const getAll = async (req, res) => {
    let floors;
    try{
        floors = await Floor.find({'property._id': req.query.property}).sort('level').exec();
    } catch(err){
        return res.status(500).json({message: 'There was an error processing your request.'});
    }
    return res.json(floors);
};

const getFloor = async(req, res) => {
    let floor;
    try{
        floor = await Floor.findById(req.params.id).exec();
    } catch(err){
        return res.status(400).json({message: `The given ID isn't valid`});
    }

    if(!floor){
        return res.status(404).json({message: `There was no floor with the given ID.`});
    }

    return res.json(floor);
};

const createFloor = async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});

    let property = await Property.findById(req.body.property).exec();
    if(!property) return res.status(400).json({message: 'Invalid Property ID'});

    let imageURL = (req.file) ? req.file.location : 'noImage';

    try{
        const floor = await Floor.create({
            property: property._id,
            level: req.body.level,
            imageURL: imageURL
        });

        return res.json(floor);
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }
};

const updateFloor = async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});

    let property = await Property.findById(req.body.property).exec();
    if(!property) return res.status(400).json({message: 'Invalid Property ID'});

    let imageURL = (req.file) ? req.file.location : 'noImage';

    let floor;
    try{
        floor = await Floor.findByIdAndUpdate(req.params.id, {
            property: property._id,
            level: req.body.level,
            imageURL: imageURL
        });
    }catch(err){
        return res.status(400).json({message: `The given ID isn't valid`});
    }

    if(!floor){
        return res.status(404).json({message: `There was no floor with the given ID.`});
    }

    return res.json(floor);
};

const del = async (req, res) => {
    let floor;
    try{
        floor = await Floor.findByIdAndDelete(req.params.id).exec();
    } catch(err){
        return res.status(400).json({message: 'Invalid Floor ID'});
    }

    if(!floor) return res.status(404).json({message: 'There was no floor with the given ID.'});
    return res.json(floor);
}

exports.getAll = getAll;
exports.getFloor = getFloor;
exports.createFloor = createFloor;
exports.updateFloor = updateFloor;
exports.deleteFloor = del;