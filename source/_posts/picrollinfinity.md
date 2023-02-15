---
title: 图片无限轮播
date: 2021-11-15 01:12:21
tags: 图片
categories: h5
---

# 用在官网中的多张图片无限滚动播放的效果

![BrowserPreview_tmp.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54196bb14ee24ffabeeda6f6928fb211~tplv-k3u1fbpfcp-watermark.image?)
## dom结构
要注意的是wrapper代表的展示部分，宽度1200px（根据设计来），inner是多张图片的实际宽度，图片要多来一份，因为图片是往左一直移动的。当第6张图片也移动出屏幕时后面要接上第一张图片，才能有无限循环的效果。
```html
<div class="life-wrapper">
    <div class="life-wrapper-inner" ref="wrapperInner">
        <img src="@/assets/partnerHome/shenghuo1.png" class="shenghuo-item" alt="">
        <img src="@/assets/partnerHome/shenghuo2.png" class="shenghuo-item" alt="">
        <img src="@/assets/partnerHome/shenghuo3.png" class="shenghuo-item" alt="">
        <img src="@/assets/partnerHome/shenghuo4.png" class="shenghuo-item" alt="">
        <img src="@/assets/partnerHome/shenghuo5.png" class="shenghuo-item" alt="">
        <img src="@/assets/partnerHome/shenghuo6.png" class="shenghuo-item" alt="">
        重复了一遍
        <img src="@/assets/partnerHome/shenghuo1.png" class="shenghuo-item" alt="">
        <img src="@/assets/partnerHome/shenghuo2.png" class="shenghuo-item" alt="">
        <img src="@/assets/partnerHome/shenghuo3.png" class="shenghuo-item" alt="">
        <img src="@/assets/partnerHome/shenghuo4.png" class="shenghuo-item" alt="">
        <img src="@/assets/partnerHome/shenghuo5.png" class="shenghuo-item" alt="">
        <img src="@/assets/partnerHome/shenghuo6.png" class="shenghuo-item" alt="">
    </div>
</div>
```

## css部分
wrapper要overflow: hidden;
```css
.life-wrapper{
    width: 1200px;
    overflow: hidden;
    margin: 40px auto;
    .life-wrapper-inner{
        display: flex;
        .shenghuo-item {
            width: 291px;
            height: 350px;
        }
    }
}
```
## js部分
无限滚动核心就是用了定时器，让图片15ms向左移动一像素（用translateX移动），图片看起来运动的就比较顺滑。当最后一张图片移出屏幕时，啪，让translateX置为0，这样可以实现无线滚动。
```vue
export default {
    data() {
        return {
            count: 0,
            stopFlag: false,
            timer: null
        }
    },
    mounted() {
        this.$refs.wrapperInner.addEventListener('mouseenter', () => {
            this.stopFlag = true;
        });
        this.$refs.wrapperInner.addEventListener('mouseleave', () => {
            this.stopFlag = false;
        });
        let dom = this.$refs.wrapperInner.style
        this.timer = setInterval(() => {
            if (this.stopFlag){
                return
            }
            this.count++
            if (this.count >= 291 * 6) {
                this.count = 0
            }
            dom.transform = `translateX(-${this.count}px)`
        }, 15)
    },
    unmounted(){
        clearInterval(this.timer)
    }
}

```
