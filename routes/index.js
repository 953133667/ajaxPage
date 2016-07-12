var express = require('express');
var http = require('http');
var qs = require('querystring');
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

    var data = req.body;//获取用户传递的参数
    var config = global.config;
    
    data.key = config.appkey;  //从配置文件中读取 appkey
    console.log(data);

    var content = qs.stringify(data);// 请求第三方接口，获取数据，当然你也可以连接数据库获取

    var options = {
        hostname: 'v.juhe.cn',
        port: 80,
        path: '/weixin/query?' + content,
        method: 'GET'
    };

    var req2 = http.request(options, function (res2) {
        console.log('STATUS: ' + res2.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res2.headers));
        res2.setEncoding('utf8');
        var result = "";  //需要返回的数据，如果数据过长，就分多次写入拼接
        res2.on('data', function (chunk) {
            result += chunk;
        });
        res2.on('end', function () {
            // result = str2json.convert(chunk);
            res.json(JSON.parse(result));
        });
    });
    req2.on('error', function (e) {
        console.error('problem with request: ' + e.message);
    });
    req2.end();

});


module.exports = router;
