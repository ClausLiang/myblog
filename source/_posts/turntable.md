---
title: 一个简单的大转盘
date: 2021-11-16 18:04:50
tags: h5
categories: h5
---


![image.png](/images/turn-table-2021-11-16.png)

点击按钮调接口，当返回奖品index时，使转盘转出相应的角度。动效是利用了transition过渡动画。
当奖品是固定的时候，就少了绘制奖品转盘的步骤。否则得绘制奖品转盘。

## dom
```html
<div class="turn-wrapper">
    <!-- 转盘 -->
    <div class="panel" :style="rotateStyle"></div>
    <!-- 指针 -->
    <div class="pointer" @click="rotateHandle"></div>
</div>
```
## js
```js
export default {
    computed: {
        // 核心
        rotateStyle() {
            return `
                transition: transform 5000ms ease;
                transform: rotate(${this.rotateAngle}deg)
            `
        }
    },
    data() {
        return {
            isRotating: false, // 正在转
            rotateAngle: 0, // 角度
            angleList: [], // 每个奖品的角度范围
            bingoNum: 2, // 中奖序号
        }
    },
    mounted() {
        const average = 360 / 8
        for (let i = 0; i < 8; i++) {
            this.angleList.push(i * average + average / 2)
        }
    },
    methods: {
        // 点击抽奖
        rotateHandle() {
            // 防止重复点击
            if (this.isRotating) {
                return
            }
            // 调用接口获取到奖品序号
            // 省略部分代码
            this.beginRotate(index)
        },
        beginRotate(index) {
            const { rotateAngle, angleList } = this
            this.isRotating = true // 标记正在转动
            const angle = rotateAngle + 5 * 360 + angleList[index] - rotateAngle % 360 // 为了视觉好看，这里默认旋转5圈以上
            this.rotateAngle = angle // 保存此次旋转角度，下次旋转需要用到

            setTimeout(() => {
                this.isRotating = false // 本次抽奖结束，可以进行下一次
            }, 5000)
        }
    }
}
```
