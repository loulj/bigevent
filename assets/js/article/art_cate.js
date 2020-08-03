$(function () {
    var layer = layui.layer
    var form = layui.form
    // 1. 文章分类列表渲染
    initArtCateList()

    // 2.添加文章分类  显示弹框
    // 为添加类别按钮添加绑定点击事件
    var indexAdd = null   //为layer.open后续赋值,看文档
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })
    // 3.添加文章分类  确认添加
    // 通过代理的形式,为form-add表单绑定事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCateList()
                layer.msg('新增分类成功')
                //根据索引关闭弹出层
                layer.close(indexAdd)
            }
        })
    })


    // 通过代理形式为form-edit绑定事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function (e) {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        //发起请求获取对应分类的数据
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    //
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })
    //通过代理,为删除按钮
    $('body').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        //询问框 询问是否要删除,确认删除  再执行ajax代码请求
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type:'get',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index)
                    initArtCateList()
                }
            })

            layer.close(index);
        });
    })
    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {

                // 传递对象,使用的时候用里面的data
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }


})