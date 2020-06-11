var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Cate = new Schema({
    ten         : String,
    tenkhongdau : String
});

module.exports = mongoose.model('cate', Cate);
