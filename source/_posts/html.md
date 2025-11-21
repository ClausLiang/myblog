---
title: html基础入门（整理笔记）
date: 2025-07-15 16:54:44
updated: 2025-07-29
tags: h5
categories: 基础
---
<script type="text/javascript" src="/myblog/custom.js"></script>

# h5的结构
略
# 导入样式表的方式
## 外部链接
```html
<link rel="stylesheet" href="css/style.css">
```
href位置
ref样式表风格
type文档类型（可省）
特点：加载速度快，结构与样式同时加载
## 外部导入样式表
```html
<style>
  @import "css/style.css";
</style>
```
特点：加载速度慢，先加载结构再加载样式
## 内嵌样式表
```html
<style>
  body {}
  h1 {}
</style>
```
特点：没有真正实现结构与样式的分离
## 行内样式表
```html
<h1 style="color: red;">标题</h1>
```
特点：有局限性

优先级：行内样式表 > 内嵌样式表 > 外部导入样式表 > 外部链接

# W3C
(world wide web consortium)万维网联盟 
创建于1994年，是web技术领域最具权威和影响的国际中立性技术标准机构。主要工作是制定适用于网络的技术标准。除了制定标准之外，w3c还提供标准方面的资讯，标准的更新，辅助代码验证工具等服务。 
W3c标准不是一个标准，而是一系列标准的集合。其中包括：HTML，XHTML，JavaScript，css等。

# css选择器
## 种类
1. 全局选择器
2. 标签选择器
3. 类选择器
4. id选择器
5. 伪类选择器
6. 群组选择器 div,p,a{}（逗号隔开）
7. 包含选择器 div p{} （空格隔开）
8. 子元素选择器 div>p{} （设置直属子元素）
9. 相邻兄弟选择器 div+p{} （设置相邻元素）
10. 通用兄弟选择器 div～p{} （设置所有兄弟元素的样式）
11. 属性选择器 div[id=1]{} （设置id为1的div的样式） div[href]{} （设置有href属性的div的样式）

## 优先级
全局（0）< 标签（1）< class（10）< id（100）< 行内（1000） 

# 标签
## 块级标签
div h p 无序列表(ul li) 有序列表(ol li) 自定义列表(dl dt dd)
## 行内标签
a img span strong em b i input textarea select button

块转行 display: inline
行转块 display: block
内联块元素 display: inline-block （既支持宽高，又能一行显示）

## marquee滚动标签

# 盒模型
width height padding border margin


# 定位 position
1. static: 默认值，元素正常显示，非定位元素，默认值。
2. relative: 相对于自身定位，元素正常显示，但位置会被其他元素所覆盖。
3. absolute: 相对于最近的非静态定位元素定位，元素脱离文档流，其他元素不会被该元素所覆盖。
4. fixed: 相对于浏览器窗口定位，元素脱离文档流，其他元素不会被该元素所覆盖。
5. sticky: 既相对于最近非静态定位元素定位，又相对于浏览器窗口定位，元素脱离文档流，其他元素不会被该元素所覆盖。
6. inherit: 继承父元素定位属性。

# 浮动 float
1. none: 默认值，元素正常显示，非浮动元素，默认值。
2. left: 浮动元素向左浮动，元素正常显示，但位置会被其他元素所覆盖。
3. right: 浮动元素向右浮动，元素正常显示，但位置会被其他元素所覆盖。
4. inherit: 继承父元素浮动属性。

## 清除浮动
```css
.clearFloat:before,.clearFloat:after{ 
  content:""; 
  display:table; 
  clear:both; 
  height:0; 
} 
```
# 一些特别的css
## 隐藏
1. overflow: hidden
父元素设置overflow: hidden，子元素超出父元素范围时，子元素会自动隐藏。
2. display: none; 整体隐藏不占位
3. visibility: hidden; 整体隐藏，占位

## 透明
1. opacity: 0.5; 设置元素的透明度，取值范围0-1
2. background-color: rgba(0,0,0,0.5); 透明度背景色。

## 滤镜
1. filter: blur(1px); 模糊

## 图片精灵技术 css sprites技术
将多张背景图放在一张大背景上，通过background-position来找到目标图片的坐标
优点：减少http请求数，减少图片加载时间

## 盒子阴影
```css
box-shadow: 2px 2px 6px 2px #333 [inset];
            //x偏移 y偏移 模糊半径 扩展半径 颜色 投影方式(inset内阴影 默认外阴影)
box-shadow: 3px 3px 5px #000, -2px -2px 4px rgba(255,255,255,0.5);
            //多个阴影

```
## 文字阴影
```css
text-shadow: 2px 2px 2px #333;
             //x偏移 y偏移 模糊半径 颜色
```

## 背景色渐变
线性渐变
```css
background: linear-gradient(to right, red, yellow, blue);
            //线性渐变   方向（to right == 90deg）多个颜色值
```
径向渐变
```css
background: radial-gradient(100px 100px,red, yellow, blue);
            //径向渐变   圆心坐标  多个颜色值
```


## css控制文字，超过部分显示省略号
单行文本
```css
overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
```

多行文本（适用于WebKit浏览器及移动端） 
```css
overflow: hidden;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;
```

## 富文本框
1.contenteditable='true' 把div等变成可编辑的区域
2.getSelection().toString() 获取选中的文本
3.三个参数的指令
将选中的文本变红。 第二个参数永远是false
document.execCommand('ForeColor',false,"#eeeeee"); 
document.execCommand("insertImage",false,src); 插入图片 
document.execCommand("FontSize",false,3); 
document.execCommand('FontName',false,"微软雅黑"); 
4.两个参数的指令 
document.execCommand('bold'); 加粗
document.queryCommandState('bold'); 检测是否加粗 
italic 倾斜 
underline 下划线 
justifyCenter 居中 
justifyRight 居右 

## 更改placeholder颜色
```css
::-webkit-input-placeholder { /* WebKit browsers */ 
color:#fff; 
} 
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
color:#fff; 
} 
::-moz-placeholder { /* Mozilla Firefox 19+ */ 
color:#fff; 
opacity: 1; 
} 
:-ms-input-placeholder { /* Internet Explorer 10+ */ 
color:#fff; 
} 
```

## 媒体查询
```css
/*iphone5*/
@media (max-width: 374px){
  html{font-size: 10px}
} 
/*iphone6*/
@media (min-width: 375px) and (max-width: 766px){
  html{font-size: 12px}
} 
/*ipad*/
@media (min-width: 767px){
  html{font-size: 16px}
} 
```

## 1像素细线
```css
:after{ 
  content:''; 
  width:100%; 
  border-top:1px solid #E7E7E7; 
  transform: scaleY(0.5); 
  position: absolute; 
  bottom: 0; 
} 
```

## 增大点击热区
```css
.btn:before{
  content: ''; 
  position: absolute; 
  top: -10px; 
  bottom: -10px; 
  left: -10px; 
  right: -10px; 
} 
```

# 一些特别的js
## 关闭浏览器的当前页面
open(location,’_self’).close()

## js监听用户是否在浏览页面
```js
window.onblur = function () {
  console.log("失去焦点”);
} 
document.addEventListener('visibilitychange',function(){
  if(document.visibilityState==='hidden’){// visible
    console.log("选项卡切换”)
  }
})
```

# 动画
## 过渡动画 transition
```css
div{
  width:100px;
  height:100px;
  background:blue;
  transition:width 2s;
}
div:hover{
  width:300px;
}
```

## animation动画
```css
// 定义
@keyframes mymove{
  0%   {top:0px;}
  25%  {top:200px;}
  50%  {top:100px;}
  75%  {top:200px;}
  100% {top:0px;}
}
// 调用
.move{
  animation: mymove 5s infinite
}
```
## svg
## canvas

