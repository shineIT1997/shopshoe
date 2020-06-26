var express = require('express');
var router = express.Router();


var Sources = require('../models/sources.js');
const Cate = require('../models/cate.js')

function bodauTV(str) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/ /g, "-");
  str = str.replace(/\./g, "-");
  return str;
}


// router.get('/', isLoggedIn, function(req, res, next) {
//   res.redirect('/admin/cate/danh-sach.html', {layout: false});
// });

router.get('/danh-sach.html', isLoggedIn, function(req, res, next) {
  Cate.find().then(function(cates){
    res.render('admin/cate/danh-sach', {layout: false, cates});
  });
});

router.get('/them-cate.html', isLoggedIn, function(req, res, next) {
  res.render('admin/cate/them-cate', {layout: false});
});

router.post('/them-cate.html', isLoggedIn, (req, res, next) => {
  req.checkBody('tentheloai', 'Tên không được trống').notEmpty();
  console.log(req.body);
  Cate.find({MaTL: req.body.MaTL}).then(result => {
      console.log();
      if(!Array.isArray(result) || !result.length) {
        let cate = new Cate({
          tentheloai: req.body.tentheloai,
          MaTL: req.body.MaTL
        })
        cate.save().then(() => {
          req.flash('succsess_msg', 'Đã thêm Thể loại');
          res.redirect('/admin/cate/them-cate.html', );
        })

      }
      else {
        req.flash('succsess_msg', 'Thể loại đã tồn tại');
        res.redirect('/admin/cate/them-cate.html', );
      }
    }
    )
})

///Nhà cung cấp
// router.post('/them-cate.html', isLoggedIn,  function(req, res, next) {
//   console.log(req.body , 'cate');
  
//   var source = new Sources({
//     name   : req.body.name,
//     address  : req.body.address,
//     email  : req.body.email,
//     phone  : req.body.phone,
//     description  : req.body.description
//   });
// 	source.save().then(function(){
// 		req.flash('succsess_msg', 'Đã Thêm Thành Công');
// 		res.redirect('/admin/cate/them-cate.html'); 
// 	});
// });

router.get('/:id/sua-cate.html', isLoggedIn,  function(req, res, next) {
	Cate.findById(req.params.id, function(err, data){
		res.render('admin/cate/sua-cate',{ errors: null, data: data, layout: false});
	});	
});

router.post('/:id/sua-cate.html', isLoggedIn,  function(req, res, next) {
  		Cate.findById(req.params.id, function(err, data){
			data.tentheloai 	    = req.body.tentheloai;
			data.save();
			req.flash('succsess_msg', 'Đã Sửa Thành Công');
			res.redirect('/admin/cate/'+req.params.id+'/sua-cate.html');
		});
});

router.get('/:id/xoa-cate.html',  isLoggedIn, function(req, res, next) {
	
	Cate.findById(req.params.id).remove(function() { 
		req.flash('succsess_msg', 'Đã Xoá Thành Công');
		res.redirect('/admin/cate/danh-sach.html');
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