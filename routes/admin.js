const express = require('express');
const router = express.Router();
const passport = require('passport');



router.get('/', isLoggedIn, function(req, res, next){
  res.render('admin/main/index', {layout: false});
 });

 router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();
  res.redirect('/admin/login');
});
 


router.get('/login', notisLoggedIn ,function(req, res, next){
  const messages = req.flash('error');
  res.render('admin/login/login_ad', { messages: messages, hasErrors: messages.length > 0,
    layout: false
  });
 });

router.post('/login', passport.authenticate('local.login_ad',{
  successRedirect: '/admin',
  failureRedirect: '/admin/login',
  failureFlash: true
}));

 
module.exports = router;

// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated() && req.user.roles === 'ADMIN' ){
    return next();
  } else
  res.redirect('/');
};

function notisLoggedIn(req, res, next) {
    if(!req.isAuthenticated()){
      return next();
    } else {
        if(req.isAuthenticated() && req.user.roles !== 'ADMIN' ){
            return next();
        } else {
            res.redirect('/admin'); 
        }
    } 
  };

 
