---
title: 企业微信内嵌H5应用的方案
date: 2026-01-12 14:18:19
updated: 2026-01-12
tags: 企业微信
categories: h5
---
<script type="text/javascript" src="/myblog/custom.js"></script>

需求背景：作为服务商，为客户代开发企业微信内的应用。
服务商后台地址：https://open.work.weixin.qq.com/wwopen/developers/home
企业管理后台：https://work.weixin.qq.com/wework_admin/frame

# 创建应用
## 登录服务商后台地址，以服务商的身份创建一个`代开发应用模板`
![img](/images/qiwei1-2026-1-12.png)
## 创建好应用模版后，企业用户授权，就会在模板中生成一个`代开发应用`
![img](/images/qiwei2-2026-1-12.png)
## 进入应用的详情页修改了使用配置，就会将应用的应用状态修改为`存在未上线版本`
![img](/images/qiwei3-2026-1-12.png)
![img](/images/qiwei4-2026-1-12.png)
## 从`代开发应用上线`入口，将应用上线
![img](/images/qiwei5-2026-1-12.png)
将刚刚修改的应用上线：
![img](/images/qiwei6-2026-1-12.png)

# 开发应用
参考文档：https://developer.work.weixin.qq.com/document/path/96914（服务商代开发-客户端API-JSSDK）
## 安装
```bash
npm install @wecom/jssdk
```
## 接口鉴权
```js
import * as ww from '@wecom/jssdk'
// 企业身份注册
ww.register({
  corpId: 'ww7ca4776b2a70000',       // 必填，当前用户企业所属企业ID
  jsApiList: ['getExternalContact'], // 必填，需要使用的JSAPI列表
  getConfigSignature                 // 必填，根据url生成企业签名的回调函数
})

async function getConfigSignature(url) {
  // 根据 url 生成企业签名
  // 生成方法参考 https://developer.work.weixin.qq.com/document/14924
  // 调用后端接口，请求以下三个值
  return { timestamp, nonceStr, signature }
}
```
注意：
1. 在调用 JSAPI 前，需要先通过 ww.register 注册当前页面的身份信息
2. corpId可以通过应用配置的地址参数传入
```js
ww.register({
  corpId: route.query.corpId as string, // 必填，当前用户企业所属企业ID
  jsApiList: ['getExternalContact'], // 必填，需要使用的JSAPI列表
  getConfigSignature, // 必填，根据url生成企业签名的回调函数
})
```
3. 参数中的回调函数调用时机由 JSSDK 自行控制，开发者无需关心具体调用顺序
4. 用于生成签名的 jsapi_ticket 属于敏感信息，请在服务端完成签名操作

# 使用应用
在企业微信后台中从`服务商后台`切到`企业管理后台`
企业管理后台是每个企业管理自己内部员工及应用等的后台，注册了企业微信就有这个
服务商后台是可以为其他企业开发应用的服务商，需要再次注册。

## 在企业管理后台中管理应用
![img](/images/qiwei7-2026-1-12.png)
## 将应用配置到聊天工具栏中使用
1. 选择客户与上下游-聊天工具栏管理
![img](/images/qiwei8-2026-1-12.png)
2. 选择应用
![img](/images/qiwei9-2026-1-12.png)
3. 填写页面地址
![img](/images/qiwei10-2026-1-12.png)





