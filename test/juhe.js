/**
 * Created by Administrator on 2016/7/11.
 */
var http = require("http");
var qs = require('querystring');

var data = {
    page: 1,
    pagesize: 10,
    sort:"asc",
    key:"931a524e5ba7cc6f022ecb4a57adfe5c",
    time: 1418745237
};//这是需要提交的数据
var content = qs.stringify(data);
var options = {
    hostname: 'japi.juhe.cn',
    port: 80,
    path: '/joke/content/list.from?' + content,
    method: 'GET'
};
var req = http.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log(chunk);
    });
});
req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});
req.end();
