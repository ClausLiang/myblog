---
title: 鸿蒙app的数据管理（鸿蒙二）
date: 2024-08-08 10:09:42
tags: harmony
categories: harmony
---
<script type="text/javascript" src="/custom.js"></script>

# <font color=orange>状态管理</font>
`LocalStorage`
`AppStorage`
`PersistentStorage`
`Environment`

## AppStorage: 应用全局的UI状态存储
AppStorage是应用全局的UI状态存储，是和应用的进程绑定的，由UI框架在应用程序启动时创建，为应用程序UI状态属性提供中央存储。

### @StorageProp
当appstorage中的某个属性值被修改，可以将值传递过来，配合@watch监听可以修改其他值
```ts
@StorageProp(CACHE_USER_INFO) @Watch('onLoginChange') userInfo:string = ''

onLoginChange() {
  this.nickName = JSON.parse(this.userInfo).nickName
}
```
### @StorageLink
@StorageLink(key)是和AppStorage中key对应的属性建立双向数据同步：
1.本地修改发生，该修改会被写回AppStorage中；
2.AppStorage中的修改发生后，该修改会被同步到所有绑定AppStorage对应key的属性上，包括单向（@StorageProp和通过Prop创建的单向绑定变量）、双向（@StorageLink和通过Link创建的双向绑定变量）变量和其他实例（比如PersistentStorage）。

### 使用场景
AppStorage是单例，它的所有API都是静态的
存取:
```ts
AppStorage.setOrCreate('simpleProp', 121);
let value: number = AppStorage.get('PropA');
```

## LocalStorage: 页面级UI状态存储
通过@Entry装饰器接收的参数可以在页面内共享同一个LocalStorage实例。
不常用

## PersistentStorage 持久化存储UI状态
LocalStorage和AppStorage都是运行时的内存，但是在应用退出再次启动后，依然能保存选定的结果，是应用开发中十分常见的现象，这就需要用到PersistentStorage。

PersistentStorage是应用程序中的可选单例对象。此对象的作用是持久化存储选定的AppStorage属性，以确保这些属性在应用程序重新启动时的值与应用程序关闭时的值相同。

持久化数据是一个相对缓慢的操作，应用程序应避免以下情况：
1.持久化大型数据集。
2.持久化经常变化的变量。

PersistentStorage的持久化变量最好是小于2kb的数据，不要大量的数据持久化，因为PersistentStorage写入磁盘的操作是同步的，大量的数据本地化读写会同步在UI线程中执行，影响UI渲染性能。如果开发者需要存储大量的数据，建议使用数据库api。

### 使用场景
`从AppStorage中访问PersistentStorage初始化的属性`
1.初始化PersistentStorage：
```ts
PersistentStorage.persistProp('aProp', 47);
```
2.在AppStorage获取对应属性：
```ts
AppStorage.get<number>('aProp'); // returns 47
```
`通过PersistentStorage处理过的值，利用AppStorage.setOrCreate()改变后，会自动持久化。`

## Environment 设备环境查询
Environment的所有属性都是不可变的（即应用不可写入），所有的属性都是简单类型。
不常用

# <font color=orange>数据持久化</font>
`用户首选项Preferences`
`键值型数据库KV-Store`
`关系型数据库RelationalStore`

## 用户首选项Preferences
通常用于保存应用的配置信息。数据通过文本的形式保存在设备中，`应用使用过程中会将文本中的数据全量加载到内存中`，所以访问速度快、效率高，但不适合需要存储大量数据的场景。

Preferences不适合存放过多的数据，也不支持通过配置加密，适用的场景一般为应用保存用户的个性化设置（字体大小，是否开启夜间模式）等。

开发者可以将用户首选项持久化文件的内容加载到Preferences实例，`每个文件唯一对应到一个Preferences实例`

### 约束限制
1.首选项无法保证进程并发安全，会有文件损坏和数据丢失的风险，不支持在多进程场景下使用。
2.Key键为string类型，要求非空且长度不超过1024个字节。
3.如果Value值为string类型，请使用UTF-8编码格式，可以为空，不为空时长度不超过16 * 1024 * 1024个字节。
4.内存会随着存储数据量的增大而增大，所以存储的数据量应该是轻量级的，建议存储的数据不超过一万条，否则会在内存方面产生较大的开销。

### 开发步骤
首选项持久化功能的相关接口大部分为异步接口，异步接口均有callback和Promise两种返回形式。
```ts
import dataPreferences from '@ohos.data.preferences'; // 老API
// 获取preference对象实例 异步的
preference = await dataPreferences.getPreferences(context, 'preference1');
// 存储
await preference.put('key', 'value');
// 必须持久化，才会存储到文件中去
await preference.flush();
// 读取
await preference.get('key', 'defaultValue');
```
## 键值型数据库KV-Store
一种非关系型数据库

## 关系型数据库RelationalStore
一种关系型数据库，基于SQLite组件，适用于存储包含复杂关系数据的场景
