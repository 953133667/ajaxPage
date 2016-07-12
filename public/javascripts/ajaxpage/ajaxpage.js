/*
 # by xl;
 # www.xuexb.com;
 # jquery;
 # 修改自柯德华
 # ajax分页插件，基于 page.js，感谢原作者 网友谢亮
 */
;(function ($) {
    var ajaxPage = function (options) {
        var options = $.extend({
            type: "get",
            page: 1,		//当前页
            pageSize: 10,		//每页多少个
            url: null, //后端 url, {page} 为当前页, 可以为伪静态如:  xl_{page}.html
            run: false,	//是否开始加载
            /*			beforeSend		: true,	//请求前调用
             complete		: true,	//请求后调用*/
            pageId: null, 	//分页容器
            noData: "\u6CA1\u6709\u627E\u5230",	//没有数据时提示
            //content			: null,		//处理内容的循环,如 function () { return [list]标签是:{title},内容:{content}[/list] }
            success: null,     //成功时的回调函数
            data: {},		//传递到后台的数据
            global: true,		//是否触发全局的ajax事件
            /*
             以上为对外接口;
             return obj.run();//运行
             return obj.get(i);//跳页
             */
            pageCount: null,		//总页
            recordCount: null,		//总条数
            isLoad: false,	//是否加载过
            mark: true		//请求开关, true可请求, false不可
        }, options || {});

        var self = this;

        if (!self.length || !options.url) {
            return self
        }
        var ajaxPage = {};

        ajaxPage.r = function (tmplobj, opt) {
            //使用 模板技术生成HTML  obj代表的是 HTML模板数据，opt代表的是json数据
            var htmlstr = tmplobj.tmpl(opt);

            //console.log(htmlstr);
            return htmlstr;
        }

        ajaxPage.run = function () {
            if (options.isLoad) {
                return self;
            }
            options.isLoad = true;
            ajaxPage.ajax();
            return self;
        }

        ajaxPage.ajax = function () {
            if (!options.isLoad) {
                return self;
            }
            options.mark = false;
            //更新 pageSize pageNo的值
            options.data.page = options.page;
            options.data.pagesize = options.pageSize;

            //console.log(c.data);

            $.ajax({
                //global: c.global,
                global: false,
                url: options.url,
                beforeSend: options.beforeSend,
                complete: options.complete,
                data: options.data,
                type: options.type,
                success: function (res) {
                    console.log(res);
                    if (res.error_code === 0) {
                        //如果查询信息成功
                        var pageCount = res.result.totalPage;
                        var recordCount = pageCount * res.result.ps;
                        options.pageCount = pageCount;   //一共多少页
                        options.recordCount = recordCount;    //一共多少条数据
                        options.pageSize = res.result.ps;    //当前页大小

                        //执行callback
                        options.success(res);
                    } else {
                        options.pageCount = 0;
                        options.recordCount = 0;
                        self.html(options.noData);
                    }
                    if (options.pageId.length) {
                        ajaxPage.toPage();
                        ajaxPage.toPageBind();
                    }
                    options.mark = true;

                }
            });
        }

        ajaxPage.get = function (i) {
            if (!options.isLoad || !options.mark || options.pageCount < 1) {
                return ajaxPage;
            }
            switch (i) {
                case "pre":
                    options.page--;
                    break;
                case "next":
                    options.page++;
                    break;
                case "first":
                    options.page = 1;
                    break;
                case "last":
                    options.page = options.pageCount;
                    break;
                default :
                    if (isNaN(i)) {
                        break;
                    }
                    i = parseInt(i);
                    if (i > options.pageCount) {
                        i = options.pageCount;
                    }
                    if (i == options.page) {
                        return false
                    }
                    ;

                    options.page = i;
                    break;
            }
            ajaxPage.ajax();
            return self;
        }

        ajaxPage.toPageBind = function () {
            var pId = options.pageId;
            pId.find("a.a_pre").click(function () {
                ajaxPage.get("pre");
            });
            pId.find("a.a_next").click(function () {
                ajaxPage.get("next");
            });
            pId.find("a.a_first").click(function () {
                ajaxPage.get("first");
            });
            pId.find("a.a_last").click(function () {
                ajaxPage.get("last");
            });
            pId.find("a.a_href").click(function () {
                ajaxPage.get($(this).attr("data-i"));
            });
            pId.find('input.a_text').keydown(function (e) {
                if (e.keyCode === 13) {
                    ajaxPage.get($.trim($(this).val()));
                }
                ;
            });
            pId.find("input.a_button").click(function () {
                ajaxPage.get($.trim(pId.find('input.a_text').val()));
            });
        }

        ajaxPage.toPage = function () {
            var str = "";
            if (options.recordCount > options.pageSize) {//如果总共页大小每页多少条则,否则不出现分页码
                var page = options.page * 1,
                    pageSize = options.pageSize * 1,
                    i = 1,
                    pageCount = options.pageCount;

                if (page > 1) {
                    str += "<a href=\"javascript:;\" class=\"a_pre\">&lt; \u4E0A\u4E00\u9875</a>";
                } else {
                    str += "<span class=\"disable\">&lt; \u4E0A\u4E00\u9875</span>";
                }
                ;

                if (pageCount < 7) {
                    for (i; i <= pageCount; i++) {
                        if (page === i) {
                            str += "<span class=\"on\">" + i + "</span>";
                        } else {
                            str += "<a href=\"javascript:;\" class=\"a_href\" data-i=\"" + i + "\">" + i + "</a>";
                        }
                    }
                } else {
                    var start, end;
                    if (page === 1) {
                        str += "<span class=\"on\">1</span>";
                    } else {
                        str += "<a href=\"javascript:;\" class=\"a_first\">1</a>";
                    }
                    ;
                    if (page > 5) {
                        str += "<span class=\"dot\">...</span>";
                    }
                    ;
                    if (page < 6) {
                        start = 1;
                    } else {
                        start = page - 3;
                    }
                    ;

                    if (page > (pageCount - 5)) {
                        end = pageCount;
                    } else {
                        end = page + 4;
                    }
                    ;
                    for (var i2 = start; i2 < end; i2++) {
                        if (i2 !== 1 && i2 !== pageCount) {//避免重复输出1和最后一页
                            if (i2 === page) {
                                str += "<span class=\"on\">" + i2 + "</span>";
                            } else {
                                str += "<a href=\"javascript:;\" class=\"a_href\" data-i=\"" + i2 + "\">" + i2 + "</a>";
                            }
                        }
                    }
                    ;
                    if (page < (pageCount - 5)) {
                        str += "<span class=\"dot\">...</span>";
                    }
                    ;
                    if (page === pageCount) {
                        str += "<span class=\"on\">" + pageCount + "</span>";
                    } else {
                        str += "<a href=\"javascript:;\" class=\"a_last\">" + pageCount + "</a>";
                    }
                    ;
                }
                ;

                if (page >= pageCount) {
                    str += "<span class=\"disable\">\u4E0B\u4E00\u9875 &gt;</span>";
                } else {
                    str += "<a href=\"javascript:;\" class=\"a_next\">\u4E0B\u4E00\u9875 &gt;</a>";
                }
                ;
                str += '<span class="href"><label for="pageText">\u5230\u7B2C</label><input autocomplete="off" type="text" class="a_text" value="' + page + '"><label for="pageText">\u9875</label><input type="button" value="确定" class="a_button"></span>';
            }
            ;

            options.pageId.html(str);
            return ajaxPage;
        }

        //对外暴露接口
        self.run = ajaxPage.run;
        self.get = ajaxPage.get;
        if (options.run) {
            self.run();
        }
        return self;
    }
    $.fn.extend({ajaxPage: ajaxPage});
})(jQuery);
