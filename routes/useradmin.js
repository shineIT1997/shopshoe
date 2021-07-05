const express = require('express');
const router = express.Router();

const user = require('../models/user.js');



router.get('/', isLoggedIn, function(req, res, next) {
  res.redirect('/admin/user/danh-sach.html', {layout: false});
});

router.get('/danh-sach.html', isLoggedIn, function(req, res, next) {
	user.find().then(function(data){
        console.log(data)
	    res.render('admin/user/danh-sach', {us: data, layout: false});
	});
  
});

router.get('/:id/sua-user.html', isLoggedIn, function(req, res, next) {
    const id = req.params.id;
      user.findById(id).then(function(data){
        res.render('admin/user/sua-user', {dataa: data, layout: false});
   });
});

router.post('/:id/sua-user.html', isLoggedIn,  function(req, res, next) {
  user.findById(req.params.id, function(err, data){
    data.roles = req.body.roles;
     data.save();
      req.flash('succsess_msg', 'Đã Sửa Thành Công');
      res.redirect('/admin/user/'+req.params.id+'/sua-user.html');
  });
});
router.post('/:id/sua-user-by-user.html', isLoggedInWithoutAdmin,  function(req, res, next) {
  user.findById(req.params.id, function(err, data){
    data.firstname = req.body.hovachulot;
    data.lastname  = req.body.ten;
    data.phone     = Number(req.body.sodienthoai)
    data.username  = req.body.tendangnhap
    
     data.save();
      req.flash('succsess_msg', 'Đã Sửa Thành Công');
      res.redirect('/user/profile');
  });
  console.log('ddasdas');
  
});
router.get('/:id/xoa-user.html', isLoggedIn, function(req, res, next) {
    const id = req.params.id;
        user.findOneAndRemove({_id: id}, function(err, offer){
            req.flash('succsess_msg', 'Đã Xoá Thành Công');
        res.redirect('/admin/user/danh-sach.html'); 
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


  function isLoggedInWithoutAdmin(req, res, next){
    if(req.isAuthenticated() ){
      return next();
    } else
    res.redirect('/login');
  };