---
title: 高频面试题总结
date: 2019-01-01 00:00:01
tags:
    - 面试
categories: 进阶
---
<script type="text/javascript" src="/custom.js"></script>

# HTML CSS
## `css垂直居中`
1. vertical-align: middle; display: inline-block(前提)
2. position: absolute; top: 50%; transform: translateY(-50%)
3. display: flex; 子元素： align-self: center; (align-self可以覆盖父容器align-item的属性)

## **`响应式布局的实现方式和原理`**
`响应式布局`就是让网站同时适配不同的手机和分辨率
方式有：
1.百分比布局：百分比布局是相对于父元素来说的，我们可以设置的属性有：margin padding width height，对于元素的font-size border是无法设置的。
2.媒体查询：设置不同分辨率下的css样式从而适配不同的手机端。
3.rem布局：根据html的font-size的大小设置每个元素的属性的大小是多少rem，通常需要先通过js动态改变html的font-size大小，或利用媒体查询先设置html的font-size大小。
4.vw布局：css3引入的新单位，视口宽度是100vw，通过使用插件可以自动计算出每个元素的大小是多少vw
5.flex布局

## **`sass用过哪些功能`**
1.使用变量
2.嵌套
3.导入sass文件：css的import只有在执行的时候才会导入会导致加载变慢，sass的@import在编译的时候就会把相关文件导入
4.静默注释：//不会出现在编译完的css中
5.混合器
@mixin abc先定义 例如 @mixin b-radius{ boder-radius: 5px;}
@include来使用 例如：.aaa{@include b-radius}
6.选择器继承 @extend
.a {color:red} .b{@extend .a;}

## **`flex:1 是哪几个属性的缩写`**
flex:1 是 flex: 1 1 auto 的缩写，是三个属性flex-grow flex-shrink flex-basic的缩写
子元素共有6个属性 order flex-grow flex-shrink flex-basic flex align-item
参考：阮一峰flex布局<https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html>

## **`position属性有哪些值`**
static relative absolute fixed sticky

# JS
## **`js数据类型。`**

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

## **`数组的方法`**
push pop unshift shift splice sort reverse (改变原数组)
concat slice indexOf join toString valueOf
es6中新增的方法有：
forEach(fn) map(fn) filter(fn) find(fn) findIndex(fn) every(fn) some(fn) reduce(fn) reduceRight(fn) keys() values() entries()

`map和forEach的区别：`
1.map的速度比forEach快
2.map会返回一个新的数组，不对原数组产生影响，forEach不产生新的数组，forEach返回undefined
3.map因为产生新的数组可以链式操作，forEach不能。
4.map里可以用return（return什么相当于把这一项变为什么），而forEach里用return不起作用，forEach不能用break，会直接报错。

`for循环中return break continue的区别`
return是使整个函数返回，后面的不管是循环内还是循环外的都不执行了。
break中断循环，但不会跳出函数，continue是跳过该次循环。

## **`typeOf`**
typeof对于基本类型，除了null都可以显示正确的类型
typeof null // 'object'
typeof对于对象，除了函数都显示'object'

## **`instanceof`**
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
## **`原型 原型链`**
每个函数都有prototype属性，除了Function.prototype.bind()，该属性指向原型。
每个对象上都有__proto__属性，指向创建该对象的构造函数的原型。
对象可以通过__proto__来寻找不属于该对象的属性，__proto__将对象连起来形成了原型链。

### `作用域 作用域链`
作用域就是变量的可用性的代码范围。简单的理解就是在这个范围内变量是可用的，超过这个范围就无法使用。

作用域链：当你要访问一个变量时，首先会在当前作用域下找，如果当前作用域没找到，则返回上一级作用域查找，直到找到全局作用域，这个查找的过程形成的链条就是作用域链。

## **`new的过程发生了四件事`**
1.新生成了一个对象
2.将新对象的__proto__链接到构造函数的原型，
3.新对象绑定到函数调用的this
4.返回新对象


## **`闭包`**
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
## **`模块化`**
es6的模块化 import export 需要有babel
commonjs的模块化 require module.exports 浏览器中需要用browserify解析

对于commonjs与ES6中的模块化的区别：
1.前者支持动态导入，也就是require(${path}/a.js)，后者目前不支持，但是已有提案
2.前者是同步导入，因为用于服务端，文件都在本地，即使卡住主线程也影响不大。后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响。
3.前者在导出时是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。后者采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化。
4.后者会编译成 require/exports 来执行

## **`call apply bind的区别`**
call和apply的区别：
都是为了改变this的指向，作用是相同的，只是传参的方式不同；除了第一个参数，call逐一接受参数，apply只接受一个参数数组。
bind和其他两个方法的作用也是一致的，只是该方法会返回一个函数。并且我们通过bind实现柯里化。

> `柯里化`是把接受多个参数的函数变换成接受一个参数的函数，并返回接收余下参数且返回结果的新函数的技术。

## **`es6有哪些新特性`**
1.let const
2.symbol 新增的一个基本类型，用于表示一个独一无二的值，不能与其他数据类型进行运算。
3.模版字符串
4.解构表达式。它是一种针对数组或者对象进行模式匹配，然后对其中的变量进行赋值。
5.对象方面
  新增对象map set
  数组新增了一些方法
  Object新增了一些方法 Object.assign Object.keys Object.values Object.entries
  对象声明简写 let person = {name,age}
  对象扩展符 ...
6.箭头函数。三个特点：不需要关键字function 省略return关键字 继承上下文的this关键字
7.class
8.promise proxy
9.模块化
10.运算符
扩展运算符...
可选链?.


## **`a和b不通过第三个变量交换值`**
```js
let a=3,b=5
a = a + b
b = a - b
a = a - b
```

## **`async await是什么？它有什么作用？`**
async await是es7的新增特性。async用于声明一个函数，await用于等待一个异步方法执行完成。
async函数返回的是一个promise对象，可以用.then方法添加回调函数。
await关键字只能使用在被async声明的函数内，用于修饰一个Promise对象，使得该Promise对象处理的异步任务在当前协程上按顺序同步执行。

## `this的指向有哪些情况`
1.this出现在全局函数中，永远指向window
2.this在严格模式中，永远不会指向window，全局中this为undefined
3.当某个函数为对象的一个属性时，在这个函数内部this指向这个对象。
4.this出现在构造函数中，指向构造函数新创建的对象。
5.事件中this指向事件的调用者。
6.箭头函数，它的this取决于外部环境，指向最近的函数。

# http协议
## **`http的请求方式`**
get、post、put、delete、head、options、connect
## **`http和https的区别`**
https = http + 加密 + 认知 + 完整性保护
https（http secure）是http上又套了一层ssl协议。通常，http直接和tcp通信，当使用ssl时，则演变成先和ssl通信，再由ssl和tcp通信。在采用ssl后，http就拥有了https的加密、证书和完整性保护这些功能。

## **`简单请求和复杂请求的区别`**
`简单请求`
请求满足以下条件为简单请求，否则为复杂请求
1.请求方式是get/post/head
2.请求头包含字段可以有：Accept，Accept-Language，content-Language，Last-Event-ID，Content-Type，其中Content-Type的值只能是application/x-www-form-urlencoded，text/plain，multipart/form-data
`简单请求和复杂请求的区别`
复杂请求会多发一次请求，options，这个请求我们称为预请求，服务器也会做出“预响应”，预请求实际上是一种权限请求，只有预请求成功后，实际的请求才会执行，预请求也存在跨域问题。

## **`session、cookie、token区别`**
http是一种无状态的协议，当客户端访问服务器的时候，服务器会生成一个`cookie`传给客户端，客户端会把cookie保存起来，以后客户端每次访问服务端都会携带这个cookie

`session`是另一种记录客户状态的机制，不同于cookie，session保存在服务端，客户端访问服务端的时候，服务端把客户端信息以某种形式记录在服务器上，这就是session。session的id以cookie的形式传回客户端，以后每次请求客户端都携带cookie来访问服务端。

通常情况下cookie和session是结合起来应用的。

`session和cookie的共同点：`
都是用来跟踪浏览器用户身份的会话方式。
`session和cookie的区别：`
cookie存在客户端，session存在服务端
cookie不太安全，用户可以修改，session更安全。
cookie大小限制4k
session会在一定时间内保存到服务器上，当访问增多会占有服务器性能，考虑减轻服务器压力用cookie


`token`
顾名思义是一个令牌，由uid+time+sign+其他参数组成，token一般在服务端生成。当用户登录的时候，服务端校验用户名密码通过以后会生成一个token和过期时间，然后将token返回给客户端，客户端将token保存下来，后续所有的请求都携带这个token。每次请求都会刷新过期时间。

`token和session的区别：`
session是一种记录服务器和客户端会话状态的机制，使服务端有状态，可以记录会话信息。而token是令牌，访问资源接口时所需的资源凭证。token使服务端无状态化，不会存储会话信息。
作为身份认证token安全性比session好，因为每一个请求都有签名还能防止监听以及csrf攻击。
token慢但占服务器内存小，session快但是占服务器空间。

# 浏览器
## **`跨域`**
同源策略：它是一种约定，它是浏览器最核心也最基本的安全功能，如果少了同源策略，浏览器的正常功能都会受影响。同源策略是浏览器的行为，是为了保护本地数据不被js代码获取回来的数据污染，拦截的是数据接收。即请求发送了，服务器响应了，但是无法被浏览器接收。
因为浏览器出于安全考虑，有同源策略。也就是说，如果协议、域名、端口有一个不同就是跨域，ajax就会请求失败。
我们可以通过以下几种方式进行跨域：
1.jsonp
利用script标签没有跨域限制的漏洞。通过script标签指向一个需要访问的地址并提供一个回调函数来接受数据当需要通讯时。只限于get请求。
2.CORS
CORS需要浏览器和后端同时支持。浏览器会自动进行CORS通信，实现CORS通信的关键是后端，只要后端实现了CORS，就实现了跨域。服务端设置Access-Control-Allow-Origin就可以开启CORS。
3.node中间件代理
 a.接受客户端请求 b.将请求转发给服务器 c.拿到服务器响应的数据 d.将响应转发给客户端
4.nginx反向代理
最简单的跨域方式，只需修改nginx配置即可解决跨域。实现思路：通过nginx配置一个代理服务器（域名与domain1相同，端口不同）做跳板机，反向代理访问domain2接口，并且可以顺便修改cookie中的domain信息，方便当前域cookie写入，实现跨域登录。
5.document.domain
该方式只能用于二级域名相同的情况下，比如a.test.com和b.test.com适用于该方式。只需给页面添加document.domain = 'test.com'表示二级域名都相同就可以实现跨域
6.postMessage
这种方式常用于获取嵌入页面中的第三方页面数据。一个页面发送消息，另一个页面判断来源并接受消息。

## **`事件轮询（event loop）`**
js是门非阻塞单线程语言，因为在最初js就是为和浏览器交互而诞生的。（如果js是多线程，我们在多个线程中处理dom就会有问题，当然引入读写锁可以解决）
js在执行的过程中会产生执行环境，这些执行环境会被顺序的加入执行栈中。如果遇到异步的代码，会被挂起并加入task队列（微任务队列、宏任务队列），一旦执行栈为空，event loop就会从task队列中拿出需要执行的代码放入执行栈中执行。

同步任务 --> 微任务 --> 宏任务

微任务：promise.then
宏任务：setTimeout I/O UI渲染

争议点：同步任务是宏任务吗？看了很多文章，解释各不相同

`题目1，promise和setTimeout的执行顺序：`
```js
setTimeout(() => {
    console.log("4");
    setTimeout(() => {
        console.log("8");
    }, 0);
    new Promise((r) => {
        console.log("5");//构造函数是同步的
        r();
    }).then(() => {
        console.log("7");//then()是异步的，这里已经入队
    });
    console.log("6");
}, 0);

new Promise((r) => {
    console.log("1");//构造函数是同步的
    r();
}).then(() => {
    console.log("3");//then()是异步的，这里已经入队
});
console.log("2");

// 执行结果 1 2 3 4 5 6 7 8
```
`题目2: promise async await的执行顺序，await跟的是变量`

```js
async function async1(){
    console.log('async1 start')  // 1
    await async2() // await跟的变量
    // await后面的代码注册为一个微任务
    console.log('async1 end')    // 4
}
async function async2(){
    console.log('async2')        // 2
}
setTimeout(() => {
    console.log('settimeout')    // 6
}, 0);
async1()
new Promise(function(resolve){
    console.log('promise')       // 3
    resolve()
}).then(function(){
    console.log('promise1')      // 5
})

// 输出结果：
/**
 * async1 start
 * async2
 * promise  // 至此都是同步
 * async1 end // 微任务
 * promise1   // 微任务
 * setTimeout // 宏任务
 */
```
解析：await跟着的是一个变量，这种情况把await后面的代码注册为一个微任务，然后跳出async1，执行其他代码，当遇到promise会注册promise.then到微任务队列，此时队列中已有await后面的那个微任务，所以先执行async1 end，再执行promise1.

`题目3: promise async await的执行顺序，await跟的异步调用`

```js
async function async1() {
    console.log('async1 start')  // 1
    await async2() // await跟的有异步，要等异步都执行完
    // async2有return并不会把await后面的代码注册到微任务
    console.log('async1 end')    // 6
}
async function async2() {
    console.log('async2 start')  // 2
    return Promise.resolve().then(() => {
        console.log('async2 end') // 4
    })
}
async1()
new Promise(resolve => {
    console.log('Promise')       // 3
    resolve()
}).then(function () {
    console.log('promise1')      // 5
})

/** 题目3
 * async1 start
 * async2 start
 * Promise   // 至此都是同步
 * async2 end // 微任务
 * promise1   // 微任务
 * async1 end // 跟上面的区别是后执行了这个代码
 */
```
解析：await跟着的是一个异步函数的调用（async2中的return是关键，有和没有差别较大），并不会先把await后面的代码注册到微任务，而是执行完await后直接跳出 async1，执行其他代码。当遇到promise.then将其注册到微任务，其他代码执行完成后，回到async1中执行await后面的代码，将其注册到微任务队列，这时队列中有之前promise.then注册的任务。所以跟上面的区别是先执行 promise1，后执行async1 end

`题目4: 将上题中async2中的return去掉就变成先执行async1 end，后执行promise1`
```js
async function async1() {
    console.log('async1 start')  // 1
    await async2() // await跟的有异步，要等异步都执行完
    // async2没有return先把await后面的代码注册到微任务
    console.log('async1 end')   // 5
}
async function async2() {
    console.log('async2 start')  // 2
    Promise.resolve().then(() => {
        console.log('async2 end') // 4
    })
}
async1()
new Promise(resolve => {
    console.log('Promise')      // 3
    resolve()
}).then(function () {
    console.log('promise1')     // 6
})

/** 题目4
 * async1 start
 * async2 start
 * Promise  // 至此都是同步
 * async2 end // 微任务
 * async1 end // 与上述的区别之处
 * promise1   // 微任务
 */
```
参考：https://blog.csdn.net/qq_39341415/article/details/124752454

## **`浏览器渲染机制`**
1.处理html并构建dom树。
2.处理css并构建cssom树。
3.将dom和cssom合并成一个渲染树。
4.根据渲染树来布局，计算每个节点的位置。
5.调用GPU绘制，合成图层，显示在屏幕上。

## **`css文件的加载会阻塞页面的渲染吗`**
css加载不会阻塞dom的解析，但会阻塞dom的渲染。
css加载也会阻塞js的执行。浏览器有机制，css先执行，js后执行。

## **`css怎么开启硬件加速`**
`什么是硬件加速`
将浏览器的渲染交给GPU处理，而不是浏览器的渲染器，这样可以使animation和transition更加流畅。
`可以触发GPU硬件加速的css属性`
transform opacity filter
`怎么开启硬件加速`
当浏览器检测到页面中的某个dom元素应用了某些css规则就会开启，最显著的特征是元素的3d变换。在一些情况下，我们并不需要对元素应用3d变换效果，这时我们可以用小技巧欺骗浏览器开启硬件加速，例如transform: translateZ(0)
`硬件加速会导致的问题`
1、可能会导致内存问题 2、会影响字体的抗锯齿效果

## **`重绘（repaint）和回流（reflow）`**
重绘：是当节点需要更改外观而不影响布局的，比如改变颜色
回流：布局或几何属性需要改变

回流必定会发生重绘，重绘不一定会引发回流。回流所需要的成本比重绘高的多，改变深层次的节点很可能导致父节点的一系列回流。
所以以下几个动作可能导致性能问题：
改变window大小
改变字体
添加或删除样式
文字改变
定位或者浮动
盒模型

## **`输入URL回车后发生了什么`**
1.地址栏判断是关键字还是url，如果是搜索内容，浏览器会使用默认搜索引擎加上搜索内容合成url。如果是域名会加上协议合成完整的URL
2.按下回车，浏览器进程通过进程间通信（IPC）把URL传给网络进程，
3.网络进程接收到URL，先查缓存，有缓存，直接返回缓存的资源。没有缓存进行dns查询，获得域名的ip
4.利用ip地址和服务器进行tcp三次握手
5.建立tcp连接后，浏览器构建数据包发送请求
6.服务器回应请求，发送回网络进程
7.网络进程将获取到的数据包进行解析，根据响应头中的content-type判断响应数据的类型，如果是字节流类型就将该请求交给浏览器的下载管理器，该次请求流程结束；如果是text/html类型，浏览器获取文档准备渲染。
8.浏览器构建dom树，构建css规则树，合并成渲染树，计算每个dom元素的位置，调用GPU绘制图层现实到屏幕。
9.数据传输完成，TCP四次挥手断开链接


## **`浏览器缓存策略`**
`强缓存`
强缓存表示在缓存期间不需要再次请求。可以通过两种响应头实现：Expires 和 Cache-Control
`协商缓存`
如果缓存过期了，我们就可以使用协商缓存来解决问题。协商缓存需要请求，如果缓存有效会返回304。协商缓存需要客户端和服务端共同实现。协商缓存也有两种实现方式：Last-Modified/If-Modified-Since 和 ETag/If-None-Match



# VUE
## **`组件之间传值`**
1.父->子：通过属性的方式向子组件传值，子组件通过props接收。
2.子->父：子组件通过$emit派发事件，父组件通过绑在子组件上的事件来接收数据。
3.非父子通过eventBus来传值：new一个vue实例，在要传值的文件中导入这个实例（也可以main.js全局引入）,bus.$emit派发事件,bus.$on接收。
4.provide/inject
`5.vuex：`
state: 基本数据
getter: 从state派生的数据，相当于state的计算属性
mutations: 提交更改数据的方法，同步。store.commit提交mutation
actions: 可以进行异步操作，通过store.dispatch提交action
modules: 模块化vuex

页面通过this.$store.dispatch提交action(页面通过mapAction提交异步提交事件到action)，action异步请求数据，拿到数据后通过commit提交到mutation，mutation会修改state的值。最后通过getter把对应的数据跑出去，在页面的计算属性中，通过mapGetter来动态获取state的值。

## **`生命周期`**
beforeCreat/created beforeMount/mounted beforeUpdate/undated beforeDestroy/destroy
beforeUnmount/unmount(vue3)

`beforeCreate` vue创建前，实例初始化之后，this指向创建的实例，data method均不能访问
`created` vue创建后，data method初始化导入之后，未挂载dom
`beforeMount` 模版已经编译好了，但未挂载到页面中
`mounted` 只要执行完mounted表示整个vue实例已经初始化完成了，此时组件已经脱离了创建阶段，进入运行阶段

父beforeCreate -> 父created -> 父beforeMount -> 子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted

父beforeUpdate -> 子beforeUpdate -> 子updated -> 父updated

父beforeDestroy -> 子beforeDestroy -> 子destroy -> 父destroy

## **`vue2与vue3的区别`**
vue3相对于vue2
`更快`
1.virtual dom 完全重写，只针对变化的层进行diff，vue2是对所有的dom进行diff
2.更多编译时（compile-time）提醒以减少runtime开销
3.基于proxy观察者机制以满足全语言覆盖以及更好的性能
4.放弃Object.defineProperty,使用更快的原生proxy
5.组件实例初始化提速，内存使用减少
`更小`
1.tree-shaking 更友好
2.新的core runtime,体积更小
`架构方面`
1.monorepo代码管理模式，各核心模块独立，而vue2各模块相互依赖耦合度高，很多常规不用的模块也在核心包
2.ts重构
`语法方面`
1.composition api。setup入口。setup是新增的生命周期函数，存在于beforeCreate之前。setup选项是一个接收props和content的函数。setup可以定义数据和方法，如果想在模版中使用，必须通过return返回，暴露给组件的其余部分（计算属性、方法、生命周期钩子等）及组件等模版。
2.往vue实例上挂载属性 app.config.globalProperties.$axios = xxx
3.template里可以有多个节点。

**`3.1.为什么vue3用了proxy性能更好`**
proxy的机制是只要对象的属性发生改变就能检测到，defineProperty是递归遍历属性，比proxy慢。

## **`v-for循环中为什么一定要绑定key`**
给每个dom元素加上key作为唯一标识，diff算法可以正确的识别这个节点，使页面渲染更加迅速。
`key可以是哪些值，index为什么影响性能`
key需要不变的唯一的值比如id。如果index作为key，index易变化，diff算法就会认为dom发生变化，执行更新过程，造成不必要的性能开销。dom更新非常消耗性能。

## **`v-for和v-if为什么不能同时使用`**
vue2: v-for的优先级高于v-if，每次渲染都会先循环再判断，也就是只需渲染一部分但是还是要遍历整个数组，带来性能方面的浪费。推荐解决方案：在computed里先处理好要循环的数组。
vue3: v-if的优先级高于v-for。仍然不建议写在一起。方案：根据情况把v-for写在v-if的外层或v-if写在v-for的外层。可以用template包裹。

## **`v-show 和 v-if 有什么区别`**
v-if控制元素渲染与否，会不停的创建和销毁。
v-show通过控制元素的样式display控制元素的显示与否。v-show只编译一次，故v-show性能更好一些。

## **`computed watch`**
如果一个值依赖多个属性，用computed更方便。如果一个值变化后会引起一系列的操作或变化，用watch更方便。watch支持异步computed不支持。

## **`vue data为什么是函数`**
data之所以是一个函数，是因为一个组件可能会多处调用，而每次调用就会执行data函数并返回新的数据对象，这样，就可以避免多处调用之间的数据污染。

## **`自定义组件v-model怎么实现数据双向绑定`**
vue2
一个组件上的v-model会默认利用名为value的prop和名为input的事件
```html
<custome v-model="search"/> // 等价于
<custome :value="search" @input = "newValue => search = newValue"/>
```
vue3
v-model使用modelValue，在一个组件上v-model会被展开为如下形式
```html
<custome v-model="search"/> // 等价于
<custome :modelValue="search" @update:modelValue = "newValue => search = newValue"/>
```
因此自定义组件要用props接收value或modelValue，处理完逻辑再通过派发事件input或者update:modelValue通知到父组件。
详细描述：
`<custome>` 组件内部需要做两件事：
1.将内部原生 `<input>` 元素的 value attribute 绑定到 modelValue prop
2.当原生的 input 事件触发时，触发一个携带了新值的 update:modelValue 自定义事件
```html
<!-- CustomInput.vue -->
<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

## **`keep-alive怎么用，怎么销毁`**
`<keep-alive>`包裹动态组件，会缓存不活动的组件实例。把要缓存的组件name放到includes属性里。如果要销毁，去掉includes里对应的组件。

`keep-alive实现原理：`
在created钩子函数调用时将需要缓存的vnode节点保存在this.cache中，在页面渲染时，如果vnode的name符合缓存条件，则会从this.cache中取出之前缓存的vnode实例进行渲染

## **`$set的使用场景`**
1.通过数组的下标修改数组的值，数据已经被修改，但是不触发updated函数，视图不更新
2.vue中检测不到对象属性的添加和删除。
vue2在创建实例的时候把data深度遍历所有属性，并使用Object.defineProperty把这些属性全部转为getter/setter。让vue追踪依赖，在属性被访问和修改时通知变化。所以属性必须在data对象上存在才能让vue转化它，这样才能让它时响应的。当你在对象上新加了一个属性，该属性并没有加入vue检测数据更新的机制。vue.$set是能让vue知道你添加了属性，它会给你做处理。

## **`$nextTick的使用场景`**
主要用于处理数据动态变化后dom还未及时更新的问题，用$nextTick可以获取最新dom的变化
场景：
1.有时需要根据数据动态的为某些dom添加事件，这要求在dom渲染完毕时设置，但是mounted函数执行时一般dom并没有渲染完毕，就出现获取不到的问题，这时需要用$nextTick
2.在使用某个第三方插件时，希望在vue生成某些dom动态发生变化时重新应用该插件，这时需要在$nextTick的回调中执行重新应用插件的方法。

vue有一个重要的概念：异步更新队列。vue在观察到数据的变化时并不是直接更新dom，而是开启一个队列，并缓存在同一个事件循环中的所有数据变化。在缓冲中会去除重复数据，从而避免不必要的计算和dom操作。然后在下一个事件循环tick中，vue刷新队列并执行实际的工作。所以如果用一个for循环来动态改变数据100次，其实它只会应用最后一次变化。如果没有这种机制，dom就要重绘100次，这是一个非常大的开销。$nextTick就是知道什么时候dom更新完成。

## **`插槽`**
概念：封装组件期间为用户预留的内容的占位符
匿名插槽：
  `<slot></slot>`
具名插槽：
  定义：`<slot name="foot"></slot>`
  为具名插槽提供内容 `<template #foot></template>`
作用域插槽：
  让父组件使用插槽时插槽内容可以访问子组件中的数据

## **`动态路由`**
router.addRoutes动态添加路由

## **`vue router有几种跳转方式`**
```html
<router-link>
this.$router.push
this.$router.replace
this.$router.go(n)
```

## `vue router传参的方式，有什么区别`

1.params传参，不显示参数，只能用name，不能用path，页面刷新后获取不到参数
this.$router.push({
    name: 'abc',
    params: {id: 1}
})
2.params传参，显示参数
路由需要提前配好
{path: '/abc/:id', component: abc}
this.$router.push({
    path: '/abc/1'
})
3.query传参，name path都可以，页面刷新后依然能获取到参数

## `路由的原理`
前端路由本质就是监听URL的变化，然后匹配路由规则，显示相应的页面，而且无需刷新。目前单页面使用的路由就只有两种实现方式：
`hash模式`
由于hash的变化不会导致浏览器向服务器发送请求，而且hash的变化会触发hashChange事件，浏览器的前进后退也能对其进行控制
```js
window.location.hash //获取当前的hash值 
window.addEventListener('hashchange',function(){ 
//监听hashchange事件，用于改变url 
}）
```
`history模式`
History接口允许操作浏览器曾经在标签页或框架里访问的会话历史记录。


## `vue的diff算法`
在数据发生变化时，vue先是根据真实dom生成一个virtual dom，当virtual dom某个节点的数据改变后会生成一个新的vnode，然后vnode和oldVnode做对比，发现有不一样的地方就直接改在真实的dom上，然后使oldVnode的值改为vnode，来更新节点。

## `vue是怎么实现对对象和数组的监听的`
本质上都是调用Object.defineProperty这个方法，将数据变为响应式数据。
对象：
  >源码里封装了一个Observer方法，先获取对象的所有键，进行for循环，给每个属性都调用一次defineReactive方法，从而达到每个属性都是响应式的目的，在defineReactive中，通过判断此键的值是不是对象，如果是对象重新调用Observer

数组：
  >修改数组的方法都在Array的原型上，我们想让数组也成为响应式数据，也要借助Object.defineProperty，所以我们要对修改数组的方法进行修改和加工，即创建一个拦截器arrayMethods，这里不能直接修改Array的原型是因为会造成全局污染。判断数据如果是数组的话，将其原型改变为arrayMethods。有些浏览器不支持__proto__，我们将拦截器挂载到数组的属性上。
  
## `vuex单向数据流，和vue双向绑定的区别`
vue中的双向绑定是指：由mvvm框架实现，是view层和model层之间的映射关系。具体就是v-model，是一个语法糖。
单向数据流是：组件之间传递数据是单向数据流，父组件可以向子组件传递props，但是子组件不能直接修改props，子组件只能通过事件通知父组件进行数据修改。

# 架构方面

## **`性能优化做过哪些`**
前端性能优化可以从这几个方面入手：加载优化、执行优化、渲染优化、脚本优化、代码优化
1.加载优化：减少http请求，缓存资源，压缩代码，首屏加载优化，按需加载，预加载，压缩图片，减少cookie，避免重定向，异步加载第三方资源。
2.执行优化：css写在头部，js写在末尾并异步，避免img iframe等的src为空，尽量避免重置图片大小，图像尽量避免使用DataUrl
3.渲染优化：设置viewport，减少dom节点，优化动画，优化高频事件，GPU加速。
4.样式优化：避免在html中写style、避免css表达式，移除css空规则，正确使用display
5.脚本优化：减少重绘和回流，缓存dom选择与计算，缓存.length的值，尽量使用事件代理，尽量使用id选择器，touch事件优化。
6.代码优化：不实用table布局，减少无意义的dom元素，减少dom元素的数量与层级，减少css的嵌套。js方面：拆分函数，将复杂的函数拆分成小函数；优化分支结构；
参考：https://blog.csdn.net/weixin_44730897/article/details/111247844

## **`微前端的样式隔离是怎么做的`**
每个子应用通过前缀独立区分开。子应用的所有元素都被插入到标签micro-app中，且micro-app标签具有唯一的name值，所以通过添加属性选择器前缀micro-app[name=xxx]可以让css样式在指定的micro-app内生效。

## **`组件封装需要考虑哪些方面`**
1.尽可能低耦合，组件之间依赖越小越好
2.最好从父组件传入所需信息，不在公共组件中请求数据
3.传入数据添加校验
4.处理事件的方法写在父组件中
5.不依赖vuex
遵循易用性、拓展性、可维护、可重用、单一职责等几个原则

## **`webpack配置优化`**
总的来说webpack的性能优化主要做两件事：加速打包速度，加速代码运行速度。

## **`webpack的loader和plugin的区别`**
loader是文件加载器，能够加载资源文件，并对文件进行一些处理，如编译、压缩等，最终一起打包到指定的文件中。
plugin赋予了webpack各种灵活的功能，如打包功能，资源管理，环境变量注入等，目的是解决loader无法实现的其他功能。
loader运行在项目打包之前，plugin运行在整个项目的编译时期。
在webpack运行的整个生命周期中会广播出许多事件，plugin会监听这些事件，在合适的时间通过webpack提供的api改变输出结果。
对于loader而言，它实质上是一个转换器，将A文件编译为B文件，操作的是文件，比如将A文件编译成B文件，单纯的文件转换过程。

参考：https://mp.weixin.qq.com/s/U5J6nCANyKx3olFTzRVr6g

## `服务端渲染的优缺点`
优点：
  >1.前端耗时少，因为后端拼接了html，浏览器只需要渲染出来就行。
  2.利于seo。
  3.无需占用客户端资源。
  4.后端生成静态页面，减少查询数据库浪费的时间。

缺点：
  >1.不利于前后端分离，开发效率低。使用服务端渲染，不利于分工合作。一般前端写一个html，后端再修改为模版，非常低效。并且常常需要前后端共同完成修改。
  2.占用服务端资源。服务端完成html模板的解析，如果请求较多，会对服务端造成一定的访问压力。如果是客户端渲染就把这些解析压力分担到客户端了。
