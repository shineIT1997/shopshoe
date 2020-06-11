var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name   : String,
    address       :  String,
    email : String,
    phone       :  Number,
    description      : String,
});

module.exports = mongoose.model('Sources', schema);
