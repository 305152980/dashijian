$(function () {
  var layer = layui.layer;
  var form = layui.form;

  initArtCateList();

  // 获取文章分类列表
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章分类列表失败！");
        }
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
      },
    });
  }

  // 添加文章分类信息
  var indexAdd = null;
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });

  // 添加文章分类信息的提交
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("新增分类失败！");
        }
        initArtCateList();
        layer.msg("新增分类成功！");
        // 根据索引，关闭对应的弹出层。
        layer.close(indexAdd);
      },
    });
  });

  // 编辑文章分类信息按钮的点击
  var indexEdit = null;
  $("tbody").on("click", ".btn-edit", function () {
    var id = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取分类信息失败！");
        }
        indexEdit = layer.open({
          type: 1,
          area: ["500px", "250px"],
          title: "编辑文章分类",
          content: $("#dialog-edit").html(),
        });
        // 渲染编辑弹出层的数据。
        form.val("form-edit", res.data);
      },
    });
  });

  // 编辑添加文章分类信息的提交
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新分类数据失败！");
        }
        layer.msg("更新分类数据成功！");
        layer.close(indexEdit);
        initArtCateList();
      },
    });
  });

  // 删除文章分类信息
  $("tbody").on("click", ".btn-delete", function () {
    var id = $(this).attr("data-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除分类失败！");
          }
          layer.msg("删除分类成功！");
          layer.close(index);
          initArtCateList();
        },
      });
    });
  });
});
