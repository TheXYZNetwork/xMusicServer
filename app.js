var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var fs = require('fs');
var routePath = './routes/';
var config = require('./config/config');

var app = express();

app.use(logger(function(tokens, req, res){
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('json spaces', 2); // creds https://stackoverflow.com/a/48062695
app.enable('trust proxy');

fs.readdirSync(routePath).forEach(function(file) {
    var route = routePath + file;
    require(route)(app, config);
});

require("./mediaServer.js")(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.stack = req.app.get('env') === 'development' ? err.stack : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
  	message: res.locals.message,
  	error: res.locals.error,
  	stack: res.locals.stack
  });
});

module.exports = app;