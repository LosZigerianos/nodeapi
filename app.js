var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
var i18n = require("./lib/i18n");
const api = require('./webservice/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Global variable for views
//res.locals.title = 'NodeAPI'

/**
 * Connection and models from Mongoose
 */
require('./lib/connectMongoose');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(i18n.init);
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/media',express.static(''d:\media))); // ejemplo para obtener ficheros de otro disco
require('./lib/passportSetup');
app.use(passport.initialize());
//app.use(passport.session());
app.use(api.configureAxios);

app.get('/login/google',
  passport.authenticate('google', { scope:
  	[ 'email', 'profile' ] }
));

app.get('/auth/google/callback', 
  passport.authenticate('google',
  {
    /*successRedirect : '/apiv1/locations',
    failureRedirect : '/',*/
    session: false
  }
  ), (req, res, next) => {
    res.json({ success: true, token: req.user.token });
  });

/**
 * Routes from app
 */
app.use('/',          require('./routes/index'));
//app.use('/users',     require('./routes/users'));
app.use('/apiv1/locations', require('./routes/apiv1/locations'));
app.use('/apiv1/users', require('./routes/apiv1/users'));
app.use('/apiv1/comments', require('./routes/apiv1/comments'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // Validation error
  if (err.array) {
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = `Not valid - ${errInfo.param} ${errInfo.msg}`
  }

  res.status(err.status || 500);

  // Check request is API or web
  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

const isAPI = req => {
  return req.originalUrl.indexOf('/apiv') === 0;
} 

module.exports = app;
