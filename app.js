var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

//配置ssesion
// Use the session middleware
var options = {
  "host": "127.0.0.1",
  "port": "6379",
  "ttl": 60 * 60 * 24 * 30,   //Session的有效期为30天
};
// 此时req对象还没有session这个属性
app.use(session({
  store: new redisStore(options),
  secret: 'express is powerful'
}));
// 经过中间件处理后，可以通过req.session访问session object。比如如果你在session中保存了session.userId就可以根据userId查找用户的信息了。

var routes = require('./routes/index');
var users = require('./routes/users');

var hbs = require('hbs');



//开发模式
app.set('env', 'development');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(require('node-compass')({mode: 'expanded'}));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//引入模板覆盖功能
var blocks = {};
hbs.registerHelper('extend', function(name, context) {
  var block = blocks[name];
  if (!block) {
    block = blocks[name] = [];
  }
  block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});
hbs.registerHelper('block', function(name) {
  var val = (blocks[name] || []).join('\n');
  // clear the block
  blocks[name] = [];
  return val;
});
hbs.registerHelper('raw', function(options) {
  return options.fn();
});


//配置模板路径
hbs.registerPartials(__dirname + '/views/global/');

//读取配置文件
global.config=JSON.parse(fs.readFileSync(__dirname+'/config.json'));






module.exports = app;
