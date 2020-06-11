var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true}, function(err, db) {
    if (err) {
        console.log('MongoDB connection fail');
        throw err;
    } else {
        database = db;
        console.log('MongoDB connection successful');
    }
});
var products = [
    new Product({
        imagePath : "p1.jpg" ,
        title : "Giày Addidas cho người chơi thể thao",
        description : "Thiết kế năng động trẻ trung",
        price : 150000,
        sl: 20
    }),
    new Product({
      imagePath : "p2.jpg",
      title : "Giày Sneaker MUST Korea",
      description : "Chất liệu làm bằng da PU mềm mại tự nhiên, bền chắc, tạo sự thoải mái trong mỗi bước chân.",
      price : 210000,
      sl: 20
    }),
    new Product({
      imagePath : "p3.jpg",
      title : "Giày Lười Phong Cách Hàn Quốc",
      description : "Giá cả cạnh tranh với giá các shop trên toàn quốc, chất liệu da vải bền đẹp chắc chắn.",
      price : 350000,
      sl: 20
    }),
    new Product({
        imagePath : "p5.jpg",
        title : "Giày thể thao",
        description : "Giá cả cạnh tranh với giá các shop trên toàn quốc.",
        price : 250000,
        sl: 20
      }),
      new Product({
        imagePath : "p6.jpg" ,
        title : "Giày Addidas cho người chơi thể thao",
        description : "Thiết kế năng động trẻ trung",
        price : 99000,
        sl: 20
    }),
    new Product({
      imagePath : "p8.jpg",
      title : "Giày Sneaker MUST Korea",
      description : "Chất liệu làm bằng da PU mềm mại tự nhiên, bền chắc, tạo sự thoải mái trong mỗi bước chân.",
      price : 215000,
      sl: 20
    }),
    new Product({
      imagePath : "p4.jpg",
      title : "Giày Lười Phong Cách Hàn Quốc",
      description : "Giá cả cạnh tranh với giá các shop trên toàn quốc, chất liệu da vải bền đẹp chắc chắn.",
      price : 255000,
      sl: 20
    }),
    new Product({
        imagePath : "p7.jpg",
        title : "Giày thể thao",
        description : "Giá cả cạnh tranh với giá các shop trên toàn quốc.",
        price : 250000,
        sl: 20
      })
  
  ];

  var done =0;
for(var i=0; i<products.length; i++){
    products[i].save(function(err, result){
        done++;
        if(done === products.length){
            exit();
        }
    });

}
function exit(){
    mongoose.disconnect();
}