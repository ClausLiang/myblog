---
title: 高频面试题总结
date: 2019-01-01 00:00:01
tags:
    - 面试
categories: 基础
---

# HTML CSS

# JS
**`1.js数据类型。`**

基本类型：number string boolean null undefined symbol
复杂类型：Object

`基本类型和引用类型区别：`
1.基本类型存的是值（栈内存），引用类型存则是在栈内存中存放标量标识符和地址，堆内存存放对象。
2.基本类型值不可改变，引用类型值可变

`深拷贝浅拷贝区别。`
浅拷贝：在栈内存开辟另一个空间，将被拷贝的栈内存数据完全拷贝到该空间，即基本类型数据完全被拷贝，引用类型数据只是拷贝了指向堆内存的地址。
深拷贝：不仅在栈内存开辟了另一个空间，而且若被拷贝的对象中有引用类型，还会在堆内存中开辟另一个空间存放引用类型的真实数据。

`深拷贝浅拷贝的实现`
浅拷贝：Object.assign()
深拷贝的实现方式：
JSON的方式
递归实现

**`2.数组的方法`**
push pop unshift shift splice sort reverse (改变原数组)
concat slice indexOf join toString valueOf
es6中新增的方法有：
forEach(fn) map(fn) filter(fn) find(fn) findIndex(fn) every(fn) some(fn) reduce(fn) reduceRight(fn) keys() values() entries()

**`3.typeOf`**
typeof对于基本类型，初了null都可以显示正确的类型
typeof null // 'object'
typeof对于对象，除了函数都显示'object'

**`4.原型 原型链`**
每个函数都有prototype属性，除了Function.prototype.bind()，该属性指向原型。
每个对象上都有__proto__属性，指向创建该对象的构造函数的原型。
对象可以通过__proto__来寻找不属于该对象的属性，__proto__将对象连起来形成了原型链。

**`5.new的过程发生了四件事`**
1.新生成了一个对象
2.链接到原型
3.绑定this
4.返回新对象

**`6.instanceof`**
判断对象的类型。内部机制是通过判断对象的原型链中是不是能找到类型的prototype
我们可以试着实现一下instanceof
```js
function instanceof(left, right) {
    // 获得类型的原型
    let prototype = right.prototype
    // 获得对象的原型
    left = left.__proto__
    // 判断对象的类型是否等于类型的原型
    while (true) {
        if (left === null)
            return false
        if (prototype === left)
            return true
        left = left.__proto__
    }
}
```
**`7.闭包`**
闭包的定义很简单：函数A返回了一个函数B，并且函数B中使用了函数A的变量，函数B就被称为闭包
解决的问题：保存变量
带来的问题：会造成内存泄露

```js
function A() {
    let a = 1
    function B() {
        console.log(a)
    }
    return B
}
```
经典面试题：循环中使用闭包解决var定义函数的问题
```js
for ( var i=1; i<=5; i++) {
    setTimeout( function timer() {
        console.log( i );
    }, i*1000 );
}
```
因为setTimeout是个异步函数，所以会先把循环执行完，此时i是6，所以会输出5个6
解决方法有3种：
第一种使用闭包
```js
for (var i = 1; i <= 5; i++) {
    (function(j) {
        setTimeout(function timer() {
            console.log(j);
        }, j * 1000);
    })(i);
}
```
第二种使用setTimeout的第三个参数
```js
for ( var i=1; i<=5; i++) {
    setTimeout( function timer(j) {
        console.log( j );
    }, i*1000, i);
}
```
第三种是使用let定义i
```js
for ( let i=1; i<=5; i++) {
    setTimeout( function timer() {
        console.log( i );
    }, i*1000 );
}
```
**`8.模块化`**
es6的模块化 import export 需要有babel
commonjs的模块化 require module.exports 浏览器中需要用browserify解析

对于commonjs与ES6中的模块化的区别：
1.前者支持动态导入，也就是require(${path}/a.js)，后者目前不支持，但是已有提案
2.前者是同步导入，因为用于服务端，文件都在本地，即使卡住主线程也影响不大。后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响。
3.前者在导出时是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。后者采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化。
4.后者会变异成 require/exports 来执行

**`9.call apply bind的区别`**
call和apply的区别：
都是为了改变this的指向，作用是相同的，只是传参的方式不同；除了第一个参数，call逐一接受参数，apply只接受一个参数数组。
bind和其他两个方法的作用也是一致的，只是该方法会返回一个函数。并且我们通过bind实现柯里化。

# 浏览器
**`1.跨域`**
因为浏览器出于安全考虑，有同源策略。也就是说，如果协议、域名、端口有一个不同就是跨域，ajax就会请求失败。
我们可以通过以下几种方式进行跨域：
1.jsonp：利用script标签没有跨域限制的漏洞。通过script标签指向一个需要访问的地址并提供一个回调函数来接受数据当需要通讯时。只限于get请求。
2.CORS
CORS需要浏览器和后端同时支持。浏览器会自动进行CORS通信，实现CORS通信的关键是后端，只要后端实现了CORS，就实现了跨域。服务端设置Access-Control-Allow-Origin就可以开启CORS。
3.document.domain
该方式只能用于二级域名相同的情况下，比如a.test.com和b.test.com适用于该方式。只需给页面添加document.domain = 'test.com'表示二级域名都相同就可以实现跨域
4.postMessage
这种方式常用于获取嵌入页面中的第三方页面数据。一个页面发送消息，另一个页面判断来源并接受消息。

**`2.事件轮询（event loop）`**
js是门非阻塞单线程语言，因为在最初js就是为和浏览器交互而诞生的。（如果js是多线程，我们在多个线程中处理dom就会有问题，当然引入读写锁可以解决）

# VUE
# 小程序
