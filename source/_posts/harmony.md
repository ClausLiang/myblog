---
title: arkts入门
date: 2024-04-09 14:44:03
tags: harmony
categories: harmony
---
<script type="text/javascript" src="/custom.js"></script>

# 概念
arkts是在ts上拓展了`声明式UI`、`状态管理`等相应能力的ts超集

# 基本语法
## 装饰器
装饰类、结构、方法和变量，赋予其特殊含义。
### @component
自定义组件，可重用的UI单元
### @entry
页面的默认入口组建，一个页面有且只有一个@entry
### @state
装饰的变量值发生改变时会触发自定义组件的UI界面自动刷新
### @link


## struct
组建的数据结构
## UI描述 build()
声明式的方法描述UI结构
## 内置组建 Row() Text() ForEach()
```ts
ForEach(arry,(item,index)=>{

},(item,index)=>item.id)
```

## 属性方法 .width()

## 自定义组件的生命周期
### aboutToAppear()
### onPageShow() 页面显示
### onBackPress() 返回
```ts
// 默认return false由系统自动返回
onBackPress(){
  return false;
}
```
### onPageHide() 程序后台时，页面隐藏
### aboutToDisappear()

