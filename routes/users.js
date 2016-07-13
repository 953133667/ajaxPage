var express = require('express');
var session = require('express-session');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 *  跳转到登陆页面
 */
router.get('/login', function(req, res, next) {
  res.render('users/login', { title: '用户登录' });
});


router.get('/logout', function(req, res) {
  req.session.user = null;
  res.redirect('/');
});

/**
 *  post 登陆
 */
router.post('/login', function (req, res, next) {

  var session = req.session;
  var data = req.body;

  session.user = data;

  // res.json(session);
  res.json({
    "user": session.user
  });

});

router.get('/register', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
