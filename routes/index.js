var express = require('express');
var router = express.Router();

var Giohang= require('../models/giohang');
var Cart= require('../models/cart');
var Product = require('../models/product');
var Cate = require('../models/cate');


/* GET home page. */
router.get('/', function(req, res, next) {
  // var login  = req.session.user ? true : false
  Product.find().limit(6).then(function(product){
    res.render('shop/index', { products: product });
  });
  
});

// tìm sản phẩm index
router.post('/', function (req, res) {
  var find = req.body.find;
  Cate.find().then(function(cate){
		Product.find({title: {$regex: find}}, function(err, result){
      console.log(result)
			res.render('shop/san-pham',{product: result, cate: cate});
		});
  })
});

//category
router.get('/cate/:name.:id.html', function (req, res) {
  // var login  = req.session.user ? true : false
	Product.find({cateId: req.params.id}, function(err, data){
		Cate.find().then(function(cate){
			res.render('shop/san-pham',{product: data, cate: cate});
		});
	});
});

// tìm sản phẩm category
router.post('/cate/:name.:id.html', function (req, res) {
  var find = req.body.find;
  Cate.find().then(function(cate){
		Product.find({title: {$regex: find}}, function(err, result){
			res.render('shop/san-pham',{product: result, cate: cate});

		});
  });
});

//trang category
router.get('/san-pham.html', function (req, res) {
	Product.find().then(function(product){
		Cate.find().then(function(cate){
			res.render('shop/san-pham',{product: product, cate: cate});
		});
	});
});

// tìm sản phẩm category
router.post('/san-pham.html', function (req, res) {
  var find = req.body.find;
  Cate.find().then(function(cate){
		Product.find({title: {$regex: find}}, function(err, result){
			res.render('shop/san-pham',{product: result, cate: cate});
		});
  });
});

//trang chi tiết sp
router.get('/chi-tiet/:id', function (req, res) {
      Product.findById(req.params.id).then(function(data){
        console.log(data);
        res.render('shop/chi-tiet', { products: data });
      });
    });

// tìm sản phẩm chi tiết
router.post('/chi-tiet/:id', function (req, res) {
  var find = req.body.find;
  Cate.find().then(function(cate){
		Product.find({title: {$regex: find}}, function(err, result){
			res.render('shop/san-pham',{product: result, cate: cate});
		});
  });
});

//tiến hành thanh toán
router.post('/thanh-toan', function (req, res) {
	var giohang = new Cart(req.session.cart );
	var data = giohang.convertArray();
  var Tong = giohang.Tien;
  
  for ( let element of data) {
    let soluong = element.item.sl - element.sl
    if(soluong < 0) {
      res.redirect('/gio-hang');
    }
    else {
      Product.findByIdAndUpdate(element.item._id, {$set: {sl: soluong}}, function(err , result) {
        console.log(result," result");
      } )
    }
  }
	var cart = new Giohang({
    firstname		:  req.body.ho,
    lastname    :  req.body.ten,
		email 	    :  req.body.email,
    phone 		  :  req.body.number,
    diachi      :  req.body.add,
    thanhpho    :  req.body.city,
    cart 		    :  data, 
    st          :   0,
    Tien        :  Tong
  });
  
  
	cart.save().then(function(){
    req.session.cart = {items: {}};
		res.render('shop/done', {products: data, Tong: Tong});
	});
	
});

router.get('/thanh-toan', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/gio-hang', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/thanh-toan', {products: cart.convertArray(), Tien: cart.Tien});
  
});

// tìm sản phẩm thanh toán
router.post('/thanh-toan', function (req, res) {
  var find = req.body.find;
  Cate.find().then(function(cate){
		Product.find({title: {$regex: find}}, function(err, result){
			res.render('shop/san-pham',{product: result, cate: cate});
		});
  });
});

//thêm vào giỏ hàng
router.get('/them-vao-gio-hang/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart( (req.session.cart) ? req.session.cart : {} );

  Product.findById(productId, function(err, product){
    if(err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/gio-hang');
  });
});

router.get('/gio-hang', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/gio-hang', {products: null});
  }
  var cart = new Cart(req.session.cart);
  console.log(cart.convertArray())
  res.render('shop/gio-hang', {products: cart.convertArray(), Tien: cart.Tien});

});

// tìm sản phẩm giỏ hàng
router.post('/gio-hang', function (req, res) {
  var find = req.body.find;
  Cate.find().then(function(cate){
		Product.find({title: {$regex: find}}, function(err, result){
			res.render('shop/san-pham',{product: result, cate: cate});
		});
  });
});

//del 1 product
router.get('/remove/:id', function(req,res){
	var productId = req.params.id;
  var giohang = new Cart( (req.session.cart) ? req.session.cart : {} );
  
  giohang.delCart( productId);
   req.session.cart=giohang;
  res.redirect('/gio-hang');
});

//del product
router.get('/delcart/:id', function(req,res){
	var productId = req.params.id;
  var giohang = new Cart( (req.session.cart) ? req.session.cart : {} );
  
  giohang.remove( productId);
   req.session.cart=giohang;
  res.redirect('/gio-hang');
});

//update sp
router.post('/update/:id', function(req,res){
  var productId = req.params.id;
  var sl = req.body.sl;
  var giohang = new Cart( (req.session.cart) ? req.session.cart : {} );
  
  giohang.updateCart( productId, sl);
  req.session.cart=giohang;
  var data = giohang.convertArray();
  res.render('shop/gio-hang', {products: data, Tien: giohang.Tien});
});


module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}