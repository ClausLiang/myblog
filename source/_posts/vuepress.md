---
title: 用vuepress搭建一个文档项目的踩坑记录
date: 2022-01-04 14:25:39
updated: 2022-01-04
tags: vue
categories: 进阶
---

## 介绍一下vuepress
vuepress由两部分组成，第一部分是一个[极简静态网站生成器 (opens new window)](https://github.com/vuejs/vuepress/tree/master/packages/%40vuepress/core)，它包含由 Vue 驱动的[主题系统](https://vuepress.vuejs.org/zh/theme/)和[插件 API](https://vuepress.vuejs.org/zh/plugin/)，另一个部分是为书写技术文档而优化的[默认主题](https://vuepress.vuejs.org/zh/theme/default-theme-config.html)，它的诞生初衷是为了支持 Vue 及其子项目的文档需求。
## 快速上手
在此不赘述，可以查看官网[vuepress](https://vuepress.vuejs.org/zh/)
## 踩坑记录
本着只是做一个技术文档的初衷，也不需要把网站做的多漂亮，因此只需要配置好默认主题就可以了。为什么用vuepress做这件事呢，主要是因为我的技术栈是vue，vuepress是基于vue的，在markdown中可以直接引vue组件，使用vue语法，特别方便，学习成本低。<br>
编写文章的时候项目已经开发完了，写文章是用回忆的方式记录项目中的问题，难免遗漏一些，没有办法，下次尽量开发时同步记录文章。<br>
关键点有以下几点：
### 默认主题配置
1.默认的主题提供了一个首页（Homepage）的布局 (用于 这个网站的主页)。想要使用它，需要在根级 `README.md` 的 [YAML front matter](https://vuepress.vuejs.org/zh/guide/markdown.html#front-matter) 指定 `home: true`<br>
2.多个侧边栏配置
```js
module.exports = {
    base: '/claus-ui-docs/',
    title: 'Claus-UI',
    description: 'claus-ui',
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '指南', link: '/guide/guide' },
            { text: '组件', link: '/components/colorCard' },
            { text: '查看源码', link: 'https://gitee.com/clausliang/claus-ui-vue2' },
        ],
        sidebar: {
            '/guide/':[
                {title: '指南', path:'guide'}
            ],
            '/components/': [
                {title: 'colorCard',path: 'colorCard'},
            ]
        }
    },
    // 解决引入element报错问题
    chainWebpack: config => {
     	config.resolve.alias.set('core-js/library/fn', 'core-js/features')
    }
}
```
### TypeError: Object(...) is not a function

![初步判断是vue版本的问题报的错.png](/images/vuepress1-2022-1-4.png)

这个错一开始很懵，不知道是怎么回事。后来发现是vue版本的问题，就是vuepress的稳定版1.x引用的vue是2.x版本，我引入了一个vue3搭建的组件库，就导致了这个报错。vue2和vue3不互相兼容。
### cannot find moduule 'core-js/library/fn/object/assign'

![element和vuepress的core-js版本不一致导致的报错.png](/images/vuepress2-2022-1-4.png)
在vuepress的项目中使用element方法：创建enhanceApp.js
```js
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

export default ({ Vue, options, router }) => {
  Vue.use(ElementUI);
}

```

安装使用element时报了这么一个错，原因是element引用的core-js和vuepress引用的core-js版本不一致导致的。修复方法：
```js
// config.js
module.exports = {
    ...
    // 解决引入element报错问题
    chainWebpack: config => {
     	config.resolve.alias.set('core-js/library/fn', 'core-js/features')
    }
}
```

## 打包发布
### 1.打包命令 `yarn docs:build`<br>
### 2.发布到gitee pages
1.需要在config.js中配置base
```js
module.exports = {
    base: '/claus-ui-docs/',
    ...
}
```
部署目录是docs/.vuepress/dist

![image.png](/images/vuepress3-2022-1-4.png)
### 3.效果展示
[https://clausliang.gitee.io/claus-ui-docs/](https://clausliang.gitee.io/claus-ui-docs/)
