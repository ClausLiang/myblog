---
title: 了解拖拽的原理
date: 2024-01-04 09:14:23
updated: 2024-01-04
tags: h5
categories: h5
---
<script type="text/javascript" src="/myblog/custom.js"></script>

# 拖拽的实现核心有4点
## 给需要拖拽的元素加上`draggable=true`属性
## 给需要拖拽的元素设置`ondragstart`的事件处理函数
可以通过句柄`e`中以`key,value`存储我们想要存储的数据
`e.dataTransfer.setData('device', device)`
## 给放置容器设置`ondrop`放手事件处理函数
可以通过句柄`e`获取我们之前存储的数据
## 给放置容器设置`ondragover`事件
dragover事件的默认行为是：“Reset the current drag operation to "none"”。也就是说，如果不阻止放置元素的 dragOver 事件，则放置元素不会响应“拖动元素”的“放置行为”。

# drag和drop
HTML 的 drag & drop 使用了“DOM Event”和从“Mouse Event”继承而来的“drag event” 。
一个典型的拖拽操作： 用户选中一个可拖拽的（draggable）元素，并将其拖拽（鼠标按住不放）至一个可放置的（droppable）元素上，然后松开鼠标。
在拖动元素期间，一些与拖放相关的事件会被触发，像 drag 和 dragover 类型的事件会被频繁触发。
除了定义拖拽事件类型，每个事件类型还赋予了对应的事件处理器

| 事件类型 | 事件处理器 | 触发时机 | 绑定元素 |
|:-:|:-:|:-:|:-:|
| dragstart | ondragstart | 当开始拖动一个元素时 | 拖拽|
|drag	|ondrag	|当元素被拖动期间按一定频率触发|	拖拽|
|dragend|	ondragend|	当拖动的元素被释放（🖱️松开、按键盘 ESC）时	|拖拽|
|dragenter|	ondragenter|	当拖动元素到一个可释放目标元素时|	放置|
|dragexit|	ondragexit|	当元素变得不再是拖动操作的选中目标时|	放置|
|dragleave|	ondragleave|	当拖动元素离开一个可释放目标元素|	放置|
|dragover|	ondragover|	当元素被拖到一个可释放目标元素上时（100 ms/次）|	放置|
|drop|	ondrop|	当拖动元素在可释放目标元素上释放时	|放置|

各个事件的时机可以用下面这个图简单表示：
![img](/images/drag-2024-1-4.png)
# DataTransfer
在上述的事件类型中，不难发现，放置元素和拖动元素分别绑定了自己的事件，可如何将拖拽元素和放置元素建立联系以及传递数据？
这就涉及到 DataTransfer 对象：
> DataTransfer 对象用于保存拖动并放下（drag and drop）过程中的数据。它可以保存一项或多项数据，这些数据项可以是一种或者多种数据类型。

# 代码
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body {
      display: flex;
    }

    .box1,
    .box2 {
      width: 300px;
      height: 600px;
      border: 1px solid #ccc;
    }

    .box2 {
      margin-left: 50px;
    }

    .item {
      width: 100px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: skyblue;
      margin-top: 10px;
      margin-left: 10px;
    }
  </style>
</head>

<body>
  <div class="box1">
    <div class="item" draggable="true" ondragstart="dragStart(event,'手机')">
      手机
    </div>
    <div class="item" draggable="true" ondragstart="dragStart(event,'电脑')">
      电脑
    </div>
    <div class="item" draggable="true" ondragstart="dragStart(event,'耳机')">
      耳机
    </div>
  </div>
  <div class="box2" ondrop="dropEnd(event)" ondragover="dragOver(event)"></div>
</body>
<script>
  const box2 = document.querySelector('.box2')
  function dragStart(e, device) {
    e.dataTransfer.setData('device', device)
  }
  function dropEnd(e) {
    var transferredDevice = e.dataTransfer.getData('device')
    const div = document.createElement('div')
    div.textContent = transferredDevice
    div.classList.add('item')
    box2.appendChild(div)
  }
  function dragOver(e) {
    e.preventDefault()
  }
</script>

</html>
```
效果地址：https://clausliang.github.io/claus/drag/index.html

以上是拖拽的原理，如果用在项目中，可以用插件draggable.js，vue3-dnd，react-dnd等
参考：
https://juejin.cn/post/7069588012912361509

