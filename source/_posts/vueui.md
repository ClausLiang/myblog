---
title: 创建一个vue的UI组件库
date: 2021-11-23 17:35:00
tags:
    - ui库
    - vue
categories: 进阶
---
<script type="text/javascript" src="/custom.js"></script>

# 为什么要创建组件库
1.大量重复或相似的业务代码重复code浪费了时间人力，如果把这些业务代码封装成组件则可以解决如上问题。
2.统一了代码规范，统一了产品风格。
3.沉淀自己的技术，提升技术水平。

# 怎么做
## 创建一个vue项目
我习惯用界面配置的方式，用vue ui命令创建一个vue项目。具体步骤略。创建完的目录结构为
```
> packages // 新增packages目录用于存放组件
> src // 用作示例demo
> public
package.json
README.md
vue.config.js
...

```
## 新增vue.config.js
vue cli3 提供一个可选的 vue.config.js 配置文件。这个文件存在则他会被自动加载，所有的对项目和webpack的配置，都在这个文件中。修改vue.config.js的目的有两个：1.修改项目的入口，实现对src目录的编译，使demo可以访问。2.提供对packages目录的编译构建处理。
```js
module.exports = {
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html'
        }
    },
    chainWebpack: config => {
        // packages和examples目录需要加入编译
        config.module
            .rule('js')
            .include.add(/packages/)
            .end()
            .use('babel')
            .loader('babel-loader')
            .tap(options => {
                // 修改它的选项...
                return options;
            });
    }
}

```
## 编写packages组件库

> 安装 Vue.js 插件。如果插件是一个对象，它必须暴露一个 `install` 方法。如果它本身是一个函数，它将被视为安装方法。(`核心知识`)

该处创建了一个clColorCard组件作为示例，目录结构为：
```
> packages
  > clColorCard // 单个组件
    > src
     index.vue
    index.js
  index.js // 整合所有组件
```
### clColorCard/src/index.vue组件的内容
```js
<template>
    <div></div>
</template>
<script>
    export default{
        name: 'clColorCard', // 必须，这个name就是组件的标签 <cl-color-card/>
    }
</script>

```
### clColorCard/index.js
```js
import clColorCard from './src'
// 提供 install 安装方法，供按需引入
clColorCard.install = function(Vue){
    Vue.component(clColorCard.name, clColorCard)
}

export default clColorCard
```
### packages/index.js整合所有组件，并对整个组件库进行导出
```js
import clColorCard from './clColorCard';

const components = [
    clColorCard
]

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue) {
    // 判断是否安装
    if (install.installed) {
        return
    }
    // 遍历注册全局组件
    components.map((component) => {
        Vue.component(component.name, component)
    })
}

// 判断是否是直接引入文件 CDN引用
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

// 暴露install方法
// 导出的对象必须具有 install，才能被 createApp(App).use() 方法安装
export default install

export {
    // 以下是具体的组件列表
    clColorCard
}
```
至此，构建组件的环境准备好了

## 打包
### package.json新增打包命令
```
"lib": "vue-cli-service build --target lib --name index --dest lib packages/index.js"
```
`--target`: 构建目标，默认为应用模式。这里修改为 `lib` 启用库模式。<br>
`--dest` : 输出目录，默认 `dist`。这里我们改成 `lib`<br>
`[entry]`: 最后一个参数为入口文件，默认为 `src/App.vue`。这里我们指定编译 `packages/` 组件库目录。
> 在 vue cil3 库模式中，Vue 是 *外置的*。这意味着包中不会有 Vue，即便你在代码中导入了 Vue。如果这个库会通过一个打包器使用，它将尝试通过打包器以依赖的方式加载 Vue；否则就会回退到一个全局的 `Vue` 变量。
### 打包
```
yarn lib
```
## 发布到npm
### 修改package.json
1.`name`: 包名，该名字是唯一的。可在 npm 官网搜索名字。<br>
2.`version`: 版本号，每次发布至 npm 需要修改版本号，不能和历史版本号相同。<br>
3.`private`: 是否私有，需要修改为 false 才能发布到 npm<br>
4.`main`: 入口文件，该字段需指向我们最终编译后的包文件。<br>
5.`description`: 描述。<br>
6.`keyword`:关键字，以空格分离希望用户最终搜索的词。<br>
7.`author`:作者。<br>
参考：
```
{
  "name": "claus-ui",
  "version": "0.0.1",
  "private": false,
  "main": "lib/index.umd.min.js",
  "description": "claus-ui",
  "keyword": "claus-ui",
  "author": "clausliang",
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "lib": "vue-cli-service build --target lib --name index --dest lib packages/index.js"
  }
}
```
### 添加 `.npmignore` 文件
发布时，只有编译后的 `lib` 目录、package.json、README.md才需要被发布。所以通过配置`.npmignore`文件忽略不需要提交的目录和文件。
```
# 忽略目录
node_modules
dist/
public/
src/

# 忽略文件
.DS_Store
vue.config.js
babel.config.js 
*.map
.browserslistrc
.editorconfig
.eslintrc.js


# local env files
.env.local
.env.*.local

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```
### 发布
首先需要在 npm 官网上注册一个账号，通过 `npm adduser` 命令创建一个账户，或者在 npm 官网注册，注册完成后在本地命令行中登录：`npm login`，`npm whoami`命令可以检验是否已经登录，执行发布命令，发布到 npm
```
npm publish
```
>npm 淘宝镜像不支持 publish 命令，如果设置了淘宝镜像，publish 前需将镜像设置回npm :`npm config set registry http://registry.npmjs.org`

## 使用组件
安装
```bash
yarn add claus-ui
```
使用
```js
# main.js
import {clColorCard} from 'claus-ui' // 按需引入
app.use(clColorCard)

import ClausUI from 'claus-ui' // 全量引入
app.use(ClausUI)

# 组件中
<template>
    <cl-color-card :data="list"/>
</template>
<script>
export default{
    setup(){}
}
</script>

```
# 遇到的问题及解决方法
## 发布前在其他项目中引用组件库
### 建立全局链接
在claus-ui组件库项目根目录执行`yarn link`建立全局软链接
### 在目标项目引入组件库
```
yarn link claus-ui
```
会在目标项目的node_modules目录下创建一个claus-ui的软链接，然后在项目中正常使用
```
#main.js
import {clColorCard} from 'claus-ui/packages'// 按引入代码的方式引入
app.use(clColorCard)
```
### 遇到如下报错，这个是由于vue被重复引用导致的问题，解决方式为在vue.config.js中添加如下内容
<font color=red>Uncaught (in promise) TypeError: Cannot read properties of null(reading 'isCE')</font>
<font color=red>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;at renderSlot(runtime-core.esm-bunder.js?7745:5827)</font>
<font color=red>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...</font>


```js
const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      symlinks: false,
      alias: {
        vue: path.resolve('./node_modules/vue')
      }
    }
  }
}
```
## 在使用发布后组件的时候遇到的报错
<font color=red>Uncaught (in promise) TypeError: Object(...) is not a function</font>

<font color=red>[Vue warn]: Invalid VNode type: Symbol(Text)</font>

以上问题都是由于vue版本的问题导致的，统一组件库项目和目标项目的vue版本可以解决，暂时不知道其他方案。
