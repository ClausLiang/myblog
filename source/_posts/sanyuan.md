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
让通义灵码看了一下，给出这样的解释：
- 当orderStatus == 2:
  - 当payType == 3 且 auditDate 有值, 设置renewalStartDate 为 auditDate
  - 否则 payDate 有值, 设置renewalStartDate 为 payDate
  - 否则 ''
- 否则 ''


如果是这个意思，那不如写成if else的形式：
```ts
let res = ''
if(item.orderStatus == 2){
  if(item.payType == 3 && item.auditDate){
    res = dayjs(item.auditDate).format('YYYY-MM-DD')
  } else if(item.payDate) {
    res = dayjs(item.payDate).format('YYYY-MM-DD')
  } else {
    res = ''
  }
} else {
  res = ''
}
item.renewalStartDate = res
```
这样是不是清晰易懂了呢。不知道是我的阅读能力的问题，还是原先的代码写的太骚。
