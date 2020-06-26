var express = require('express');
var router = express.Router();

var giohang = require('../models/giohang.js');
var Cart = require('../models/cart.js');


router.get('/', isLoggedIn, function(req, res, next) {
  res.redirect('/admin/cart/danh-sach.html', {layout: false});
});

router.get('/danh-sach.html', isLoggedIn, function(req, res, next) {
	giohang.find().then((data) => {

        let dataBack = data.map((item, index) => {
            let day = [item.updatedAt.getDate(), item.updatedAt.getMonth() + 1, item.updatedAt.getFullYear()]
            let time = [item.updatedAt.getHours(), item.updatedAt.getMinutes()]
                
            item["_doc"].updatedAt =  day.join("/") + " " + time.join(":")

            return item
        })
        
        console.log(dataBack);

        
	    res.render('admin/cart/danh-sach', {data: data.reverse(), layout: false});
	});
  
});

router.get('/:id/xem-cart.html', isLoggedIn, function(req, res, next) {
    var id = req.params.id;
    giohang.findById(id).then(function(dl){
        res.render('admin/cart/view', {pro: dl ,layout: false });
   });
});

router.get('/:id/thanh-toan-cart.html', isLoggedIn, function(req, res, next) {
    var id = req.params.id;
    giohang.findById(id, function(err, data){
        data.st -= 1;
        data.save();
        req.flash('succsess_msg', 'Đã Đặt Sản Phẩm');
       res.redirect('/admin/cart/'+id+'/xem-cart.html');
    });
});


router.post('/:id/sua-cart.html', check, function(req, res, next) {

    var id = req.params.id;
    
    giohang.findByIdAndUpdate(id, { 
      firstname: req.body.ho,
      lastname: req.body.ten,
      phone: req.body.number,
      email: req.body.email,
      diachi: req.body.add,
      thanhpho: req.body.city,
    }, (err, result) => {
      if(result) {
          req.flash('succsess_msg', `Đã Sửa đơn hàng ${id}`);
         res.redirect('/user/don-hang');
      }
    })
  });



router.get('/:id/xoa-cart.html', isLoggedIn, function(req, res, next) {
    var id = req.params.id;
    giohang.findOneAndRemove({_id: id}, function(err, offer){
        req.flash('succsess_msg', 'Đã Xoá Thành Công');
       res.redirect('/admin/cart/danh-sach.html'); 
    });
});

module.exports = router;

// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next){
    if(req.isAuthenticated() && req.user.roles === 'ADMIN' ){
      return next();
    } else
    res.redirect('/admin/login');
  };

  function check(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } else
    res.redirect('/admin/login');
  };