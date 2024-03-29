var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport'); // подключили паспорт модуль
var LocalStrategy = require('passport-local').Strategy;

var config = require('./config'); // добавили конфиг файл с настройками

mongoose.connect(config.mongoUrl); // сослались на конфиг
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Connected correctly to server");
});

var routes = require('./routes/index');
var users = require('./routes/users');
var dishes = require('./routes/dishRouter');
var leaders = require('./routes/leaderRouter');
var promotions = require('./routes/promoRouter');

var app = express();

// перенаправляем весь трафффик на защищенный HTTPS сервер
app.all('*', function (req, res, next){
  if(req.secure) return next();
  res.redirect('https://' + req.hostname + ':' + app.get('secPort') + req.url)
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// настройки паспорта
var User = require('./models/user');
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/dishes', dishes);
app.use('/leaders', leaders);
app.use('/promotions', promotions);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// возвращаем ошибки в формате json - делается в основном для Ангулара
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ // json!
      message: err.message,
      error: err
    });
  });
}

// возвразаем ошибки в формате json - делается в основном для Ангулара
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ // json!
    message: err.message,
    error: {}
  });
});

module.exports = app;
