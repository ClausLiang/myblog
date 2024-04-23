---
title: arkts入门 鸿蒙入门
date: 2024-04-09 14:44:03
tags: harmony
categories: harmony
---
<script type="text/javascript" src="/custom.js"></script>

# arkTS
## 概念
arkts是在ts上拓展了`声明式UI`、`状态管理`等相应能力的ts超集

## 基本语法
### 装饰器
> 装饰类、结构、方法和变量，赋予其特殊含义。

`@Component`
自定义组件，可重用的UI单元
`@Entry`
页面的默认入口组建，一个页面有且只有一个@entry
`@Builder`
自定义构建函数
`@BuilderParam`
引用@Builder函数
`@Styles`
定义组件重用样式
`@Extend`
定义扩展组件样式

------ 状态管理 ------
`@State`
装饰的变量值发生改变时会触发自定义组件的UI界面自动刷新
`@Link`
@Link装饰的变量和父组件构建双向同步关系的状态变量，父组件会接受来自@Link装饰的变量的修改的同步，父组件的更新也会同步给@Link装饰的变量。
`@Prop`
@Prop装饰的变量可以和父组件建立单向同步关系，@Prop装饰的变量是可变的，但修改不会同步回父组件。



### struct关键字
标记该对象为arkUI
### UI描述 build()
声明式的方法描述UI结构
### 内置组件 Row() Text() ForEach()
```ts
ForEach(arry,(item,index)=>{

},(item,index)=>item.id)
```

### 属性方法 .width()

## 生命周期
先分清两个概念
`自定义组件`
@Component装饰的UI单元，可以组合多个系统组件实现UI的复用，可以调用组件的生命周期。
`页面`
即应用的UI页面。可以由一个或者多个自定义组件组成。@entry装饰的自定义组件为页面的入口组件，即页面的根节点，一个页面有且仅能有一个@Entry。只有被@Entry装饰的组件才可以调用页面的生命周期。
### 页面的生命周期
`onPageShow()` 页面显示
`onPageHide()` 页面隐藏
`onBackPress()` 返回
```ts
// 默认return false由系统自动返回
onBackPress(){
  return false;
}
```
### 组件的生命周期
`aboutToAppear()`自定义组件的实例创建后，build函数执行前。
`aboutToDisappear()`在自定义组件析构销毁之前执行

### 生命周期顺序
aboutToAppear -> build -> onPageShow -> onBackPress -> onPageHide -> aboutToDisappear

# 应用程序框架
## 应用程序入口 UIAbility
> 参考：https://developer.huawei.com/consumer/cn/training/course/slightMooc/C101667310940295021

### 概述

创建一个工程，例如命名为MyApplication。

1.在src/main/ets/entryability目录下，初始会生成一个UIAbility文件EntryAbility.ts。可以在EntryAbility.ts文件中根据业务需要实现UIAbility的生命周期回调内容。

2.在src/main/ets/pages目录下，会生成一个Index页面。这也是基于UIAbility实现的应用的入口页面。可以在Index页面中根据业务需要实现入口页面的功能。

3.在src/main/ets/pages目录下，右键New->Page，新建一个Second页面，用于实现页面间的跳转和数据传递。
### UIAbility内页面跳转和数据传递
#### 页面跳转和参数接收
```ts
import router from '@ohos.router';
```
API9及以上，router.pushUrl()方法新增了mode参数，可以将mode参数配置为router.RouterMode.Single单实例模式和router.RouterMode.Standard多实例模式。
mode默认是standard
在单实例模式下：如果目标页面的url在页面栈中已经存在同url页面，离栈顶最近同url页面会被移动到栈顶，移动后的页面为新建页，原来的页面仍然存在栈中，页面栈的元素数量不变；如果目标页面的url在页面栈中不存在同url页面，按多实例模式跳转，页面栈的元素数量会加1。
```ts
router.pushUrl({
  url: 'pages/Second',
  params: {
    src: 'Index页面传来的数据',
  }
}, router.RouterMode.Single)
```

`接收参数`
通过调用router.getParams()方法获取Index页面传递过来的自定义参数
```ts
import router from '@ohos.router';

@Entry
@Component
struct Second {
  @State src: string = (router.getParams() as Record<string, string>)['src'];
  // 页面刷新展示
  // ...
}
```
#### 页面返回和参数接收
### UIAbility的生命周期
`Create`
`WindowStageCreate`
`Foreground`
`Background`
`WindowStageDestroy`
`Destroy`

### UIAbility的启动模式
单实例模式
多实例模式
指定实例模式