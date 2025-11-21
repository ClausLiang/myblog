---
title: H5微信内分享自定义标题图标
date: 2021-07-06 14:43:48
updated: 2021-07-06
tags: h5
categories: h5
---

以下两图一个是默认的分享样式，一个是自定义的分享样式
![morende.jpg](/images/wechatshare-2021-7-6.png)

![zidingyide.jpg](/images/wechatshare2-2021-7-6.png)
>**在微信环境中分享一个H5，分享出来的卡片默认是没有文案和图标的。若想添加文案和图标需要借助微信的js-sdk**
## 1.公众号的设置
首先得有一个公众号，这个是前提。微信内分享的这个H5页面可以和公众号没有关系，但是自定义图标的这个功能相当于借助了公众号的能力。
### 1.1登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”
按照提示下载校验文件放置到H5的域名根目录下，可在浏览器访问校验文件验证成功与否。
## 2.引入js文件
`<script></script>标签引入js文件即可`
## 3.通过config接口注入权限验证配置
主要参照[微信js-sdk说明文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#0)

```js
wx.config({
  debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  appId: '', // 必填，公众号的唯一标识
  timestamp: , // 必填，生成签名的时间戳
  nonceStr: '', // 必填，生成签名的随机串
  signature: '',// 必填，签名
  jsApiList: [] // 必填，需要使用的JS接口列表
});
```
timestamp、nonceStr、signature为请求自己公司后端接口返回的值，可以让后端同学看文档中签名算法的相关部分。这样做的原因是调用微信的js接口传的参要与后端调微信接口的参数一致。
## 4.通过ready接口处理成功验证

```js
wx.ready(function(){
  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
  // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
  // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
});
```
## 5.通过error接口处理失败验证

```js
wx.error(function(res){
  // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，
  // 也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
});
```
## 6.具体的功能
### 6.1分享好友（微信好友或qq好友）

```js
wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
  wx.updateAppMessageShareData({ 
    title: '', // 分享标题
    desc: '', // 分享描述
    link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: '', // 分享图标
    success: function () {
      // 设置成功
    }
  })
}); 
```
### 6.2分享到朋友圈或qq空间

```js
wx.ready(function () {      //需在用户可能点击分享按钮前就先调用
  wx.updateTimelineShareData({ 
    title: '', // 分享标题
    link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: '', // 分享图标
    success: function () {
      // 设置成功
    }
  })
}); 
```
上一个例子吧：
vue-cli搭建的H5页面相关功能统一写在main.js
```js
// 路由名
let ruleName = location.href.split('#/')[1].split('?')[0];

const shareInfoMap = {
    usedCar: {
        title: '好生活二手车特惠活动',
        desc: '好生活好车特惠，高价置换回购，点击报名，免费评估。',
        icon: 'https://cdn.lifeat.cn/webappGroup/usedcar-shareIcon.png',
    },
    default: {
        title: '',
        desc: window.location.href,
        icon: 'https://cdn.lifeat.cn/webappgroup/betterLifelogo.png',
    },

}

let infoMap = shareInfoMap[ruleName] ? shareInfoMap[ruleName] : shareInfoMap['default'];
// 这个判断后加的为了减少请求次数，据后端说有次数限制，当需要分享的页面才去请求接口。
if (shareInfoMap[ruleName]) {
    // request 是封装的请求
    request.post('/wxmp/sign/jsSdk', {
        url: location.href,
    }).then(res => {
        let { timestamp, nonceStr, signature, appId } = res;
        wx.config({
            debug: false,
            appId,
            timestamp,
            nonceStr,
            signature,
            jsApiList: ['updateAppMessageShareData','updateTimelineShareData']
        });
        wx.error(function (errres) {
            console.info(errres)
        })
        wx.ready(() => {   //需在用户可能点击分享按钮前就先调用
            console.info('ready')
            //分享朋友
            wx.updateAppMessageShareData({
                title: infoMap.title, // 分享标题
                desc: infoMap.desc, // 分享描述
                link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: infoMap.icon, // 分享图标
                success: function () {
                    console.info("成功")
                    // 设置成功
                },
                fail: function (erres) {
                    console.info('失败：', erres)
                }
            })
            //分享到 朋友圈
            wx.updateTimelineShareData({
                title: infoMap.title, // 分享标题
                link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: infoMap.icon, // 分享图标
                success: function () {
                    console.info("成功")
                    // 设置成功
                },
                fail: function (erres) {
                    console.info('失败：', erres)
                }
            })
        });
    }).catch(err => {
        console.info('err:', err)
    })
}
```
