var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

//đăng ký
passport.use('local.registration', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody('phone', 'Sđt không được để trống.').notEmpty();
    req.checkBody('email', 'Địa chỉ email không hợp lệ vui, lòng kiểm tra lại.').notEmpty().isEmail();
    req.checkBody('password', 'Mật khẩu không hợp lệ, tối thiểu phải có 6 ký tự.').notEmpty().isLength({min: 6});
    req.checkBody('password', 'Nhập lại mật khẩu sai, vui lòng kiểm tra lại.').notEmpty().equals(req.body.confirmpassword);
   
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    };

    User.findOne({'email': email}, function(err, user){
        if(err){
            return done(err);
        }
        if (user){
            return done(null, false, {message: 'Email đã được sử dụng, vui lòng sử dụng email khác.'});
        }
        var newUser = new User();
        newUser.firstname = req.body.firstname;
        newUser.lastname = req.body.lastname;
        newUser.username = req.body.username;
        newUser.phone = req.body.phone;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.roles = 'MEMBER';
        newUser.save(function(err, result){
            if(err){
                return done(err);
            }
            return done(null, false, {message: 'Chúc mừng bạn đã đăng kí thành công'});
        });
    });
}));



//login
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody('email', 'Địa chỉ email không hợp lệ vui, lòng kiểm tra lại.').notEmpty().isEmail();
    req.checkBody('password', 'Mật khẩu không hợp lệ.').notEmpty();
   
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    };
    User.findOne({ 'email': email}, function(err, user){
       
        if(err){
            return done(err);
        }
        if (!user){
            return done(null, false, {message: 'Không tìm thấy người dùng.'});
        }
        if(!user.validPassword(password)){
            return done(null, false, {message: 'Sai mật khẩu.'});
        }
        req.session.user = user ? true : false;
        return done(null, user);
        
    });
}));

//login admin
passport.use('local.login_ad', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody('email', 'Địa chỉ email không hợp lệ vui, lòng kiểm tra lại.').notEmpty().isEmail();
    req.checkBody('password', 'Mật khẩu không hợp lệ.').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    };
    
    User.findOne({'email': email}, function(err, user){
        if(err){
            return done(err);
        }
        if (!user){
            return done(null, false, {message: 'Không tìm thấy người dùng.'});
        }
        if(!user.validPassword(password)){
            return done(null, false, {message: 'Sai mật khẩu.'});
        }
        if(!user.isGroupAdmin(user.roles)){
            return done(null, false, {message: 'Bạn không có quyền đăng nhập vào trang administrator, vui lòng quay lạy trang chủ.'});
        }
        return done(null, user);

    });

}));