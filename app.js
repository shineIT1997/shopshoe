const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const expressHbs = require('express-handlebars');
const mongodb = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const MongoStore = require('connect-mongo')(session);

const indexRouter = require('./routes/index');
const userRouters = require('./routes/user');
const admin = require('./routes/admin');
const product = require('./routes/product');
const cart = require('./routes/cart');
const user = require('./routes/useradmin');
const cate = require('./routes/cate');

const app = express();
mongodb.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true});
require('./config/passport');


const hbs = expressHbs.create({ 
  defaultLayout: 'layout',
  extname:'hbs',
  helpers: {
    ifCond: function(v1, v2, options) {
      if(v1 == v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    findInArray: function(v1, array, options) {
      if(!Array.isArray(array)|| !array.length) {
        console.log(array , 'array');
        
        return options.inverse(this)
      }
      else {
        for (let el of array) {
          console.log(el==v1, 'compare');
          if(el==v1) return options.fn(this)
        }
      }
    }
  }
  /* config */ });
// view engine setup
app.engine('.hbs', hbs.engine);
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

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
