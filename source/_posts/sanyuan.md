---
title: 我劝你不要乱写三元表达式
date: 2024-09-24 11:32:00
tags: 基础
categories: 基础
---
# 我劝你不要乱写三元表达式，你看看这容易读懂吗
代码是写给人看的，不是写给机器看的，机器只喜欢01，你会写01吗？
发现别的同事写的一段代码，实在是难以理解，如下：
```ts
item.renewalStartDate =
  item.orderStatus == 2
    ? item.payType == 3
      ? item.auditDate
        ? dayjs(item.auditDate).format('YYYY-MM-DD')
        : ''
      : item.payDate
      ? dayjs(item.payDate).format('YYYY-MM-DD')
      : ''
    : '';
```
你看看上面这段代码，它容易读懂吗？真是服了，写的啥啊?
给上面的代码加一下小括号，应该可以协助理解，经过仔细研究，改写成这样：
```ts
item.renewalStartDate =
  item.orderStatus == 2
    ? 
    (item.payType == 3 // ----------------------------第2层三元表达式
      ? 
      (
        item.auditDate // ----第3层三元表达式，这是一个小三元表达式
        ? dayjs(item.auditDate).format('YYYY-MM-DD')
        : ''
      )
      : 
      (
        item.payDate // ----第3层第2个三元表达式
        ? dayjs(item.payDate).format('YYYY-MM-DD')
        : ''
      )
    ) //---------------------------------------------2 end
    : '';
```
因为三元表达式的问好和冒号冒号都是成对出现的，可以改写。但是嵌套起来真的不好阅读。
其实不如写成if else的形式：
```ts
let res = ''
if(item.orderStatus == 2){
  if(item.payType == 3){
    if(item.auditDate){
      res = dayjs(item.auditDate).format('YYYY-MM-DD')
    } else {
      res = ''
    }  
  } else {
    if(item.payDate){
      res = dayjs(item.payDate).format('YYYY-MM-DD')
    } else {
      res = ''
    }
  } 
} else {
  res = ''
}
item.renewalStartDate = res
```

这样是不是清晰易懂了呢。不知道是我的阅读能力的问题，还是原先的代码写的太骚。
