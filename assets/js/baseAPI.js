$.ajaxPrefilter(function (options) {
    //在发起真正的ajax请求之前,统一拼接请求根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    //统一为有权限的接口,设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //全局统一挂在complete回调函数
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token')
            // 强制跳转回登录界面
            location.href = '/login.html'
        }
    }
})