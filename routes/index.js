var express = require('express');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET demo page. */
router.get('/demo', function (req, res, next) {
    res.render('demo', {title: 'ajaxpage'});
});

/**
 * 描述：通过分页形式获取笑话列表
 *      数据来自 聚合数据 http://japi.juhe.cn
 *
 */
router.post('/jokelist', function (req, res, next) {

    //获取用户传递的参数
    var data = req.body;

    console.log(data);

    // 请求第三方接口，获取数据，当然你也可以连接数据库获取
    var postData = JSON.stringify(data);

    var options = {
        hostname: 'japi.juhe.cn',
        port: 80,
        path: '/joke/content/list.from?sort=asc&page=4&pagesize=10&time=1418816972&key=931a524e5ba7cc6f022ecb4a57adfe5c',
        method: 'get',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };
    var req = http.request(options, function (res2) {

        res2.setEncoding('utf8');
        res2.on('data', function (chunk) {
            console.log(chunk);
            res.json(Json.parse(chunk));

        });
        res2.on('end', function (chunk) {
            res.json(chunk);
        })
    });

    req.on('error', function (e) {
    });

// write data to request body
    req.write(postData);
    req.end();

});


module.exports = router;
