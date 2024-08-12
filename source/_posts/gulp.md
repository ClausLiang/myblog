---
title: 用gulp4.0搭建一个项目
date: 2022-02-22 16:58:36
tags:
    - gulp
categories: 进阶
---

框架发展到现在，建一个项目用脚手架按照提示一步步操作就创建好了。但如果不用脚手架，还有gulp这种简单的工具，可以很方便的搭起来一个项目。gulp功能也挺强的，学习成本较低。本文介绍用gulp4.0搭建一个可以自动编译sass、处理js、启动服务的项目。

## 准备
### 安装gulp命令行工具
```zsh
npm install --global gulp-cli
```
### 创建项目并进入
```zsh
npx mkdirp my-project
```
```zsh
cd my-project
```
### 初始化package.json
```zsh
npm init
```
### 安装gulp，作为开发时依赖项
```zsh
npm install --save-dev gulp
```
### 创建gulpfile.js
### 项目结构

![image.png](/images/gulp-2022-2-22.png)

## 编写gulpfile
gulp4.0语法和之前的有些不同。
### 创建任务
每个function都是一个任务，任务分为公开任务和私有任务，未导出就是私有任务，导出就是公开任务。function必须接受一个callback作为参数，或者return出stream、promise、event emitter、child process、 observable这五种类型的一个值。
```js
function clean(cb) {
    // body omitted
    cb();
}
// 没有导出是私有任务
function task(){
    return src('src/js/abc.js').pipe(dest('dist'))
}
exports.clean = clean;
```
### 组合任务
组合任务有两种方式 `series`顺序执行，`parallel`并行执行，这两种方式可以随意嵌套
```js
const { series, parallel } = require('gulp');
function a(cb){
    ...
    cb()
}
function b(cb){
    ...
    cb()
}
function c(cb){
    parallel(a,b)
    cb()
}
exports.task1 = series(a,b)
exports.task2 = c
```
### 处理文件、文件监控
```js
const {src,dest,watch} = require('gulp')
...
```
方法不一一列举，可以参考官网
### 使用插件自动编译sass、处理js、启动服务
gulp官网展示有很多插件，良好利用插件可以办很多事情。举例：使用`gulp-uglify`实现js代码压缩
```zsh
npm install --save-dev gulp-uglify
```
```js
const uglify = require('gulp-uglify');
function js(){
    return src(['src/js/**/*.js','!src/js/lib/**']).pipe(uglify()).pipe(dest('dist/js'))
}
```
以下为本项目的gulpfile.js中的全部代码，分别用了处理sass，处理js，启动服务等插件。已经可以满足一般需求，如果有别的需要可以在官网中通过关键字搜索插件。
```js
const {src,dest,watch,parallel} = require('gulp')
const sass = require('gulp-sass')(require('sass')); // 使用sass
const gls = require('gulp-live-server') // 创建服务
const uglify = require('gulp-uglify'); // 压缩js
const cleanCSS = require('gulp-clean-css'); // 压缩css

// 处理html：输出
function html(){
    return src('src/*.html').pipe(dest('dist'))
}
// 处理css库：压缩，输出
function cssInit(){
    return src('src/styles/*.css').pipe(cleanCSS({compatibility: 'ie8'})).pipe(dest('dist/css'))
}
// 处理样式：编译sass，压缩，输出
function css(){
    return src('src/styles/*.scss').pipe(sass()).pipe(cleanCSS({compatibility: 'ie8'})).pipe(dest('dist/css'))
}
// 处理js库，不需压缩直接输出
function jsLibInit(){
    return src('src/js/lib/*.js').pipe(dest('dist/js/lib'))
}
// 处理js：抛去库，压缩，输出
function js(){
    return src(['src/js/**/*.js','!src/js/lib/**']).pipe(uglify()).pipe(dest('dist/js'))
}
// 处理图片：输出
function img(){
    return src('src/img/**').pipe(dest('dist/img'))
}

// 启动server
function server(cb){
    const server = gls.static('dist',80)
    server.start()
    cb()
}
// 监听变化
function watchChange(cb){
    watch('src/*.html', html)
    watch('src/styles/*.scss', css)
    watch(['src/js/**/*.js','!src/js/lib/**'],js)
    watch('src/img/**',img)
    cb()
}
exports.server = parallel(html,cssInit,css,img,jsLibInit,js,server,watchChange)

```
完整代码参见 [gitee/clausliang](https://gitee.com/clausliang/gulp-project.git)
### 参考
[gulp官网](https://gulpjs.com.cn/)

