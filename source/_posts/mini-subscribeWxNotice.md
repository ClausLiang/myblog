---
title: 微信小程序如何给用户推送消息
date: 2025-11-20 14:31:08
updated: 2025-11-20
tags: 微信小程序
categories: 小程序
---

我记得前几年小程序是不能给用户推送消息的。须通过公众号给用户推消息。不知道是否是记错了。
但最近项目中有这种小程序给用户推消息的需求。发现小程序确实可以通过`wx.requestSubscribeMessage`拉起订阅消息的授权弹窗，在用户授权后，直接给用户推微信消息。记录一下。
代码如下：
```js
import {findCustomerPopTemplate,popSubscribeResult} from '../api/subscriptApi'
/**
 * @param {*} type 订阅场景
 * @param {*} busNo 业务编码如商品ID
 */
export const asyncSubscribeMessage = (type, busNo, extraVariableMap) => {
  const triggerAct = {
    1: '加入购物车',
    2: '订单详情',
    3: '提交订单',
    4: '支付成功',
    5: '企业信息',
    6: '切换企业身份',
    7: '提交售后申请（退货退款）',
    9: '提交售后申请（仅退款）',
    8: '填写退货信息'
  }[type]

  return new Promise(async (resolve) => {
    // 1.请求接口获取tmplIds
    // 根据type获取不同的模板ID
    const res = await findCustomerPopTemplate({triggerAct, busNo})
    console.log('消息模板tmplIds：', res.data)
    // 没有消息模板,直接返回
    if(res.data.length === 0){
      resolve()
      return
    }
    const tmplIds = res.data
    
    // 2.拉起订阅消息的授权弹窗
    wx.requestSubscribeMessage({
      tmplIds: tmplIds,
      success:(res)=>{
        // 存用户点了允许的模板，点了拒绝的模板
        const acceptResult = [],rejectResult = []
        // res是一个对象{'模板id1':'accept','模板id2':'reject','status':'xxx'}
        for(const key in res){
          const result = res[key]
           //成功
          if(result === 'accept'){
            acceptResult.push(key)
          }else if(result ==='reject'){
            //拒绝
            rejectResult.push(key)
          }
        }
        if(acceptResult.length > 0 || rejectResult.length > 0){
          // 3.将授权结果发送至服务器保存
          console.log('用户同意和拒绝的模板ID：',acceptResult,rejectResult)
          popSubscribeResult({
            busNo:busNo,//业务编号
            extraVariableMap: extraVariableMap,//额外变量 购物车用到这个
            openId:wx.getStorageSync('openId'),
            agreeTemplateIds:acceptResult,//成功
            rejectTemplateIds:rejectResult//失败
          })
          // 当满足条件后，如商品降价、活动上新等，后端可以直接调用微信服务给用户发送微信消息
          resolve()
          return
        }
        
        // 用户未同意任何模板
        resolve()

      },
      fail:(err) =>{
        console.log(err,'失败 ')
        resolve()
      }
    })
  })
}
```