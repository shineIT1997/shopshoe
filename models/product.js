var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath   : String,
    title       :  String,
    description : String,
    price       :  Number,
    cateId      : String,
    sl          : Number,
    theloai     : [{
        type: Schema.Types.ObjectId,
        ref: 'cate',
    }]
 
});

module.exports = mongoose.model('Product', schema);
