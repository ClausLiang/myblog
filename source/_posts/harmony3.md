---
title: Ability Kit（鸿蒙三）
date: 2024-08-08 13:52:42
tags: harmony
categories: harmony
---
<script type="text/javascript" src="/myblog/custom.js"></script>


# <font color=orange>Ability Kit 简介</font>
Ability Kit（程序框架服务）提供了应用程序开发和运行的`应用模型`，是系统为开发者提供的应用程序所需能力的抽象提炼，它提供了应用程序必备的组件和运行机制。

## 使用场景
应用的多Module开发：应用可通过不同类型的Module（HAP、HAR、HSP）来实现应用的功能开发。
其中，HAP用于实现应用的功能和特性，HAR与HSP用于实现代码和资源的共享。

应用内的交互：应用内的不同组件之间可以相互跳转。比如，在支付应用中，通过入口`UIAbility`组件启动收付款UIAbility组件。

应用间的交互：当前应用可以启动其他应用，来完成某个任务或操作。比如，启动浏览器应用来打开网站、启动文件应用来浏览或编辑文件等。

应用的跨设备流转：通过应用的跨端迁移和多端协同，获得更好的使用体验。比如，在平板上播放的视频，迁移到智慧屏继续播放。


# <font color=orange>应用模型</font>
应用模型是系统为开发者提供的应用程序所需能力的抽象提炼，它提供了应用程序必备的组件和运行机制。有了应用模型，开发者可以基于一套统一的模型进行应用开发，使应用开发更简单、高效。

## 应用模型的构成要素
1. 应用组件
2. 应用进程模型
3. 应用线程模型
4. 应用任务管理模型（仅对系统应用开放）
5. 应用配置文件

## 两种应用模型
### FA（Feature Ability）
从API 7开始支持的模型，已不再主推。
### Stage
从API 9开始新增的模型，是目前主推且会长期演进的模型。
在该模型中，由于提供了AbilityStage、WindowStage等类作为应用组件和Window窗口的“舞台”，因此称这种应用模型为Stage模型。

# <font color=orange>Stage模型开发概述</font>
![图片](/images/stage-24-8-23.png)

## AbilityStage
每个Entry类型或者Feature类型的HAP在运行期都有一个AbilityStage类实例，当HAP中的代码首次被加载到进程中的时候，系统会先创建AbilityStage实例。
## UIAbility组件和ExtensionAbility组件
Stage模型提供UIAbility和ExtensionAbility两种类型的组件，这两种组件都有具体的类承载，支持面向对象的开发方式。

UIAbility组件是一种包含UI的应用组件，主要用于和用户交互。例如，图库类应用可以在UIAbility组件中展示图片瀑布流，在用户选择某个图片后，在新的页面中展示图片的详细内容。同时用户可以通过返回键返回到瀑布流页面。UIAbility组件的生命周期只包含创建/销毁/前台/后台等状态，与显示相关的状态通过WindowStage的事件暴露给开发者。

ExtensionAbility组件是一种面向特定场景的应用组件。开发者并不直接从ExtensionAbility组件派生，而是需要使用ExtensionAbility组件的派生类。目前ExtensionAbility组件有用于卡片场景的FormExtensionAbility，用于输入法场景的InputMethodExtensionAbility，用于闲时任务场景的WorkSchedulerExtensionAbility等多种派生类，这些派生类都是基于特定场景提供的。例如，用户在桌面创建应用的卡片，需要应用开发者从FormExtensionAbility派生，实现其中的回调函数，并在配置文件中配置该能力。ExtensionAbility组件的派生类实例由用户触发创建，并由系统管理生命周期。在Stage模型上，三方应用开发者不能开发自定义服务，而需要根据自身的业务场景通过ExtensionAbility组件的派生类来实现。

## WindowStage
每个UIAbility实例都会与一个WindowStage类实例绑定，该类起到了应用进程内窗口管理器的作用。它包含一个主窗口。也就是说UIAbility实例通过WindowStage持有了一个主窗口，该主窗口为ArkUI提供了绘制区域。

## Context
在Stage模型上，Context及其派生类向开发者提供在运行期可以调用的各种资源和能力。UIAbility组件和各种ExtensionAbility组件的派生类都有各自不同的Context类，他们都继承自基类Context，但是各自又根据所属组件，提供不同的能力。

# <font color=orange>Stage模型应用组件</font>
## 应用/组件级配置
### 应用包名配置
AppScope目录下的app.json5里的bundleName字段
### 图标和标签
AppScope目录下的app.json5里的icon和label字段
### 版本声明
AppScope目录下的app.json5里的versionCode和versionName字段

## UIAbility组件

### 概念
UIAbility组件是Stage模型的核心组件，它包含UI，因此属于UI类组件。UIAbility组件通过WindowStage类来管理窗口，WindowStage类中包含一个主窗口，该窗口为ArkUI提供了绘制区域。UIAbility组件的派生类通过Context类提供的能力，实现与UI的交互。

### UIAbility的生命周期
`Create`
`WindowStageCreate`
`Foreground`
`Background`
`WindowStageDestroy`
`Destroy`

### UIAbility的启动模式
单实例模式(singleton)
多实例模式(multiton)
指定实例模式(specified)

### UIAbility组件基本用法
指定UIAbility的启动页面
获取UIAbility组件的上下文信息

### UIAbility组件与UI的数据同步
1.使用EventHub进行数据通信
2.使用AppStorage/LocalStorage进行数据同步

### 启动应用内的UIAbility组件
UIAbility是系统调度的最小单元。在设备内的功能模块之间跳转时，会涉及到启动特定的UIAbility，包括应用内的其他UIAbility、或者其他应用的UIAbility（例如启动三方支付UIAbility）。

## ExtensionAbility组件
ExtensionAbility组件是基于特定场景（例如服务卡片、输入法等）提供的应用组件，以便满足更多的使用场景。


## AbilityStage组件容器

## 应用上下文Context

## 信息传递载体Want

# <font color=orange>应用间跳转</font>
# <font color=orange>进程模型</font>
# <font color=orange>线程模型</font>


