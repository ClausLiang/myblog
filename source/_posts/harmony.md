---
title: arkts入门 鸿蒙入门（鸿蒙一）
date: 2024-04-22 09:00:00
tags: harmony
categories: harmony
---
<script type="text/javascript" src="/myblog/custom.js"></script>

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
父组件传入子组件时，不能用this.aa，而要用$aa
`@Prop`
@Prop装饰的变量可以和父组件建立单向同步关系，@Prop装饰的变量是可变的，但修改不会同步回父组件。
只能修饰 `string` `number` `boolean`类型
`@watch`
用于监听状态变量的变化，当状态变量变化时，@watch的回调方法将被调用。
限制条件：
+ 建议避免无限循环。不要在@watch的回调方法里修改当前装饰的状态变量。
+ 不建议在@watch函数中调用async await。因为@watch设计的用途是为了快速的计算，异步行为可能会导致重新渲染速度的性能问题。

```ts
@component
struct TotalView{
  @Prop @watch('onCountUpdated') count: number;
  @State total: number = 0;
  // @watch回调
  onCountUpdated(propName: string):void{
    this.total += this.count;
  }
}
```

`@Observed` `@ObjectLink`
上述修饰器，仅能观察到第一层的变化，但是在实际应用开发中，应用会根据开发需要，封装自己的数据模型。对于多层嵌套的情况，比如二维数组，或者数组项class，或者class的属性是class，他们的第二层的属性变化是无法观察到的。这就引出了@Observed/@ObjectLink装饰器。
注意：
+ 单独使用@Observed是没有任何作用的，需要搭配@ObjectLink或者@Prop使用。

场景：
+ 嵌套对象
+ 对象数组
+ 二维数组


`@StorageProp`
当appstorage中的某个属性值被修改，可以将值传递过来。

`@Provide` `@Consume`
与后代组件双向同步，摆脱参数传递机制的束缚，实现跨层级传递。
@Provide和@Consume可以通过相同的变量名或者相同的变量别名绑定，变量类型必须相同。
```ts
// 通过相同的变量名绑定
@Provide a: number = 0;
@Consume a: number;

// 通过相同的变量别名绑定
@Provide('a') b: number = 0;
@Consume('a') c: number;
```


------ 其他 ------
`@CustomDialog`
自定义弹窗


### struct关键字
标记该对象为arkUI页面或组件。
### UI描述 build()
声明式的方法描述UI结构，所有的页面结构要写在build方法内。
### 内置组件 
目前了解到内置组件分为三类
1.布局组件：Row() Column()等
2.基础UI组件，如Text() Button()等
3.逻辑组件
1. ForEach()
```ts
ForEach(
  arr: Array,
  itemGenerator: (item: any, index: number) => void,
  keyGenerator?: (item: any, index: number) => string
)
```
说明: 
在ForEach循环渲染过程中，系统会为每个数组元素生成一个唯一且持久的键值，用于标识对应的组件。当这个键值变化时，ArkUI框架将视为该数组元素已被替换或修改，并会基于新的键值创建一个新的组件。
ForEach提供了一个名为keyGenerator的参数，这是一个函数，开发者可以通过它自定义键值的生成规则。如果缺省，默认是`(item,index)=>{return index +'_'+JSON.stringify(item)`
在项目中遇到一个问题是keyGenerator定义为`(item,index)=>item.id`，导致一直不刷新

2. LazyForEach()
LazyForEach从提供的数据源中按需迭代数据，并在每次迭代过程中创建相应的组件。当在滚动容器中使用了LazyForEach，框架会根据滚动容器可视区域按需创建组件，当组件滑出可视区域外时，框架会进行组件销毁回收以降低内存占用。
```ts
LazyForEach(
    dataSource: IDataSource,             // 需要进行数据迭代的数据源
    itemGenerator: (item: any, index: number) => void,  // 子组件生成函数
    keyGenerator?: (item: any, index: number) => string // 键值生成函数
): void
```
注意：该函数的数据源必须实现IDataSource接口，IDataSource接口定义了数据迭代过程中的一些回调函数。
```ts
interface IDataSource {
    totalCount(): number; // 获得数据总数
    getData(index: number): Object; // 获取索引值对应的数据
    registerDataChangeListener(listener: DataChangeListener): void; // 注册数据改变的监听器
    unregisterDataChangeListener(listener: DataChangeListener): void; // 注销数据改变的监听器
}
```
使用限制：
+ LazyForEach必须在容器组件内使用，仅有List、Grid、Swiper以及WaterFlow组件支持数据懒加载（可配置cachedCount属性，即只加载可视部分以及其前后少量数据用于缓冲），其他组件仍然是一次性加载所有的数据。


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


# <font color=orange>常用UI组件（基础组件）</font>
> 鸿蒙app的页面，跟web的标签页面可以说完全不同，它的页面由arkUI提供的鸿蒙原生组件组成。
## Image
```ts
Image(src:string | Resource | media.PixelMap)
```
resources文件夹下的图片都可以通过$r资源接口读取到并转换到Resource格式
```ts
Image($r('app.media.icon')).width(80)
```
80等效80vp，vp见下文单位
## Text Span
```ts
Text(string).fontSize(24)
```
Span只能作为Text组件的子组件显示文本内容
24等效24fp，fp见下文单位

### 超长处理
```ts
.textOverflow({ overflow: TextOverflow.Ellipsis })
.maxLines(1)
```
## TextInput TextArea
```ts
TextInput().type(InputType.Normal).maxLength(30)
TextInput().type(InputType.Password)
```
## Button
```ts
Button('ok',{type: ButtonType.Normal})
```
## Blank空白填充组件
仅当父组件为Row/Column/Flex时生效。

# <font color=orange>绘制组件</font>
## Line
直线绘制组件
```ts
Line().startPoint([0,0]).endPoint([100,0]).stroke('#D1D1D1').height(0.5)
```

# <font color=orange>组件通用属性</font>
## 尺寸设置
+ width height margin等类同web中的属性
+ layoutWeight(1) 父容器尺寸确定时，设置了layoutWeight属性的子元素与兄弟元素占主轴尺寸按照权重进行分配，忽略元素本身尺寸设置，表示自适应占满剩余空间。仅在Row/Column/Flex布局中生效。
+ constraintSize({maxWidth: 100, minwidth: 100, maxHeight: 100, minHeight: 100})设置约束尺寸，组件布局时，进行尺寸范围限制。constraintSize的优先级高于Width和Height。若设置的minWidth大于maxWidth，则minWidth生效，minHeight与maxHeight同理。

## 位置设置
+ position({x:x, y:y})
+ offset({x:x, y:y})

## 颜色渐变
### 线性渐变
```ts
.linearGradient({
  angle?: number | string, // 渐变角度，默认0，即从左到右。
  direction?: GradientDirection, // 渐变方向，设置angle后不生效。
  colors: Array<[ResourceColor, number]>, // 渐变颜色数组，number表示指定颜色所处的位置，取值范围为[0,1.0]，0表示需要设置渐变色的容器的开始处，1.0表示容器的结尾处。
  repeating?: boolean // 是否重复 默认false
})
```
示例：
```ts
Row(){}.height(10).width('100%')
.linearGradient({ 
  angle: 90,
  repeating: false,
  colors: [[0x1677FF, 0], [0xFFFFFF, 1]]
})
```
## 边框
```ts
.border({width: {left: 1}, color: '#1677FF'}) // 只设置左边框
```



# <font color=orange>单位</font>
## vp
vp：virtual pixels，虚拟像素是一种可灵活使用和缩放的单位，它与屏幕像素的关系是 1vp 约等于 160dpi 屏幕密度设备上的 1px。在不同密度的设备之间，HarmonyOS 会针对性的转换设备间对应的实际像素值。
蓝湖设计稿查看时调整为360dp

## fp
fp：font-size pixels，字体像素单位，其大小规范默认情况下与vp相同，但如果开发者在设置中修改了字体显示大小，就会在vp的基础上乘以scale系数。即默认情况下 1 fp = 1vp，如果设置了字体显示大小，则会根据实际情况自动设置 1fp = 1vp * scale。
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
.justifyContent()主轴方向的排列，主轴方向的参数是FlexAlign.Start/FlexAlign.Center/FlexAlign.End
.alignItems()交叉轴方向的排列，参数根据Row Column不同，Row:VerticalAlign.xx(top,bottom,center)，Column:HorizontalAlign.xx(start,end,center)
## Stack 层叠布局
由于鸿蒙的组件是并列的，所以排布只会依次排列，或从上到下从左到右，或其他方式，层叠布局提供了一种方式，允许组件可以叠在一起。这跟web的布局很不一样，web天然可以层叠，因为web的标签可以随意嵌套，div里可以套div。
## Flex
### 自适应拉伸
+ `flexBasis` 设置子组件在父容器主轴方向上的基准尺寸
  - 未设置width以及flexBasis值为100，宽度为100vp
  - flexBasis值为100，覆盖width的设置值，宽度为100vp
+ `flexGrow` 设置父容器的剩余空间分配给此属性所在组件的比例。用于“瓜分”父组件的剩余空间。
  - .flexGrow(2) .flexGrow(3) 第一个元素以及第二个元素以2:3分配剩下的100vp
+ `flexShrink` 当父容器空间不足时，子组件的压缩比例。
  - .flexShrink(3) .flexShrink(2) 第一个比第二个压缩的更狠
## List 列表
超出屏幕自动提供滚动功能。
### 添加分割线
```ts
List() {
  ...
}
.divider({
  strokeWidth: 1,
  startMargin: 60,
  endMargin: 10,
  color: '#ffe9f0f0'
})
```
### 事件
列表滑动时触发。触发该事件的条件：列表初始化时会触发一次，List`显示区域内`第一个子组件的索引值或后一个子组件的索引值有变化时会触发。
滚动时，就能拿到显示区域内的开始和结束的节点的索引。
```ts
.onScrollIndex((start,end)=>{
  // 判断list是不是滚动到了顶部
  this.isTop = start === 0
  // 判断list是不是滚动到了底部
  this.isBottom = end === this.viewModel.totalCount() - 1
})
```
## Grid GridItem
```ts
Grid(){

}.rowsTemplate('1fr 1fr 1fr')
.columnsTemplate('1fr 2fr 1fr')
```
### 设置子组件的所占行列数
```ts
GridItem() {
  Text(key)
    ...
}
.columnStart(1)
.columnEnd(2)
```
```ts
GridItem() {
  Text(key)
    ...
}
.rowStart(5)
.rowEnd(6)
```
### 设置主轴方向及网格数量
```ts
Grid() {
  ...
}
.maxCount(3)
.layoutDirection(GridDirection.Row)
```
### 设置行列间距
```ts
Grid() {
  ...
}
.columnsGap(10)
.rowsGap(15)
```
### 构建可滚动的网格布局
如果设置的是columnsTemplate，Grid的滚动方向为垂直方向；如果设置的是rowsTemplate，Grid的滚动方向为水平方向（横向）。
横向可滚动网格布局，只要设置rowsTemplate属性的值且不设置columnsTemplate属性
```ts
Grid() {}
.rowsTemplate('1fr 1fr') // 只设置rowsTemplate属性，当内容超出Grid区域时，可水平滚动。
.rowsGap(15)
```
## RelativeContainer
为采用相对布局的容器，支持容器内部的子元素设置相对位置关系。子元素支持指定兄弟元素作为锚点，也支持指定父容器作为锚点，基于锚点做相对位置布局。
```ts
RelativeContainer() {
  Row()
    .width(100)
    .height(100)
    // 添加其他属性
    .alignRules({
      top: { anchor: '__container__', align: VerticalAlign.Top },
      left: { anchor: '__container__', align: HorizontalAlign.Start }
    })
    .id("row1")

  Row()
    .width(100)
    .height(100)
    ...
    .alignRules({
      top: { anchor: '__container__', align: VerticalAlign.Top },
      right: { anchor: '__container__', align: HorizontalAlign.End }
    })
    .id("row2")
}
...
```
- RelativeContainer中不声明id属性，会不显示view
- RelativeContainer中两个子view不能相互依赖，显示位置
- ~~RelativeContainer中子view如果设置了依赖（alignRules），必须设置宽和高，否则不显示~~ 最新语法已无此要求

## Tabs
```ts
Tabs({barPosition: BarPosition.End}){
  TabContent(){
    Home()
  }.tabBar('首页')
  TabContent(){
    Mine()
  }.tabBar('我的')
}
.scrollable(false)
```
注意：
+ TabContent组件不支持设置通用宽度属性，其宽度默认撑满Tabs父组件。
+ TabContent组件不支持设置通用高度属性，其高度由Tabs父组件高度与TabBar组件高度决定。

### 底部导航、顶部导航
barPosition: BarPosition.End 底部导航
barPosition: BarPosition.Start  顶部导航
侧边导航：
```ts
Tabs({barPosition: BarPosition.Start}){
  TabContent(){
    Home()
  }.tabBar('首页')
  TabContent(){
    Mine()
  }.tabBar('我的')
}
.vertical(true) // 侧边导航
```
### 滚动导航栏
```ts
Tabs({barPosition: BarPosition.Start}){
  
}
.barMode(BarMode.Scrollable)
```
### 自定义导航栏
```ts
struct Index {
  @State currentIndex: number = 0
  tabsController: TabsController = new TabsController()
  build() {
    Tabs({barPosition: BarPosition.End, controller: this.tabsController}){
      TabContent(){
        Home()
      }.tabBar(this.TabBuilder(0,$r('app.media.icon_home_checked'), $r('app.media.icon_home'), '首页'))
      TabContent(){
        Mine()
      }.tabBar(this.TabBuilder(1,$r('app.media.icon_mine_checked'), $r('app.media.icon_mine'), '我的'))
    }
    .scrollable(false)
    .onChange((index) => {
      // 当scrollable是true时，左右滑动不联动底下的tab，需要手动赋值
      this.currentIndex = index
    })
  }

  @Builder
  TabBuilder(targetIndex: number, selectedImage: Resource, normalImage: Resource, title: string){
    Column(){
      Image(this.currentIndex == targetIndex? selectedImage: normalImage).size({width: 19, height: 19})
        .objectFit(ImageFit.Contain)
      Text(title).margin({top: 3}).fontSize(10).fontColor(this.currentIndex == targetIndex?'#1698CE' : '#6B6B6B')
    }.width('100%')
    .height(46)
    .justifyContent(FlexAlign.Center)
    .onClick(()=>{
      // 点击手动切换tabContent
      this.currentIndex = targetIndex
      this.tabsController.changeIndex(this.currentIndex)
    })
  }
}
```


# <font color=orange>弹窗</font>
## promptAction弹窗（该弹窗是promptAction的方法弹的，下面的是基于arkTs的声明式开发规范弹的）
```ts
import promptAction from '@ohos.promptAction'
promptAction.showToast({
  message: 'ni hao'
})
```
```ts
promptAction.shwoDialog({
  title: '提示',
  message: 'Message Info',
  buttons: [
    {
      text: 'button1',
      color: '#000000'
    },
    {
      text: 'btn2',
      color: '#000000'
    }
  ]
}).then(data => {
  console.info('click button: '+ data.index)
})
```
## AlertDialog 警告弹窗
```ts
AlertDialog.show({
  title: '提示',
  message: '是否删除该条数据？',
  primaryButton: {
    value: '取消',
    action: () => {

    }
  },
  secondaryButton: {
    value: '删除',
    fontColor: '#d94838',
    action: () => {

    }
  },
  cancel: () => { // 点击遮罩层关闭dialog时回调

  }
})
```
可以使用AlertDialog，构建只包含一个操作按钮的确认弹窗，使用confirm响应操作按钮回调。如下：
```ts
AlertDialog.show({
  title: '提示',
  message: '提示信息',
  confirm: {
    value: '我知道了',
    action: () => {

    }
  },
  cancel: () => { // 点击遮罩层关闭dialog时回调

  }
})
```
## TextPickerDialog 文本滑动选择弹窗
## DatePickerDialog 日期选择弹窗
## TimePickerDialog 时间选择弹窗
## 自定义弹窗
自定义弹窗的界面通过装饰器@CustomDialog定义的组件来实现，然后结合CustomDialogController来控制自定义弹窗的显示和隐藏。
```ts
let dialog = new CustomDialogController({
  builder: menu2(),
  offset: {dx: dx, dy: dy}, // 弹窗位置偏移
  customStyle: true, // 是否自定义弹窗样式，默认false
  autoCancel: true, // 是否允许点击遮罩层退出，默认true
  alignment: DialogAlignment.Bottom, // DialogAlignment.CenterEnd //弹窗在竖直方向的对齐方式
})
dialog.open()

// 定义弹窗结构 注意要写在struct外面，因为它自己就是个struct
@CustomDialog
struct menu2{
  dialogController: CustomDialogController // 必须要的
  build(){
    Column(){
      Row(){
        Image($r('app.media.icon_menu_edit')).width(14).height(14).margin({left: 14})
        Text('编辑').margin({left: 5})
      }.height(37)
      Row(){
        Image($r('app.media.icon_menu_delete')).width(14).height(14).margin({left: 14})
        Text('删除').margin({left: 5})
      }.height(37)
    }.backgroundColor('#fff').borderRadius(5).width(115).alignItems(HorizontalAlign.Start)
  }
}
```

# <font color=orange>项目情况</font>
## 页面的分层思想
app的页面要分层，每个新建的页面都是继承自封装的一个基础页面。基础页面中有一些基础能力，这样就不必在每个页面中都写。
而通常web页面不存在分层的思想，每个页面都是独立的，公共的能力可以封装公共组件，在每个页面中引入即可。页面之间相互独立，不存在都继承自一个基础页面。比较扁平。
