---
title: pc端要做一个切换账号的功能？
date: 2023-11-20 09:40:12
updated: 2023-11-20
tags: 业务实现
categories: 业务实现
---
> 背景：因为老板有两个手机号，这两个手机号在系统中的权限不一样，所以产品考虑给老板做一个切换账号的功能。说实话这个功能在pc端可是不常见啊。不过这个功能不怎么复杂。

我简单记录一下这个功能是怎么实现的。

我们系统的token是放在cookie中的，为什么放这儿，是因为cookie可以跨子域，靠这个功能我们实现了单点登录。

实现思路：
1.我需要往`cookie`再存一个值`accountTokenList`来存放多个账号的token。
2.每当登录账号是我往`accountTokenList`的首位塞一个对象，该对象有phone、token等属性。
3.点击切换账号的列表时，把`accountTokenList`中对应账号的token拿出来存到cookie的token中。
4.等账号退出时，再把`accountTokenList`中对应的对象清除。

`带来一个问题：`
当同时打开多个页面或者多个系统时，我在页面A中切了账号，由账号1切换为账号2，然后又切换到B页面，这个时候B页面展示的数据还是之前账号1查出的数据（系统右上角展示的登录用户还是账号1），但是cookie里存的token已经修改为账号2的，再点击查询按钮查数据，新得到的数据已经是账号2的数据，但是页面之前查询的数据是账号1的数据，这样就会出现页面数据的错乱。

`解决办法：`
检测页面显示时判断token是否已经改变，如果改变，刷新页面。
```js
// 该逻辑是当浏览器页签切换时，判断cookie中存的token是否已经被别的系统修改，如果修改则刷新页面
// 写在全局的HimallUserInit只执行一次，Himall-User是用户token
const HimallUserInit = VueCookies.get('Himall-User');
// 监听浏览器页签显示隐藏
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible') {
    // 写在回调中的userToken会每次执行
    const userToken = VueCookies.get('Himall-User');
    if (HimallUserInit && userToken && userToken !== HimallUserInit)  {
      // 提示用户账号发生改变
      notification.open({ message: '系统提示', description: '您登录的账号已发生改变，系统将为您自动切换', placement: 'topRight' })
      setTimeout(() => {
        location.href=location.pathname
      }, 1500)
    }
  }
})
```
