var config = require('./config');
mongoose = require('mongoose');

//Uses mongoose and config to connect to the database and returns the database object
//Also connects the models to the database and loads them so that the other modules can access them
module.exports = function(){
    var db = mongoose.connect(config.db, {useNewUrlParser:true});
    
    //Add models to the database instance
    require('../app/models/user.server.model');
    require('../app/models/property.server.model');
    require('../app/models/floor.server.model');
    require('../app/models/room.server.model');
    require('../app/models/360picture.server.model');

    return db;
}