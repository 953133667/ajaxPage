/**
 * Created by Administrator on 2016/7/11.
 */
var http = require("http");

http.get({
    hostname: 'japi.juhe.cn',
    method: 'GET',
    port: 80,
    path: '/joke/content/list.from?sort=asc&page=1&pagesize=10&time=1418816972&key=931a524e5ba7cc6f022ecb4a57adfe5c'
}, function (res) {
    // Do stuff with response
    console.log(res);

});
