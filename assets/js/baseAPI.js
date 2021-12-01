// 注意：每次调用 $.get()、$.post() 或 $.ajax() 的时候，都会先调用 ajaxPrefilter 函数。
// 在这个函数中，可以拿到我们给 Ajax 提供的配置对象。
$.ajaxPrefilter(function (options) {
  // 在发起 Ajax 请求之前，统一拼接请求的根路径。
  // options.url = 'http://ajax.frontend.itheima.net' + options.url
  options.url = "http://api-breakingnews-web.itheima.net" + options.url;

  // 在发起 Ajax 请求之前，统一为有权限的接口设置 headers 请求头。
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }

  // 全局统一挂载 complete 回调函数。
  // 无论接口调用成功还是失败，最终都会调用 complete 回调函数。
  if (options.url.indexOf("/my/") !== -1) {
    // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据。
    options.complete = function (res) {
      if (
        res.responseJSON.status === 1 &&
        res.responseJSON.message === "身份认证失败！"
      ) {
        // 1. 清空本地存储中的 token 字符串。
        localStorage.removeItem("token");
        // 2. 强制跳转到登录页面。
        location.href = "/login.html";
      }
    };
  }
});
