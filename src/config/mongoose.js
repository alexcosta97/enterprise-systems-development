var config = require('./config');
mongoose = require('mongoose');

//Uses mongoose and config to connect to the database and returns the database object
//Also connects the models to the database and loads them so that the other modules can access them
module.exports = function(){
    var db = mongoose.connect(config.db, {useNewUrlParser:true});
    
    return db;
}