/*
 # By 柯德华;
 # Date 2015.6;
 # ajax分页插件，
 # 基于 page.js添加了一些更符合实际业务的功能，感谢 网友谢亮的分享 http://www.jq-school.com/Detail.aspx?id=267
 */
;(function ($) {
    var ajaxPage = function (options) {
        var options = $.extend({
            type: "get",
            page: 1,		//当前页
            pageSize: 10,		//每页多少个
            url: null, //后端 url, {page} 为当前页, 可以为伪静态如:  xl_{page}.html
            run: false,	//是否开始加载
            pageList:[10,20],  //每页多少条数据 数组
            toView:{},
            /*			beforeSend		: true,	//请求前调用
             complete		: true,	//请求后调用*/
            pageId: null, 	//分页容器
            noData: "暂时没有符合条件的数据",	//没有数据时提示
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

/*        ajaxPage.r = function (tmplobj, opt) {
            //使用 模板技术生成HTML  obj代表的是 HTML模板数据，opt代表的是json数据
            var htmlstr = tmplobj.tmpl(opt);

            //console.log(htmlstr);
            return htmlstr;
        }*/

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
            options.data.pno = options.page;
            options.data.ps = options.pageSize;

            //console.log(c.data);

            $.ajax({
                url: options.url,
                beforeSend: options.beforeSend,
                complete: options.complete,
                data: options.data,
                type: options.type,
                success: function (res) {
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

        /**
         *
         * @param runCase
         * @returns {*}
         */
        ajaxPage.get = function (runCase) {
            if (!options.isLoad || !options.mark || options.pageCount < 1) {
                return ajaxPage;
            }
            //运行方案名称
            var caseName = runCase.name;

            switch (caseName) {
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
                case "resize":
                    //重置 pageSize
                    options.pageSize = runCase.data;
                    break;
                case "topage":
                    //跳转到某一页
                    if(isNaN(runCase.data)){
                        break;
                    }
                    var page = parseInt(runCase.data);
                    options.page = page;
                    break;
            }
            ajaxPage.ajax();
            return self;
        }

        ajaxPage.toPageBind = function () {
            var pId = options.pageId;
            pId.find("a.a_pre").click(function () {
                ajaxPage.get({
                    "name":"pre"
                });
            });
            pId.find("a.a_next").click(function () {
                ajaxPage.get({
                    "name":"next"
                });
            });
            pId.find("a.a_first").click(function () {
                ajaxPage.get({
                    "name":"first"
                });
            });
            pId.find("a.a_last").click(function () {
                ajaxPage.get({
                    "name":"last"
                });
            });
            pId.find("a.a_href").click(function () {
                var data = $(this).attr("data-i");
                ajaxPage.get({
                    "name":"topage",
                    "data":data
                });
            });
            pId.find('input.a_text').keydown(function (e) {
                if (e.keyCode === 13) {
                    ajaxPage.get({
                        "name":"topage",
                        "data":$.trim($(this).val())
                    });
                }
            });
            pId.find("input.a_button").click(function () {
                ajaxPage.get({
                    "name":"topage",
                    "data":$.trim(pId.find('input.a_text').val())
                });
            });

            //为底部pagesize  下拉菜单绑定事件
            pId.find("#j-page-list").on("change",function () {
                ajaxPage.get({
                    "name":"resize",
                    "data":$.trim($(this).val())
                });
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

                    if (page > 5) {
                        str += "<span class=\"dot\">...</span>";
                    }

                    if (page < 6) {
                        start = 1;
                    } else {
                        start = page - 3;
                    }

                    if (page > (pageCount - 5)) {
                        end = pageCount;
                    } else {
                        end = page + 4;
                    }

                    for (var i2 = start; i2 < end; i2++) {
                        if (i2 !== 1 && i2 !== pageCount) {//避免重复输出1和最后一页
                            if (i2 === page) {
                                str += "<span class=\"on\">" + i2 + "</span>";
                            } else {
                                str += "<a href=\"javascript:;\" class=\"a_href\" data-i=\"" + i2 + "\">" + i2 + "</a>";
                            }
                        }
                    }

                    if (page < (pageCount - 5)) {
                        str += "<span class=\"dot\">...</span>";
                    }

                    if (page === pageCount) {
                        str += "<span class=\"on\">" + pageCount + "</span>";
                    } else {
                        str += "<a href=\"javascript:;\" class=\"a_last\">" + pageCount + "</a>";
                    }

                }


                if (page >= pageCount) {
                    str += "<span class=\"disable\">\u4E0B\u4E00\u9875 &gt;</span>";
                } else {
                    str += "<a href=\"javascript:;\" class=\"a_next\">\u4E0B\u4E00\u9875 &gt;</a>";
                }
                ;
                str += '<span class="href"><label for="pageText">\u5230\u7B2C</label><input autocomplete="off" type="text" class="a_text" value="' + page + '"><label for="pageText">\u9875</label><input type="button" value="确定" class="a_button"></span>';

                //左侧的菜单pageSize 控制菜单
                str += ajaxPage.getHTMLByPageList();
;
            }

            options.pageId.html(str);
            return ajaxPage;
        }

        ajaxPage.getHTMLByPageList = function () {
            var pId = options.pageId;

            console.log(pId);
            console.log(options);
            var pageList = options.pageList,
                selectStr = '<select class="ui-page-size" name="ps" id="j-page-list"></select>'; //一个空的 select

            //如果是一个数组，才进行处理
            if($.isArray(pageList) && pageList.length > 0){
                //拼接一个select 元素的所有 option
                var optionsStr = "",
                    isPushPageSize = true;  //是否加上 pageSize
                for (var len = pageList.length, i = 0; i < len; i++) {

                    var isSelected = "";  // 用来拼接 select 的字符串，默认是 空字符，就是不选中 select
                    if(options.pageSize == pageList[i]){
                        isSelected = "selected";
                        isPushPageSize = false;
                    }

                    optionsStr += "<option value=" + pageList[i] + " " +isSelected+">" + pageList[i] + "</option>";
                }

                if(isPushPageSize){
                    optionsStr = "<option value=" + options.pageSize + " selected>" + options.pageSize + "</option>" + optionsStr;
                }

                //组合 html
                var htmls = '<div class="ui-page-list-wrap">' +
                    '<label for="j-page-list">每页</label>' +
                    '<select class="ui-page-list" name="ps" id="j-page-list">' +
                    optionsStr +
                    '</select>' +
                    '<label for="j-page-list">条</label>' +
                    '</div>';

                return htmls;
            }

            return "";
        }

        /**
         * 描述：让当前元素到屏幕中间，这里之所以这么设计，是为了让外部在多种条件下，都可以返回顶部
         */
        $.fn.goView = function (options) {
            var options = $.extend({
                "offsetY": -40, //当前元素 Y 轴偏移多少
                "speed": 800
            },options || {});

            var $this = $(this);

            var scrollTo = $this.offset().top + options.offsetY;

            $("html,body").animate({"scrollTop":scrollTo},options.speed);
        }

        /**
         * 名称：生成pageList
         * 描述：通过pageList 参数生成HTML
         */
        /*ajaxPage.getHTMLByPageList = function () {
            console.log(options);
            var pageList = options.pageList,
                selectStr = '<select class="ui-page-size" name="ps" id="j-page-list"></select>'; //一个空的 select

            //如果是一个数组，才进行处理
            if($.isArray(pageList) && pageList.length > 0){
                //拼接一个select 元素的所有 option
                var options = "",
                    isPushPageSize = true;  //是否加上 pageSize
                for (var len = pageList.length, i = 0; i < len; i++) {

                    var isSelected = "";  // 用来拼接 select 的字符串，默认是 空字符，就是不选中 select
                    if(options.pageSize == pageList[i]){
                        isSelected = "selected";
                        isPushPageSize = false;
                    }

                    options += "<option value=" + pageList[i] + " +isSelected+>" + pageList[i] + "</option>";
                }

                if(isPushPageSize){
                    options += "<option value=" + pageList[i] + " selected>" + pageList[i] + "</option>";
                }

                //组合 select
                return $(selectStr).html(options).toString();
            }

            return "";
        }*/

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
