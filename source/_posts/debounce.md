---
title: js消抖（debounce）与节流（throttle）
date: 2020-07-15 20:59:13
tags:
    - 消抖节流
categories: 基础
---

**节流**：如果一个函数持续的频繁的触发，那么让他在一定的时间间隔后再触发。
感觉就像是过安检，人多的时候隔一段时间放进去几个。

**消抖**：如果一个函数持续的触发，那么只在它结束过一段时间只执行一次。
像是两个人的对话，A在不停的balabala，如果他说话有停顿，但是停顿的时间不够长，就认为他没有说完，当停顿的时间足够长才认为A说完了，然后B开始回答。
输入联想是消抖，当输入停顿时间足够长再去查询，如果连续输入（停顿时间短）就不去调接口。

消抖和节流都是某个行为持续的触发，不同之处在于是要优化到减少他的执行次数还是优化到只执行一次。

```
html:

消抖<input onkeyup="keyupHandle(event)">
节流<input onkeyup="keyupHandle2(event)">
```
```
js:

function ajax(aa) {
    console.log('-----' + aa)
}
var debounceHandle = debounce(ajax, 1000) // 消抖 间隔时间不足1s就不会触发
var throttleHandle = throttle(ajax, 1000) // 节流 每隔1s触发一次
var timer

function keyupHandle(e) {
    debounceHandle(e.target.value)
}

function keyupHandle2(e) {
    throttleHandle(e.target.value)
}


function debounce(fn, delay) {
    let timer = null;

    return function() {
        let args = arguments
        clearTimeout(timer);

        timer = setTimeout(function() {
            fn(args[0]);
        }, delay);
        console.log(timer)
    }
}


function throttle(fn, delay) {
    let args = arguments,
        context = this,
        timer = null,
        remaining = 0,
        previous = new Date();

    return function(ttt) {
        let now = new Date();
        let args = arguments
        remaining = now - previous;

        if (remaining >= delay) {
            if (timer) {
                clearTimeout(timer);
            }

            fn.apply(context, args);
            previous = now;
        } else {
            if (!timer) {
                timer = setTimeout(function() {
                    fn.apply(context, args);
                    previous = new Date();
                }, delay - remaining);
            }
        }
    };
}
```

