var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Cate = new Schema({
    tentheloai : String,
    MaTL: String
});

module.exports = mongoose.model('cate', Cate);
