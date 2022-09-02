---
title: vue项目打包优化---首屏优化
date: 2022-04-24 16:48:21
tags:
    - vue
    - webpack
categories: 进阶
---
> 目标：打出的包体积更小！
## 1.先分析一下打出的包到底什么占空间
安装分析插件
```zsh
yarn add webpack-bundle-analyzer -D
```
在vue.config.js中添加配置
```js
module.exports = {
    chainWebpack: (config) => {
        /* 添加分析工具*/
        if (process.env.NODE_ENV === 'production') {
            if (process.env.npm_config_report) {
                config
                    .plugin('webpack-bundle-analyzer')
                    .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
                    .end();
                config.plugins.delete('prefetch')
            }
        }
    },
}
```
执行命令
```zsh
npm run build --report
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/674f6c2118ff41d589b213427477b46a~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf15e7ab1cdf452aa1246ef8343dca25~tplv-k3u1fbpfcp-watermark.image?)
从图中可以看到打出的每个js体积有多大，每个js都是由什么依赖组成的，搞清楚是什么占体积后就可以对症下药了。好家伙，一个chunk-vendors.js 1.45M，其中element-plus 占六七百k，chunk-vendors过大就会导致首屏加载很慢。我准备先把element-plus引入方式改为cdn引入的形式来优化一下。
## 2.cdn 引入 element-plus
```js
module.exports = {
    chainWebpack: (config) => {
        /* 添加分析工具*/
        if (process.env.NODE_ENV === 'production') {
            if (process.env.npm_config_report) {
                config
                    .plugin('webpack-bundle-analyzer')
                    .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
                    .end();
                config.plugins.delete('prefetch')
            }
            var externals = {
                // CDN 的 Element-plus 依赖全局变量 Vue， 所以 Vue 也需要使用 CDN 引入
                'vue': 'Vue',
                // 属性名称 element-plus, 表示遇到 import xxx from 'element-plus' 这类引入 'element-plus'的，
                // 不去 node_modules 中找，而是去找 全局变量 ElementPlus
                'element-plus': 'ElementPlus'
            }
            config.externals(externals)
        }
    },
}
```
```html
<head>
    <!-- 引入element-plus的样式-->
    <link rel="stylesheet" href="https://unpkg.com/element-plus@2.1.9/dist/index.css" />
    
</head>

<body>
    <div id="app"></div>
    <!-- 引入vue element-plus并锁定版本 -->
    <script src="https://unpkg.com/vue@3.2.31/dist/vue.global.js"></script>
    <script src="https://unpkg.com/element-plus@2.1.9/dist/index.full.js"></script>
</body>
```
## 3.打出的js不要map
```js
module.exports = {
    productionSourceMap: false,
}
```
做完以上操作后，chunk-vendors.js减小到九十多k
