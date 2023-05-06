---
title: 用vue3 vite搭建一个项目
date: 2023-04-12 16:59:37
tags: vue
categories: vue
---
## 1.搭建项目
按照vue官网执行命令
```bash
npm init vue@latest
```
这一指令将会安装并执行 create-vue，它是 Vue 官方的项目脚手架工具。
## 2.安装less
less-loader貌似不必须
## 3.安装postcss-px-to-viewport自动转化px为vw
并新建配置文件对其配置
发现报了个警告：postcss-px-to-viewport: postcss.plugin was deprecated. 
又重新安装了升级版`postcss-px-to-viewport-8-plugin`，该配置文件同postcss-px-to-viewport的配置
## 4.安装vant
发现postcss-px-to-viewport连vant的px也转了，导致vant的样式被压扁了。
于是修改其配置，判断是vant文件viewport就用375的宽度
```js
// postcss.config.js
module.exports = {
  plugins: {
    "postcss-px-to-viewport-8-plugin": {
      viewportWidth: file => {
        let num = 750;
        if (file.indexOf('vant') !== -1) {
          num = 375;
        }
        return num;
      },
      unitPrecision: 3,
      ...
    }
  }
}
```
## 5.安装自动导入组件的插件unplugin-vue-components
该插件可以免于import手动导入组件，插件会自动导入标签引用的组件。
相关配置如下：
```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import {VantResolver} from 'unplugin-vue-components/resolvers'
export default defineConfig({
  plugins: [vue(), vueJsx(),Components({
    resolvers: [VantResolver()]
  })],
  ...
})
```
该插件的相关参考文章：[尤大推荐的神器unplugin-vue-components,解放双手!以后再也不用呆呆的手动引入...](https://juejin.cn/post/7012446423367024676)

## 6.配置联调的代理本地跨域
```ts
// vite.config.ts
export default defineConfig({
  ...
  server: {
    host: true,
    proxy: {
      '/manager': {
        target: 'https://dev.beeselect.net/',
        ws: false,
        changeOrigin: true,
      },
    },
  },
})
```


