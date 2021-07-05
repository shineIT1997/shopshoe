const express = require('express');
const router = express.Router();
const multer  = require('multer');

//cấu hình đường dẫn file upload và tên file upload 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
     cb(null, './public/upload'); //đg dẫn file
   },
   filename: function (req, file, cb) {
     cb(null, Date.now() + '_' + file.originalname); //tên file
   }
 });
 const upload = multer({ storage: storage });

const Product = require('../models/product.js');
const Cate = require('../models/cate.js');

/* GET home page. */
router.get('/', isLoggedIn, function (req, res) {
	res.redirect('/admin/product/danh-sach.html', {layout: false});
});

router.get('/danh-sach.html', isLoggedIn,function (req, res) {
    Product.find().then(function(pro){
    res.render('admin/product/danh-sach', {product: pro,
        layout: false
		});
});
});

//thêm sản phẩm
router.get('/them-product.html', isLoggedIn, function (req, res) {
	Cate.find().then(function(cates){
		console.log(cates);
		
		res.render('admin/product/them',{errors: null, cates: cates, layout: false});
	});
});
router.post('/them-product.html', isLoggedIn, upload.single('hinh'), function (req, res) {
		console.log(req.body);
		
	req.checkBody('name', 'Tên không được trống').notEmpty();
	req.checkBody('gia', 'giá phải là số').isInt();
	req.checkBody('soluong', 'soluong là số').isInt();
	req.checkBody('des', 'Chi tiết không được trống').notEmpty();
		const errors = req.validationErrors();
		
	if (errors) {
		const file = './public/upload/' + req.file.filename;
		  const fs = require('fs');
			fs.unlink(file, function(e){
				if(e) throw e;
			});
	} else {
	const pro = new Product({
      imagePath 			: req.file.filename,
      title 			    : req.body.name,
      description		    : req.body.des,
			price 			    : req.body.gia,
			cateId				: req.body.cate,
			soluong				: req.body.soluong,
			theloai				:req.body.theloai
		});
	pro.save().then(function(){
      req.flash('succsess_msg', 'Đã Thêm Thành Công');
			res.redirect('/admin/product/them-product.html', ); 
		});
	}
});

//Sửa sản phẩm
router.get('/:id/sua-product.html', function (req, res) {
	Product.findById(req.params.id).then(function(data){
		Cate.find().then(function(cates){
		res.render('admin/product/sua',{errors: null, product: data, cates: cates, layout: false});
		});
	});
});

router.post('/:id/sua-product.html',  upload.single('hinh'), function (req, res) {
	req.checkBody('name', 'Tên không được trống').notEmpty();
	req.checkBody('gia', 'giá phải là số').isInt();
	req.checkBody('des', 'Chi tiết không được trống').notEmpty();

    const errors = req.validationErrors();
	  if (errors) {
		const file = './public/upload/' + req.file.filename;
		const fs = require('fs');
		fs.unlink(file, function(e){
			if(e) throw e;
		 });
  		Product.findById(req.params.id).then(function(data){
				res.render('admin/product/sua',{errors: errors, product: data});
			});
	    } else {
		Product.findOne({ _id: req.params.id},  function(err, data){
			const file = './public/upload/' + data.imagePath;
			const fs = require('fs');
			fs.unlink(file, function(e){
				if(e) throw e;
			 });
			data.title 		    	  = req.body.name,
			data.imagePath  		  = req.file.filename,
			data.description		  = req.body.des,
			data.price 			      = req.body.gia,
			data.theloai				  = req.body.theloai 

			data.save();
				req.flash('succsess_msg', 'Đã Sửa Thành Công');
				res.redirect('/admin/product/'+req.params.id+'/sua-product.html');
		});
	}
});

//xóa sản phẩm
router.get('/:id/xoa-product.html', isLoggedIn,  function (req, res) {
	Product.findById(req.params.id, function(err, data){
		const file = './public/upload/' + data.imagePath ;
		const fs = require('fs');
		fs.unlink(file, function(e){
			if(e) throw e;
		 });
		data.remove(function(){
			req.flash('succsess_msg', 'Đã Xoá Thành Công');
			res.redirect('/admin/product/danh-sach.html');
		})
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
	

  
