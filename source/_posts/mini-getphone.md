---
title: 微信小程序获取用户手机号
date: 2020-09-12 18:08:29
tags: 微信小程序
categories: 小程序
---

有个前提是小程序得是企业帐号，个人帐号没有开放这个能力。<br>

用button组件获取手机号，比较简单，记录一下避免遗忘。
```html
<button open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber">获取手机号</button>
```
```js
getPhoneNumber(e) {// 这个回调返回的手机号是加密的，需要调后台解密
	
	// 先拿openid
	util.getOpenId().then(openId => {
        let params = {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            openid: openId,
            loginSysName: "APPLETS_HAOFANG"
        }

        if (e.detail && e.detail.encryptedData) {
        	// 利用openid，和两个密文参数调用后台接口，返回明文的手机号
            wx.$post("/user/api/wxDecryptData", params).then(res => {
                this.setData({
                	// 拿到手机号了
                    telPhone: res.phoneNumber
                })
            })
        }
    })
}

```
```js
// util.js
// 获取openid
function getOpenId() {
    return new Promise((resolve, reject) => {
    	// 利用wx.login拿code
        wx.login({
            success: res => {
                let params = {
                    loginSysName: "APPLETS_HAOFANG",
                    loginType: 7,
                    loginName: res.code,
                };
                // 利用code调后台返回openid
                wx.$post("/user/api/wxAuth", params).then((res) => {
                    if (!res) {
                        wx.showToast({
                            icon: 'none',
                            title: '获取不到openid',
                        })
                    }
                    resolve(res.openid)
                }).then(res => {
                    reject('')
                })
            },
            fail: err => {
                reject('')
            }
        })
    })

}
module.exports = {
    getOpenId: getOpenId
}
```
