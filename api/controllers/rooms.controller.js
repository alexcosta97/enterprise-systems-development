const Room = require('../models/room.server.model');
const {Floor} = require('../models/floor.server.model');
const _ = require('lodash');

const getAll = async (req, res) => {
    let rooms;
    try{
        rooms = await Room.find({floor: req.query.floor}).sort('name').exec();
    } catch(err){
        return res.status(500).json({message: 'There was an error processing your request.'});
    }
    return res.json(rooms);
};

const getRoom = async(req, res) => {
    let room;
    try{
        room = await Room.findById(req.params.id).exec();
    } catch(err){
        return res.status(400).json({message: `The given ID isn't valid`});
    }

    if(!room){
        return res.status(404).json({message: `There was no room with the given ID.`});
    }

    return res.json(room);
};

const createRoom = async (req, res) => {
    const {error} = Room.validateInput(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});

    let floor = await Floor.findById(req.body.floor).exec();
    if(!floor) return res.status(400).json({message: 'Invalid Floor ID'});

    try{
        const room = await Room.create({
            floor: floor._id,
            name: req.body.name,
            pixelsXMin: req.body.pixelsXMin,
            pixelsXMax: req.body.pixelsXMax,
            pixelsY: req.body.pixelsY
        });

        return res.json(room);
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }
};

const updateRoom = async (req, res) => {
    const {error} = Room.validateInput(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});

    let floor = await Floor.findById(req.body.floor).exec();
    if(!floor) return res.status(400).json({message: 'Invalid Floor ID'});

    let room;
    try{
        room = await Room.findByIdAndUpdate(req.params.id, {
            floor: floor._id,
            name: req.body.name,
            pixelsXMin: req.body.pixelsXMin,
            pixelsXMax: req.body.pixelsXMax,
            pixelsY: req.body.pixelsY
        });
    }catch(err){
        return res.status(400).json({message: `The given ID isn't valid`});
    }

    if(!room){
        return res.status(404).json({message: `There was no room with the given ID.`});
    }

    return res.json(room);
};

const del = async (req, res) => {
    let room;
    try{
        room = await Room.findByIdAndDelete(req.params.id).exec();
    } catch(err){
        return res.status(400).json({message: 'Invalid Room ID'});
    }

    if(!room) return res.status(404).json({message: 'There was no room with the given ID.'});
    return res.json(room);
}

exports.getAll = getAll;
exports.getRoom = getRoom;
exports.createRoom = createRoom;
exports.updateRoom = updateRoom;
exports.deleteRoom = del;