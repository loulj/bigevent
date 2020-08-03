$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate()
    // 初始化富文本编辑器
    initEditor()

    //定义加载文章分类方法
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章列表失败')
                }
                //调用模板引擎
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()



    })
    //监听coverFile的change事件
    $('#coverFile').on('change', function (e) {
        //获取文件列表数组
        var files = e.target.files[0]
        //非空校验
        if (files === 0) return

        var newImgURL = URL.createObjectURL(files)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    //定义文章状态
    var art_state = "已发布"

    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 有助理解   本文直接设置默认值,点击则变成另一个
    // var art_state = ""
    // $('button').eq(0).click(function(){
    //     art_state='已发布'
    // })
    // $('button').eq(1).click(function(){
    //     art_state='草稿'
    // })


    //为表单绑定submit   两个button都会触发submit事件,但是文档中的state值必须传入 确认这个是草稿还是发布状态
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])
        // 将文章状态存入
        fd.append('state', art_state)
        
        // console.log(...fd);
        // fd.forEach(function(v,k){
        //     console.log(k,v);
        // })

        //将封面裁剪后的图片输出为图片文件  
        // base64图片转换是字符串,,  这里toBlob是二进制
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                //将文件对象存储到fd中
                fd.append('cover_img',blob)

                // console.log(fd);
                // console.log(...fd);
                //数据都准备好了,发起请求
                publishArticle(fd)
                
            })
    })

    //定义一个发布文章方法
    function publishArticle(fd){
        $.ajax({
            type:'post',
            url:'/my/article/add',
            data:fd,
            //注意 如果向服务器提交的是FormData数据,必须添加一下两个配置项
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status!==0){
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                // window.parent.document.getElementById('a2').click()

                window.parent.document.getElementById('a2').className='layui-this'
                window.parent.document.getElementById('a3').className=''

                location.href='/article/art_list.html'
            }
        })
    }
})