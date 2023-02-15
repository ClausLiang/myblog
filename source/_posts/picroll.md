---
title: 图片拖住滚动(vue指令实现)
date: 2021-11-16 17:30:44
tags: 图片
categories: h5
---


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/676822c95618444a863e06f46780897d~tplv-k3u1fbpfcp-watermark.image?)
适用于内容超出展示范围，出现滚动条，但是不拖动滚动条而是拖内容让其移动的场景。利用了dom的scrollTo方法
## dom
```html
<div class="yule-wrapper" v-move>
    <img src="@/assets/partnerHome/yule1.png" class="yule-item" alt="">
    <img src="@/assets/partnerHome/yule2.png" class="yule-item" alt="">
    <img src="@/assets/partnerHome/yule3.png" class="yule-item" alt="">
    <img src="@/assets/partnerHome/yule4.png" class="yule-item" alt="">
    <img src="@/assets/partnerHome/yule5.png" class="yule-item" alt="">
    <img src="@/assets/partnerHome/yule6.png" class="yule-item" alt="">
</div>
```

## css
```css
.yule-wrapper {
    width: 1200px;
    overflow-x: auto;
    margin: 22px auto;
    display: flex;
    .yule-item {
        width: 321px;
        height: 324px;
    }
}
```

## js
```js
export default{
    directives: {
        move: {
            mounted: function (el) {
                el.onmousedown = function (e) {
                    const disX = e.clientX // 鼠标原始坐标
                    const disY = e.clientY
                    const originalScrollLeft = el.scrollLeft // 原始滚动距离
                    const originalScrollTop = el.scrollTop
                    const originalScrollBehavior = el.style['scroll-behavior']
                    const originalPointerEvents = el.style['pointer-events']
                    el.style['scroll-behavior'] = 'auto'
                    // 鼠标移动事件是监听的整个document，这样可以使鼠标能够在元素外部移动的时候也能实现拖动
                    document.onmousemove = function (ev) {
                        ev.preventDefault()
                        const distanceX = ev.clientX - disX // 滚过的距离
                        const distanceY = ev.clientY - disY
                        el.scrollTo(originalScrollLeft - distanceX, originalScrollTop - distanceY)
                        // 由于我们的图片本身有点击效果，所以需要在鼠标拖动的时候将点击事件屏蔽掉
                        el.style['pointer-events'] = 'none'
                    }
                    document.onmouseup = function () {
                        document.onmousemove = null
                        document.onmouseup = null
                        el.style['scroll-behavior'] = originalScrollBehavior
                        el.style['pointer-events'] = originalPointerEvents
                    }
                }
            }
        }
    }
}
```
