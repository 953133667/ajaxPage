var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 *  跳转到登陆页面
 */
router.get('/login', function(req, res, next) {
  res.render('user/login', { title: '用户登录' });
});

/**
 *  post 登陆
 */
router.post('/login', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
