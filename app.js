var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongodb = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var userRouters = require('./routes/user');
var admin = require('./routes/admin');
var product = require('./routes/product');
var cart = require('./routes/cart');
var user = require('./routes/useradmin');
var cate = require('./routes/cate');

var app = express();
mongodb.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true});
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout:'layout', extname:'hbs'}));
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'thanhdat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongodb.connection }),
  // cookie: {maxAge: 180 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.succsess_msg = req.flash('succsess_msg');
  res.locals.user = req.user;
  next();
});

app.use('/user', userRouters);
app.use('/', indexRouter);
app.use('/admin', admin);
app.use('/admin/product', product);
app.use('/admin/cart', cart);
app.use('/admin/user', user);
app.use('/admin/cate', cate);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
