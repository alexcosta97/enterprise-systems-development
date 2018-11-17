var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var floorSchema = new Schema({
    propertyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },
    level: String,
    imageURL = String
});

var Floor = mongoose.model('Floor', floorSchema);