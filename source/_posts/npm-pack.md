---
title: npm发布一个自己的包
date: 2021-08-03 14:08:07
tags: 
    - npm
categories: 进阶
---

>做个简单的实例演示如何发布自己的npm包
## 1.创建一个包
### 1.1 npm init创建一个项目
根据提示可以配置入口文件为index.js（默认）,配置git地址，等等，具体步骤略<br>
配置完生成一个package.json
### 1.2 在index.js编写自己的代码
这里以一个转化时间戳为时间格式的字符串为例

```js
export function formatTime(time, format) {
    // 代码略
}
```
### 1.3 项目创建完毕
项目中必须有index.js及package.json，有这两个文件这个项目的雏形就有了。

## 2.发布这个包
### 2.1 申请一个npm账号
可以在npm官网创建账号 [npm官网地址](https://www.npmjs.com/)，或用命令`npm adduser`创建
### 2.2 黑窗口登录账号
`npm login`

发布之前必须登录不然发到哪里？ npm whoami 命令可以检验是否已经登录，如果已经登录无需重复登录。
### 2.3 黑窗口发布项目
`npm publish`

完毕，到此处事情已经完成了。可以登陆官网看自己发的包

## 3.使用自己的npm包
本人只试了在vue项目中如何使用自己的包
### 3.1 安装
```js
npm i claus-core -S
或 yarn add claus-core
```
### 3.2 使用
在vue组件中

```js
import {formatTime} from 'claus-core'
console.log(formatTime(new Date()))
```
so easy
## 4.包的维护
### 4.1删除
`npm unpublish claus-core --force`
### 4.2更新
1.修改版本号<br>
2.`npm publish`

