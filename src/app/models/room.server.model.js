var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = new Schema({
    floor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Floor'
    },
    pixelsX: Number,
    pixelsY: Number
});

mongoose.model('Room', roomSchema);