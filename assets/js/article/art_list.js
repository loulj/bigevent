$(function () {

    //定义一个查询参数对象,将来请求数据的时候
    //需要将请求参数  定义全局 储存分页参数

    var q = {
        pagenum: 1,  //页码值,默认请求第一页数据
        pagesize: 2, //默认每页显示2条
        cate_id: '', //文章分类id
        state: ''    //文章发布状态
    }
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //自动补0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initTable()
    initCate()


    //获取文章列表数据方法
    function initTable() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('文章获取失败')
                }
                layer.msg('文章获取成功')
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res)

                $('tbody').html(htmlStr)

                //调用渲染分页  传入总页码数(可以观察res数据)
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类方法
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')

                }
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                //先删除,发现下拉框并未渲染,因为select option下拉框组合 在html中实际是dd标签
                //需要再次渲染   layui.form提供了 一些表单渲染的方法 
                form.render()
            }
        })
    }
    // 为筛选表单
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        //获取当前下拉框选择状态
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        q.pagenum = 1
        initTable()
    })

    //定义渲染分页方法
    function renderPage(total) {
        // console.log(total);
        //执行一个laypage实例 实现分页结构 
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号 
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页几条数据  为了不固定死  需要在对象中设置参数. 以后统一改对象即可
            curr: q.pagenum, //默认第几页被选中
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {  //第二个参数 是bool值 第一次执行是true  通过2触发jump是undefined
                // console.log(obj.curr);
                // console.log(obj.limit);
                // 把最新的页码值赋值给q
                q.pagenum = obj.curr
                q.pagesize = obj.limit //p配合limits使用
                //根据最新的q获取  然后重新渲染  但会死循环 可以log curr观察
                //死循环原因 : 1.点击页码时候会触发jump 然后在jump中又执行了第2步骤导致无线循环     2.页面一进入 调用render方法也会执行(这个原因)
                //  解决根本,分辨到底是否触发点击事件,在确认执行步骤2的渲染是否执行  first参数 解决
                // console.log(first);
                // 如果是点击页码触发,则 !undefined 即为true 执行渲染     如果是自动渲染的 则不执行  阻止了死循环进行
                if (!first) {
                    initTable()
                }

            },
        });
    }

    //删除功能
    $('body').on('click', '.btn-delete', function () {
        
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    //删除数据完后，当前这一页是否还有剩于数据，如果没有 页码值减一
                    // if(len===1){
                    //     //如果len的值等于1,证明已经删除完毕
                    //     q.pagenum = q.pagenum===1?1:q.pagenum-1
                    // }
                    // if (len === 1 && q.pagenum > 1) {
                    //     //如果len的值等于1,证明已经删除完毕
                    //     q.pagenum = q.pagenum - 1
                    // }
                    len === 1 && q.pagenum > 1 && --q.pagenum
                    //重新加载页面
                    initTable()

                }
            })
            layer.close(index);
        });

    })
})