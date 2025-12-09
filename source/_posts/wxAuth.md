---
title: 微信扫码授权场景记录
date: 2025-11-21 16:48:56
updated: 2025-12-09
tags: 微信
categories: 业务实现
---

<script type="text/javascript" src="/myblog/custom.js"></script>
# 正常的逻辑
## 步骤
1. 请求后端接口，返回一个微信的`链接`，window.location.href=链接，跳转到该链接。
示例：
`https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=wxb22e2f52075766d4&pre_auth_code=preauthcode@@@nWi_gMNZMPCaTlkL-wgsz3MdQtdQWmOeaOccoLrKY9fU3hDLpwGM1gLJQGszUEeniQn6NGeYNhoiNXJ18bQuMA&auth_type=2&redirect_uri=`

2. 用户扫码以后手机上点了确定，微信的这个链接就会跳转回redirect_uri
3. 在初始化的时候重新请求接口判断店铺状态，或是用微信返回的auth_code、expires_in参数调接口

## 提前的配置
授权后回调页域名`redirect_uri`需要在微信平台里提前配，并且须与确认授权入口页所在域名相同，

# 我们的特殊场景
而我们的业务场景是授权入口页面域名不固定，每个店铺一个域名，所以得在一个统一的域名下发起授权，回调页域名也得是一个统一的域名。

所以我们的业务场景就改造成如下：
1. 店铺后台请求接口，返回一个微信的`链接`，在固定域名的官网里写一个页面`wxAuthorization.vue`承接跳微信的入口，通过location.href先跳到官网，`https://官网域名/#/wxAuthorization?wxUrl=`+`链接`+`&shopPath=`+`店铺域名`
2. 在官网`wxAuthorization.vue`文件里接收`链接`参数，并且拼接`redirect_uri`的值，`链接`+`https://官网域名/wxBack/`+`店铺域名`，location.href跳转到该链接。
3. 用户扫码以后手机上点了确定，微信的这个链接就会跳转回redirect_uri，这个时候redirect_uri是`官网域名`+`/wxBack/`+`店铺域名`
4. 与运维约定好，将wxBack的请求通过nginx转发到相应店铺域名下。
5. 在对应域名店铺下的页面里，初始化请求接口判断店铺授权状态，或者用微信返回的auth_code、expires_in参数调接口
