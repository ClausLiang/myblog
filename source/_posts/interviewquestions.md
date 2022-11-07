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

`map和forEach的区别：`
1.map的速度比forEach快
2.map会返回一个新的数组，不对原数组产生影响，forEach不产生新的数组，forEach返回undefined
3.map因为产生新的数组可以链式操作，forEach不能。
4.map里可以用return（return什么相当于把这一项变为什么），而forEach里用return不起作用，forEach不能用break，会直接报错。

`for循环中return break continue的区别`
return是使整个函数返回，后面的不管是循环内还是循环外的都不执行了。
break中断循环，但不会跳出函数，continue是跳过该次循环。

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

**`10.es6有哪些新特性`**
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

**`11.http的请求方式`**
get、post、put、delete、head、options、connect

**`12.a和b不通过第三个变量交换值`**
```js
let a=3,b=5
a = a + b
b = a - b
a = a - b
```

# 浏览器
**`1.跨域`**
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

**`2.事件轮询（event loop）`**
js是门非阻塞单线程语言，因为在最初js就是为和浏览器交互而诞生的。（如果js是多线程，我们在多个线程中处理dom就会有问题，当然引入读写锁可以解决）
js在执行的过程中会产生执行环境，这些执行环境会被顺序的加入执行栈中。如果遇到异步的代码，会被挂起并加入task队列（微任务队列、宏任务队列），一旦执行栈为空，event loop就会从task队列中拿出需要执行的代码放入执行栈中执行。

同步任务 --> 微任务 --> 宏任务

微任务：promise.then
宏任务：setTimeout I/O UI渲染

争议点：同步任务是宏任务吗？看了很多文章，解释各不相同

**`3.浏览器渲染机制`**
1.处理html并构建dom树。
2.处理css并构建cssom树。
3.将dom和cssom合并成一个渲染树。
4.根据渲染树来布局，计算每个节点的位置。
5.调用GPU绘制，合成图册，显示在屏幕上。

**`4.重绘（repaint）和回流（reflow）`**
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

# VUE
**`1.组件之间传值`**
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

**`2.生命周期`**
beforeCreat/created beforeMount/mounted beforeUpdate/undated beforeDestroy/destroy
beforeUnmount/unmount(vue3)

beforeCreate vue创建前，实例初始化之后，this指向创建的实例，data method均不能访问
created vue创建后，data method初始化导入之后，未挂载dom
beforeMount 模版已经编译好了，但未挂载到页面中
mounted 只要执行完mounted表示整个vue实例已经初始化完成了，此时组件已经脱离了创建阶段，进入运行阶段

父beforeCreate -> 父created -> 父beforeMount -> 子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted

父beforeUpdate -> 子beforeUpdate -> 子updated -> 父updated

父beforeDestroy -> 子beforeDestroy -> 子destroy -> 父destroy

**`3.vue2与vue3的区别`**
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
1.composition api。setup入口。setup是新增的生命周期函数，存在于beforeCreate和created之间。setup选项是一个接收props和content的函数。setup可以定义数据和方法，如果想在模版中使用，必须通过return返回，暴露给组件的其余部分（计算属性、方法、生命周期钩子等）及组件等模版。
2.往vue实例上挂载属性 app.config.globalProperties.$axios = xxx
3.template里可以有多个节点。

**`4.v-for循环中为什么一定要绑定key`**
给每个dom元素加上key作为唯一标识，diff算法可以正确的识别这个节点，使页面渲染更加迅速。
`key可以是哪些值，index为什么影响性能`
key需要不变的唯一的值比如id。如果index作为key，index易变化，diff算法就会认为dom发生变化，执行更新过程，造成不必要的性能开销。dom更新非常消耗性能。

**`5.v-for和v-if为什么不能同时使用`**
v-for的优先级高于v-if，每次渲染都会先循环再判断，带来性能方面的浪费。

**`6.v-show 和 v-if 有什么区别`**
v-show通过控制元素的样式display控制元素的显示与否，v-if控制元素渲染与否。v-show只编译一次，后面就是控制css，而v-if会不停的创建和销毁，故v-show性能更好一些。

**`7.computed watch`**
如果一个值依赖多个属性，用computed更方便。如果一个值变化后会引起一系列的操作或变化，用watch更方便。watch支持异步computed不支持。

**`8.vue data为什么是函数`**
data之所以是一个函数，是因为一个组件可能会多处调用，而每次调用就会执行data函数并返回新的数据对象，这样，就可以避免多处调用之间的数据污染。
