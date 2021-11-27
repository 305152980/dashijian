$(function() {
    getUserInfo()
    logOut()
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            renderAvatar(res.data)
        }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1. 获取用户的名称。
    var name = user.nickname || user.username
        // 2. 设置欢迎的文本。
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 3. 按需渲染用户的头像。
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic)
    } else {
        $('.layui-nav-img').attr('src', '/assets/images/logo.png')
    }
}

// 点击按钮，实现退出功能。
function logOut() {
    // 从 layui 中获取 layer 对象。
    var layer = layui.layer
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 1、清空本地存储中的 token 字符串。
            localStorage.removeItem('token')
                // 2、重新跳转到登录页面。
            location.href = '/login.html'
                // 3、关闭 confirm 询问框。
            layer.close(index)
        })
    })
}