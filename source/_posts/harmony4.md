---
title: 应用程序包（鸿蒙四）
date: 2024-08-08 15:06:54
updated: 2024-08-08
tags: harmony
categories: harmony
---
<script type="text/javascript" src="/myblog/custom.js"></script>

# `HAP(Harmony Ability Package)`
一个HAP文件包含应用的所有内容，其文件后缀名为.hap。HAP包是由代码、资源、三方库及应用配置文件等打包生成的模块包。其主要分为两种类型：entry和feature。

entry：应用的主模块，作为应用的入口，提供了应用的基础功能。

feature：应用的动态特性模块，作为应用能力的扩展，可以根据用户的需求和设备类型进行`选择性安装`。

应用程序包可以只包含一个基础的entry包，也可以包含一个基础的entry包和多个功能性的feature包。

## 使用场景
`单HAP场景`
如果只包含UIAbility组件，无需使用ExtensionAbility组件，优先采用单HAP（即一个entry包）来实现应用开发。虽然一个HAP中可以包含一个或多个UIAbility组件，为了避免不必要的资源加载，推荐采用“一个UIAbility+多个页面”的方式。

`多HAP场景`
如果应用的功能比较复杂，需要使用ExtensionAbility组件，可以采用多HAP（即一个entry包+多个feature包）来实现应用开发，每个HAP中包含一个UIAbility组件或者一个ExtensionAbility组件。在这种场景下，可能会存在多个HAP引用相同的库文件，导致重复打包的问题。


# `HAR(Harmony Archive)`
静态共享包，可以包含代码、C++库、资源和配置文件。通过HAR可以实现多个模块或多个工程共享ArkUI组件、资源等相关代码。

## 使用场景
1. 作为二方库，发布到OHPM私仓，供公司内部其他应用使用。
2. 作为三方库，发布到OHPM中心仓，供其他应用使用。

## 约束限制
1. HAR不支持在设备上单独安装/运行，只能作为应用模块的依赖项被引用。
2. HAR不支持在配置文件中声明UIAbility组件与ExtensionAbility组件。
3. HAR不支持在配置文件中声明pages页面，但是可以包含pages页面，并通过命名路由的方式进行跳转。
4. HAR不支持引用AppScope目录中的资源。在编译构建时，AppScope中的内容不会打包到HAR中，因此会导致HAR资源引用失败。
5. HAR可以依赖其他HAR，但不支持循环依赖，也不支持依赖传递。

# `HSP(Harmony Shared Package)`
动态共享包，可以包含代码、C++库、资源和配置文件，通过HSP可以实现代码和资源的共享。

## 使用场景
1. 多个HAP/HSP共用的代码和资源放在同一个HSP中，可以提高代码、资源的可重用性和可维护性，同时编译打包时也只保留一份HSP代码和资源，能够有效控制应用包大小。
2. HSP在运行时按需加载，有助于提升应用性能。
3. 同一个组织内部的多个应用之间，可以使用集成态HSP实现代码和资源的共享。

## 约束限制
1. HSP不支持在设备上单独安装/运行，需要与依赖该HSP的HAP一起安装/运行。HSP的版本号必须与HAP版本号一致。
2. HSP不支持在配置文件中声明UIAbility组件与ExtensionAbility组件。
3. HSP可以依赖其他HAR或HSP，但不支持循环依赖，也不支持依赖传递。
4. 集成态HSP只支持Stage模型。
5. 集成态HSP需要API12及以上版本，使用标准化的OHMUrl格式。
