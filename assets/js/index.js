$(function () {
    //
    getUserInfo()

    var layer = layui.layer
    //点击按钮实现退出
    $('#btnLogout').on('click', function () {

        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //1.清空本地存储中的token
            localStorage.removeItem('token')
            //2.重新跳转到登录页面
            location.href = '/login.html'

            //关闭confirm询问框
            layer.close(index);
        });
    })
})

function getUserInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',

        success: function (res) {
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败')

            renderAvatar(res.data)
        }
        // //不论成功还是失败,最终都会调用complete函数
        // complete: function (res) {

        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空token
        //         localStorage.removeItem('token')
        //         // 强制跳转回登录界面
        //         location.href = '/login.html'
        //     }
        // }

    }


    )
}

function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}