var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pictureSchema = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    imageURL: String
});

mongoose.model('Picture', pictureSchema);