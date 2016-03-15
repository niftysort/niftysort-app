'use strict';

var express = require('express');
var dotenv = require('dotenv').config();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose  = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');
var categories = require('./routes/categories');

var app = express();

// sets up mongoose database for remote (Heroku deployment) or local development
var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/amazonReviewsAPI';
mongoose.connect(mongoUrl, function(err) {
  if(err) {
    console.log("Mongo error: ", err);
  } else {
    console.log(`MongoDB connected to ${mongoUrl}`);
  }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); enable after placing favicon in public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'animate')));

app.use('/', routes);
app.use('/users', users);
app.use('/v1/categories', categories);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
