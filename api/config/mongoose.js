const config = require('./config');
const mongoose = require('mongoose');

//Uses mongoose and config to connect to the database and returns the database object
//Also connects the models to the database and loads them so that the other modules can access them
module.exports = function(){
    var db = mongoose.connect(config.db, {useNewUrlParser:true, useCreateIndex: true, useFindAndModify: true});
    
    //Add models to the database instance
    require('../models/user.server.model');
    require('../models/property.server.model');
    require('../models/floor.server.model');
    require('../models/room.server.model');
    require('../models/360picture.server.model');

    return db;
}