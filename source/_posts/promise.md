---
title: promise的简单用法
date: 2019-05-21 00:37:10
tags: 基础
categories: 基础
---
<script type="text/javascript" src="/custom.js"></script>

在es6中，promise终于成为了原生对象，可以直接使用。<br>
promise是异步编程的一种解决方案。解决了异步回调多层嵌套的问题。<br>
# <font color=red>promise状态的理解</font>
用new Promise实例化的promise对象有三个状态：resolved(fulfilled) rejected pending

# <font color=red>promise的简单用法</font>

```js
// 封装一个方法run_a，当Math.random()取的值小于0.5时执行resolve，否则执行reject
var run_a  = function () {
    var _promise = new Promise(function(resolve, reject){
        // 模拟异步
        setTimeout(function () {
            var rand = Math.random()
            if (rand < 0.5) {
                resolve('resole_a ' + rand)
            } else {
                reject('reject_a ' + rand)
            }
        }, 300)
    })
    return _promise
}
// 封装一个方法run_b，当Math.random()取的值小于0.5时执行resolve，否则执行reject
var run_b  = function () {
    var _promise = new Promise(function(resolve, reject){
        setTimeout(function () {
            var rand = Math.random()
            if (rand < 0.5) {
                resolve('resole_b ' + rand)
            } else {
                reject('reject_b ' + rand)
            }
        }, 300)
    })
    return _promise
}

run_a().then(function (data) {
    console.log('第一次产生的值：', data) // 第一次resolve才能进then,否则直接进catch
    return run_b() // 第一次resolve才能执行第二次，并且第二次的值必须继续.then才能获得。
    // 此处必须return出来才能链式调用
}).then(function (data) {
    console.log('第二次产生的值：', data)
}).catch(function (e) {
    console.log('失败：', e)
})
```
# <font color=red>promise的一些方法</font>

## axios是promise的实现版本，axios执行后返回一个promise对象

```js
axios.post('xxx').then(res => {
    return axios.post('bbb', {name: res.name})
}).then(res => {
    console.log(res)
})
```

## promise的其他方法all, race

```js
Promise.all([
    axios.get('xxx'),
    axios.get('aaa')
]).then().catch(error=>{
    
})
```

promise.all([p1,p2,p3])当p1,p2,p3的状态都变成resolved时，promise的状态才会变成resolved<br>
promise.race([p1,p2,p3])竞速方法，p1,p2,p3只要有一个改变状态，promise就会立即变成相同的状态并执行对应的回调。


```js
var run_c  = function () {
    var _promise = new Promise(function(resolve, reject){
        setTimeout(function () {
            var rand = Math.random()
            if (rand < 0.5) {
                resolve('c_ok ' + rand)
            } else {
                reject('c_error ' + rand)
            }
        }, 1000)
    })
    return _promise
}
var run_d  = function () {
    var _promise = new Promise(function(resolve, reject){
        setTimeout(function () {
            var rand = Math.random()
            if (rand < 0.5) {
                resolve('d_ok ' + rand)
            } else {
                reject('d_error ' + rand)
            }
        }, 1000)
    })
    return _promise
}
Promise.all([run_c(), run_d()]).then(function (data) {
    console.log('全部执行完：', data)
}, function (e) {
    console.log('promise.all有异常：', e)
})
```

