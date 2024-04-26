---
title: arkts入门 鸿蒙入门
date: 2024-04-22 09:00:00
tags: harmony
categories: harmony
---
<script type="text/javascript" src="/custom.js"></script>

> 写在前面：本人是一个web工程师，现在开始学习鸿蒙，所以可能会带有一些web的惯性思维，和从安卓开发转到鸿蒙的开发思维习惯会有差异。这是在沟通中发现的。安卓能转鸿蒙，web也能转鸿蒙，各有各的优势。本笔记会持续更新...
# <font color=orange>认识arkTS</font>
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
标记该对象为arkUI页面或组件。
### UI描述 build()
声明式的方法描述UI结构，所有的页面结构要写在build方法内。
### 内置组件 
目前了解到内置组件分为三类
1.布局组件：Row() Column()等
2.基础UI组件，如Text() Button()等
3.逻辑组件，如ForEach()
```ts
ForEach(arry,(item,index)=>{

},(item,index)=>item.id)
```

### 属性方法 .width() .onClick()
鸿蒙是面向对象的语法，所有的样式或者事件，都是通过调用方法实现。
如：
给一个UI组件一定的宽度`Text().width('100vp')`
给一个按钮一个点击事件`Button().onClick((event: ClickEvent)=>{})`

## 组件生命周期
先分清两个概念
1.`自定义组件`
@Component装饰的UI单元，可以组合多个系统组件实现UI的复用，可以调用组件的生命周期。
2.`页面`
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

# <font color=orange>应用程序框架</font>
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

# <font color=orange>常用UI组件</font>
> 鸿蒙app的页面，跟web的标签页面可以说完全不同，它的页面由arkUI提供的鸿蒙原生组件组成。
## Image
```ts
Image(src:string | Resource | media.PixelMap)
```
resources文件夹下的图片都可以通过$r资源接口读取到并转换到Resource格式
```ts
Image($r('app.media.icon')).width(80)
```
80等效80vp，vp：virtual pixels，虚拟像素也是一种可灵活使用和缩放的单位，它与屏幕像素的关系是 1vp 约等于 160dpi 屏幕密度设备上的 1px。在不同密度的设备之间，HarmonyOS 会针对性的转换设备间对应的实际像素值。
## Text Span
```ts
Text(string).fontSize(24)
```
Span只能作为Text组件的子组件显示文本内容
24等效24fp，fp：font-size pixels，字体像素单位，其大小规范默认情况下与vp相同，但如果开发者在设置中修改了字体显示大小，就会在vp的基础上乘以scale系数。即默认情况下 1 fp = 1vp，如果设置了字体显示大小，则会根据实际情况自动设置 1fp = 1vp * scale。
## TextInput TextArea
```ts
TextInput().type(InputType.Normal).maxLength(30)
TextInput().type(InputType.Password)
```
## Button
```ts
Button('ok',{type: ButtonType.Normal})
```
# <font color=orange>布局容器</font>
> web的页面是从上到下由块级元素依次组成。
要抛弃web思想，鸿蒙页面的布局，由布局容器包住页面组件构成。
## 线性容器 Row Column
这两容器可以相互嵌套，row可以嵌套column，column也可以嵌套row
```ts
Column({ space: 20 }) {
  ...
}
```
.justifyContent()主轴方向的排列
.alignItems()交叉轴方向的排列
## Stack 层叠布局
由于鸿蒙的组件是并列的，所以排布只会依次排列，或从上到下从左到右，或其他方式，层叠布局提供了一种方式，允许组件可以叠在一起。这跟web的布局很不一样，web天然可以层叠，因为web的标签可以随意嵌套，div里可以套div。
## Flex
## List 列表
## Grid

# <font color=orange>项目情况</font>
## 页面的分层思想
通常web前端的面向对象的思想比较薄弱。所以刚开始阅读项目，不太理解同事杰哥搭建的鸿蒙项目架子，杰说app的页面要分层，每个新建的页面都是继承自封装的一个基础页面。基础页面中有一些基础能力，这样就不必在每个页面中都写。
而web页面不存在分层的思想，每个页面都是独立的，公共的能力可以封装公共组件，在每个页面中引入即可。页面之间相互独立，不存在都继承自一个基础页面。比较扁平。