var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PropertySchema = new Schema({
    houseNumber: String,
    streetName: String,
    town: String,
    postCode: String,
    county: String,
    country: String,
    description: String,
    URL: String,
    agent: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Property', PropertySchema);