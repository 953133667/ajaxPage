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

/**
 *  post 登陆
 */
router.post('/login', function(req, res, next) {

  console.log(req.body);
  req.session.user_id = "ffffff";
  console.log(req.session.user_id);

/*  req.session.cookie.user={
    "username":req.body.username,
    "password":req.body.password
  };*/
  /* 发送一个json 格式的响应 */
  res.json({
    "user": req.body
  });
});

router.get('/register', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
