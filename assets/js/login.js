$(function(){
    //点击""去注册账号"连接
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //点击""去登录"连接
    $('#link_login').on('click',function(){
        
        $('.reg-box').hide()
        $('.login-box').show()
    })

    //从layui中获取form对象
    var form = layui.form

    //通过form.verify()函数自定义校验规则
    form.verify({
        //自定义叫做pwd校验规则
        pwd:[/^[\S]{6,12}$/
        ,'密码必须6到12位，且不能出现空格'],
        repwd:function(value){
            var pwd = $('.reg-box [name=password]').val()
            if(pwd !== value) return '两次密码不一致'
        }
    })
    //监听注册事件
    var layer = layui.layer
    $('#form_reg').on('submit',function(e){
        e.preventDefault()
        $.post('/api/reguser',{username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()},function(res){
            if(res.status!==0){
                return layer.msg(res.message);
            }
            layer.msg('注册成功');
            $('#link_login').click()
        }) 
    })

    //监听登录事件
    $('#form_login').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            url:'/api/login',
            type:'post',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                localStorage.setItem('token',res.token)
                location.href='/index.html'
                
            }
        })
    })
})