---
title: canvas
date: 2025-07-18 14:28:24
tags: canvas
categories: 基础
---
```html
<canvas></canvas>
<script>
var canvas = document.querySelector("canvas"); 
var cvs = canvas.getContext("2d”);
canvas.width=document.documentElement.clientWidth
canvas.height=document.documentElement.clientHeight

//画线
cvs.beginPath();//1.开始路径
cvs.strokeStyle = "pink"; 
cvs.lineWidth = 1;//2.设置样式 
cvs.moveTo(0,0);//3.起始位置
cvs.lineTo(50,50);//4.结束我位置
cvs.closePath();
cvs.stroke();//刻画路线


//画圆 
cvs.beginPath();
cvs.strokeStyle = "red"; 
cvs.arc(300,300,50,0,Math.PI*2);
cvs.closePath();
cvs.stroke();

//实心圆
cvs.beginPath();
cvs.fillStyle = "red"; 
cvs.arc(250,250,50,0,Math.PI*2);
cvs.closePath();
cvs.fill();

//实心矩形
cvs.beginPath()
cvs.fillStyle = 'blue'
cvs.fillRect(400,100,50,50);//x,y,w,h
cvs.closePath()
cvs.fill()

</script>
```
