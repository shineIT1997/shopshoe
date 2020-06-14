var mongoose = require('mongoose');
const { schema } = require('./product');
var Schema = mongoose.Schema;

var Cart = new Schema({

    firstname		: String,
    lastname        : String,
    phone           : Number,
    email 			: String,
    diachi   		: String,
    thanhpho        : String,
    cart 		    : Object,
    st              : Number,
    Tien            : Number,
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
},
{
    collection: 'Giohang',
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
}
);
module.exports = mongoose.model('Giohang', Cart);