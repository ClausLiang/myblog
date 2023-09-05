document.addEventListener("DOMContentLoaded", function () {
  // 获取所有的标题元素
  var headings = document.querySelectorAll(".post-content h1, .post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6");
  // 初始化计数器
  var counter = [0, 0, 0, 0, 0, 0];
  
  // 遍历每个标题元素
  headings.forEach(function (heading) {
      // 获取标题级别
      var level = parseInt(heading.tagName.charAt(1)) - 1;
      
      // 增加计数器
      counter[level]++;
      
      // 重置子级计数器
      for (var i = level + 1; i < 6; i++) {
          counter[i] = 0;
      }
      
      // 为标题添加序号
      var numbering = counter.slice(0, level + 1).join(".");
      heading.innerHTML = "<span style='color: green'>"+numbering + ".</span> " + heading.innerHTML;
  });
});
