---
title: Ability Kit（鸿蒙三）
date: 2024-08-08 13:52:42
tags: harmony
categories: harmony
---
<script type="text/javascript" src="/custom.js"></script>

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

# <font color=orange>Stage模型开发</font>
