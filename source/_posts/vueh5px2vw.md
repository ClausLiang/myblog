---
title: vue的H5项目px转vw
date: 2020-07-27 20:20:40
tags:
    - vue
    - h5
    - vw
categories: vue
---

看了一些博客几乎都是互相抄袭，用了很多不知道是什么作用的插件。其实px转vw只用了一个核心插件postcss-px-to-viewport，安装该插件，然后在根目录新建postcss.config.js做一下配置，在项目中就可以随意写px了。webpack会将px自动转换为vw。
```
module.exports = {
    plugins: {
        "postcss-px-to-viewport": {
            viewportWidth: 750, // (Number) The width of the viewport.
            viewportHeight: 1334, // (Number) The height of the viewport.
            unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
            viewportUnit: "vw", // (String) Expected units.
            selectorBlackList: [".ignore", ".hairlines"], // (Array) The selectors to ignore and leave as px.
            minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
            mediaQuery: false // (Boolean) Allow px to be converted in media queries.
        }
    }
};
```
该插件需要依赖postcss-loader等，但是会自动安装。
