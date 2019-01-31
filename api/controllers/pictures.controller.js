const Room = require('../models/room.server.model');
const Picture = require('../models/360picture.server.model');
const _ = require('lodash');

const getAll = async (req, res) => {
    let pictures;
    try{
        pictures = await Picture.find({room: req.query.room}).exec();
        return res.json(pictures);
    } catch(err){
        return res.status(500).json({message: 'There was an error processing your request.'});
    }
};

const getPicture = async(req, res) => {
    let picture;
    try{
        picture = await Picture.findById(req.params.id).exec();
    } catch(err){
        return res.status(400).json({message: `The given ID isn't valid`});
    }

    if(!picture){
        return res.status(404).json({message: `There was no picture with the given ID.`});
    }

    return res.json(picture);
};

const createPicture = async (req, res) => {
    const {error} = Picture.validatePicture(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});

    let room = await Room.findById(req.body.room).exec();
    if(!room) return res.status(400).json({message: 'Invalid Room ID'});

    let picture;
    try{
        picture = await Picture.create({
            room: room._id,
            imageURL: req.files[0].location
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }
    return res.json(picture);
};

const updatePicture = async (req, res) => {
    const {error} = Picture.validatePicture(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});

    let room = await Room.findById(req.body.room).exec();
    if(!room) return res.status(400).json({message: 'Invalid Room ID'});

    let picture;
    try{
        picture = await Picture.findByIdAndUpdate(req.params.id, {
            room: room._id,
            imageURL: req.files[0].location
        });
    }catch(err){
        return res.status(400).json({message: `The given ID isn't valid`});
    }

    if(!picture){
        return res.status(404).json({message: `There was no picture with the given ID.`});
    }

    return res.json(picture);
};

const del = async (req, res) => {
    let picture;
    try{
        picture = await Picture.findByIdAndDelete(req.params.id).exec();
    } catch(err){
        return res.status(400).json({message: 'Invalid Picture ID'});
    }

    if(!picture) return res.status(404).json({message: 'There was no picture with the given ID.'});
    return res.json(picture);
}

exports.getAll = getAll;
exports.getPicture = getPicture;
exports.createPicture = createPicture;
exports.updatePicture = updatePicture;
exports.deletePicture = del;