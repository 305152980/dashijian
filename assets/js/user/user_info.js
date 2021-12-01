$(function () {
  var form = layui.form;
  var layer = layui.layer;

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称长度必须在 1 ~ 6 个字符之间！";
      }
    },
  });

  initUserInfo();

  // 用户信息的初始化
  function initUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败！");
        }
        // 调用 form.val() 快速为表单赋值。
        form.val("formUserInfo", res.data);
      },
    });
  }

  // 用户信息的重置
  $("#btnReset").on("click", function (e) {
    e.preventDefault();
    initUserInfo();
  });

  // 用户信息的提交
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新用户信息失败！");
        }
        layer.msg("更新用户信息成功！");
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息。
        window.parent.getUserInfo();
      },
    });
  });
});
