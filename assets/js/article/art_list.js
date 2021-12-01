$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;

  // 定义时间的过滤器。
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);
    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());
    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());
    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 定义时间补零函数。
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  // 定义 queryParams 查询参数对象。
  var queryParams = {
    pagenum: 1,
    pagesize: 2,
    cate_id: "",
    state: "", // 文章的发布状态
  };

  initCate();

  initTable();

  // 初始化文章分类。
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取分类数据失败！");
        }
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 通过 layui 重新渲染文章分类选择框的 UI 结构。
        form.render();
      },
    });
  }

  // 获取文章列表。
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: queryParams,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败！");
        }
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        renderPage(res.total);
      },
    });
  }

  // 渲染文章列表的分页条。
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构。
    laypage.render({
      elem: "pageBox", // 分页容器的 id
      count: total,
      limit: queryParams.pagesize,
      curr: queryParams.pagenum,
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      // 分页发生切换时候，触发 jump 回调函数。
      // 触发 jump 回调的方式有两种：
      //    1. 鼠标点击触发 jump 回调函数；
      //    2. 调用 laypage.render() 方法触发 jump 回调函数。
      // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调函数。
      // first ? 方式 2 触发 : 方式 1 触发;
      jump: function (obj, first) {
        queryParams.pagenum = obj.curr;
        queryParams.pagesize = obj.limit;
        // 先进行 if 判断，防止出现死循环的 bug。
        if (!first) {
          initTable();
        }
      },
    });
  }

  // 文章列表的条件查询。
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();
    queryParams.cate_id = cate_id;
    queryParams.state = state;
    initTable();
  });

  // 删除文章信息。
  $("tbody").on("click", ".btn-delete", function () {
    var id = $(this).attr("data-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除文章失败！");
          }
          layer.msg("删除文章成功！");
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据，
          // 如果没有剩余的数据了，则让页码值 -1 之后,
          // 再重新调用 initTable 方法。
          if ($(".btn-delete").length === 1) {
            // 页码值最小必须是 1。
            queryParams.pagenum =
              queryParams.pagenum === 1 ? 1 : queryParams.pagenum - 1;
          }
          initTable();
        },
      });
      layer.close(index);
    });
  });
});
