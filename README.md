#ajaxPage
###说明：这是一个ajax分页插件
由于分页插件依赖后台数据格式，所以很难实现解耦（如果你有好的方案，可以提交给作者）。所以这里，我们需要规定一下后台数据的格式，注：如果你需要修改对应数据的格式，请自行动手
#使用
***
###引入依赖：(Require)
#####你需要在页面中引入以下文件：
>`<!-- jQuery文件。务必在ajaxPage.js 之前引入 -->`
>
>`<script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>`
>
>`<!--必须的库文件-->`
>
>`<link rel="stylesheet" href="/javascripts/ajaxpage/ajaxpage.css">`
>
>`<script src="/javascripts/ajaxpage/ajaxpage.js"></script>`
>
>`<!--可选的前端模板引擎-->`
>
>`<script src="//cdn.bootcss.com/handlebars.js/4.0.5/handlebars.min.js"></script>`

###模板（Template）
***
#####你需要在页面中定义handlebars模板，以方便数据渲染，没听过handlebars模板引擎？请移步 [handlebars官网](http://handlebarsjs.com/ "handlebars") ， 利用前端模板引擎，提高模板的可读性和可维护性：
    <script id='j-tmpl' type='text/x-jquery-tmpl'>
		{{#each list}}
   		 <tr>
       		<td>
         		<img class="ui-news-img" src="{{f利用前端模板引擎irstImg}}" alt="">
       		</td>
       		<td>{{id}}</td>
       		<td>{{mark}}</td>
       		<td>{{source}}</td>
       		<td>{{title}}</td>
       		<td>
          		<a href="{{url}}">查看详情</a>
       		</td>
   		</tr>
		{{/each}}
	</script>

###参数（Options）
***
    //document ready
    $(document).ready(function () {
        $("#tbody").ajaxPage({  //tbody 为分页内容容器
            url: "/jokelist",   //请求地址
            data: {             //请求参数
                "pno": 1,       //当前页码
                "ps": 10        //page size
            },
            type: "post",       //请求类型
            dataType: "json",//数据类型为json
            pageId: $("#J_PageBar"),  //分页菜单容器
            run: true,           //是否立即运行，一般为true 就好了
            success: function (res) {
                //渲染数据，这里使用了 handlebars 作为模板引擎，你也可以使用其他模板引擎
                //没听说过 handlebars？ 请移步这里 http://handlebarsjs.com/
                var source = $("#j-tmpl").html();
                var template = Handlebars.compile(source);
                $("#tbody").html(template(res.result));
            }
        });
    });
###服务器端返回数据格式（result）
***
#####对于服务器端返回的json数据，是有格式要求的，当然你也可以自己编辑插件中的一些参数，让他符合你的后台数据格式：

    //json data
    {
	"error_code":0     //错误码 0表示成功
	"reason":"success",  //原因说明
	"result":{
		"list":[  //数据集合
			 {
			 "firstImg":"http://zxpic.gtimg.com/infonew/0/wechat_pics_-6809915.jpg/640",
			 "id":"wechat_20160718030028",
			 "source":"大叔爱吐槽",
			 "title":"在女友的抽屉里发现了这个...该怎么办？",
			 "url":"http://v.juhe.cn/weixin/redirect?wid=wechat_20160718030028",
			 "mark":""
			 },
			 {
			 "firstImg":"http://zxpic.gtimg.com/infonew/0/wechat_pics_-6809915.jpg/640",
			 "id":"wechat_20160718030028",
			 "source":"大叔爱吐槽",
			 "title":"在女友的抽屉里发现了这个...该怎么办？",
			 "url":"http://v.juhe.cn/weixin/redirect?wid=wechat_20160718030028",
			 "mark":""
			 },
			 //... 更多的数据	
			],
		"totalPage":50,  //总页数
		"ps":10,  //当前页大小
		"pno":2   //当前页码
		}
	}


###代码示例（demo）
***
* 首先，请下载这个项目，这是一个 node.js项目，因为分页插件需要后台返回数据。要运行这个项目，你需要先安装node.js，
* 这个示例项目使用 node.js + express 4 + hbs 等关键技术
* 请运行项目中的 bin/www 文件启动项目，然后访问 http://localhost:3000/demo 访问示例代码

###鸣谢（Thanks）
***
* 感谢 网友谢亮的分享，基于 page.js添加了一些更符合实际业务的功能，http://www.jq-school.com/Detail.aspx?id=267
* 感谢聚合数据提供的免费数据接口支持 https://www.juhe.cn/