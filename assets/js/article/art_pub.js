$(function () {
  var layer = layui.layer;
  var form = layui.form;

  initCate();

  // 初始化富文本编辑器
  initEditor();

  initCropper();

  // 获取文章分类数据
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("初始化文章分类失败！");
        }
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 一定要记得调用 form.render() 方法。
        form.render();
      },
    });
  }

  // 初始化裁剪器
  function initCropper() {
    // 1 获取裁剪区域的 DOM 元素。
    var $image = $("#image");
    // 2 配置选项。
    const options = {
      // 纵横比
      aspectRatio: 400 / 280,
      // 指定预览区域
      preview: ".img-preview",
    };
    // 3 创建裁剪区域。
    $image.cropper(options);
  }

  // 为选择封面按钮绑定点击事件
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });

  // 监听 coverFile 的 change 事件，获取用户选择的文件列表。
  $("#coverFile").on("change", function (e) {
    var files = e.target.files;
    if (files.length === 0) {
      return;
    }
    var newImgURL = URL.createObjectURL(files[0]);
    // 重新初始化裁剪区域。
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  // 定义文章的发布状态
  var art_state = "已发布";
  // 为存为草稿按钮，绑定点击事件处理函数。
  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });

  // 文章发布和存为草稿的提交
  $("#form-pub").on("submit", function (e) {
    e.preventDefault();
    //基于 form 表单，快速创建一个 FormData 对象。
    var fd = new FormData($(this)[0]);
    fd.append("state", art_state);
    // 将封面裁剪过后的图片，输出为一个文件对象。
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象，得到文件对象后，进行后续的操作。
        // 将文件对象，存储到 fd 中。
        fd.append("cover_img", blob);
        // 发起 ajax 数据请求。
        publishArticle(fd);
      });
  });

  // 定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，必须添加以下两个配置项。
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("发布文章失败！");
        }
        layer.msg("发布文章成功！");
        // 发布文章成功后，跳转到文章列表页面。
        location.href = "/article/art_list.html";
      },
    });
  }
});
