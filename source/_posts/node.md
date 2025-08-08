---
title: node基础知识
date: 2025-08-08 17:12:11
tags:
  - node
  - npm
categories: node
---
<script type="text/javascript" src="/myblog/custom.js"></script>

# node概念
node.js 是一个基于 Chrome V8 引擎的 JavaScript运行环境。它让Javascript成为与PHP、Ruby、Python、Perl等服务端语言平起平坐的脚本语言。
# NPM
NPM（Node Package Manager）是 Node.js 运行时环境默认集成的包管理工具，用于下载、安装、更新和发布 Node.js 包。
## 一些命令
1. npm init
创建package.json文件
2. npm install
安装依赖包
3. npm get registry
获取npm的默认仓库地址
4. npm config set registry https://registry.npm.taobao.org
设置npm的仓库地址为淘宝的
5. npm config list
列出npm的配置信息
6. npm cache ls
列出npm缓存目录下的所有文件
7. npm cache clean
清空npm缓存目录下的所有文件
8. npm adduser
添加npm账号
9. npm login
登录npm
10. npm publish
发布npm包

# node常用模块
Node使用Module模块去划分不同的功能，以简化应用的开发。Modules模块有点像C++语言中的类库。每一个Node的类库都包含了十分丰富的各类函数，比如http模块就包含了和http功能相关的很多函数，可以帮助开发者很容易地对比如http,tcp/udp等进行操作，还可以很容易的创建http和tcp/udp的服务器。
## 文件系统fs
```js
var fs = require('fs');
var buf = new Buffer(5);
var buf = new Buffer(5);
fs.open("hello.txt","r+", function (err, data) {
  if (err) {
    return console.error(err);
  }
  console.log("打开文件");
  fs.read(data,buf,0,buf.length,0,function(err,bytes){
    if(err){
      console.log(err);
    }
    console.log(bytes+"字节被读取");

    if(bytes > 0){
      console.log(buf.slice(0, bytes).toString());
    }
  })
});
fs.readFile('hello.txt', function (err, data) {
  if (err) {
    return console.error(err);
  }
  console.log("异步读取: " + data.toString());
});
```

## 文件读写5阶段


## node中的系统常量
__dirname 文件所在路径（两杠）
__filename 文件名


# node技巧
## 搭建一个静态服务器
安装模块：npm install http-server -g
运行：http-server -p 8080