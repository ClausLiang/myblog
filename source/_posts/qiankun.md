---
title: qiankun通信方式及子应用引用百度地图的修改
date: 2022-01-04 17:05:44
updated: 2022-01-04
tags: 微前端
categories: 进阶
---

## 基座如何修改
1.安装qiankun`yarn add qiankun`<br>
2.注册微应用并启动
```js
// main.js
import { registerMicroApps, start } from 'qiankun';
registerMicroApps([
    {
        name: 'child',
        entry: '//localhost:9000',
        container: '#container',
        activeRule: '/sub',
    }
]);
start()
```

## 子应用如何修改
具体代码略，可参考官网[qiankun](https://qiankun.umijs.org/zh) <br>概要如下：<br>

1.src目录下新增public-path.js,并在main.js中引入<br>
2.main.js中抛出3个方法 bootstrap mount unmount<br>
3.改造main中createapp的方式<br>
4.打包配置修改(vue.config.js)
## 基座与子应用如何通信
基座与子应用的通讯只是用了API`initGlobalState`<br>
initGlobalState返回一个MicroAppStateActions对象，它有三个属性：
-   onGlobalStateChange: `(callback: OnGlobalStateChangeCallback, fireImmediately?: boolean) => void`， 在当前应用监听全局状态，有变更触发 callback，fireImmediately = true 立即触发 callback
-   setGlobalState: `(state: Record<string, any>) => boolean`， 按一级属性设置全局状态，微应用中只能修改已存在的一级属性
-   offGlobalStateChange: `() => boolean`，移除当前应用的状态监听，微应用 umount 时会默认调用

### 父应用如何做
```js
import { initGlobalState } from 'qiankun';
const state = {
    baiduinit: window,
    abc: 456
}
// 初始化通信池
const actions = initGlobalState(state);
// 监听通讯池的变化
actions.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log(state, prev);
});
```
### 子应用如何做
#### 1.创建action.js
```js
// /src/qiankun/action.js
function emptyAction() {
    // 提示当前使用的是空 Action
    console.warn("Current execute action is empty!");
}

class Actions {
    // 默认值为空 Action
    actions = {
        onGlobalStateChange: emptyAction,
        setGlobalState: emptyAction,
    };

    /**
     * 设置 actions
     */
    setActions(actions) {
        this.actions = actions;
    }

    /**
     * 映射
     */
    onGlobalStateChange() {
        return this.actions.onGlobalStateChange(...arguments);
    }

    /**
     * 映射
     */
    setGlobalState() {
        return this.actions.setGlobalState(...arguments);
    }
}

const actions = new Actions();
export default actions;

```
#### 2.在main.js mount方法中接收父应用的传值props
```js
import action from './qiankun/action'
export async function mount(props) {
    console.log('[vue] props from main framework', props);
    action.setActions(props)
    render(props);
}
```
#### 3.在需要接收父应用传入的参数的地方引用action.js
```js
import action from '@/qiankun/action'
export default {
    name: 'Home',
    mounted() {
        // 接收state
        action.onGlobalStateChange((state) => {
            console.log(state)
        }, true);
    },
    methods:{
        changeValue(){
            // 修改state
            action.setGlobalState({abc:789})
        }
    }
}
```
子应用可以修改通讯池，修改完会被基座监听到。
## 子应用引用了百度地图
子应用引用了第三方js库，在乾坤环境中会有跨域的问题，因为乾坤会把子应用的静态资源放到沙箱中，这样第三方js经过编译就会出现问题。解决方式是在基座中start方法中设置excludeAssetFilter,使qiankun不处理这部分js
```js
// main.js
import { registerMicroApps, start } from 'qiankun';
start(
    {
        excludeAssetFilter: (urls) => {
            const whiteList = []
            const whiteWords = ['baidu'] // 异步加载百度地图白名单
            if (whiteList.includes(urls)) return true
            return whiteWords.some(w => urls.includes(w))
        }
    }
);
```
百度地图的初始化需要把init挂到window上，而在qiankun环境中window不是window了，我想到的办法是把window通过传参传给子应用，处理如下：
```js
// bmap.vue
import action from '@/qiankun/action'
export default {
    mounted() {
        // 创建了script标签callback走的方法
        window.baiduinit = ()=>{
            this.initBaiduMap(116.404, 39.915)
        }
        // 如果在乾坤环境window不是window
        if(window.__POWERED_BY_QIANKUN__){
            action.onGlobalStateChange((state) => {
                state.baiduinit.baiduinit = ()=>{
                    this.initBaiduMap(116.404, 39.915)
                }
            }, true);
        }
        // 检测到已经创建了标签走的方法
        this.createMap().then(()=>{
            this.initBaiduMap(116.404, 39.915)
        })
    },
    methods: {
        // 创建script标签
        createMap(){
            return new Promise((resolve,reject)=>{
                const map = document.getElementById('baidumap');
                if(map){
                    resolve()
                    return
                }
                console.log('create baidu map')
                let script = document.createElement('script');
                script.id = 'baidumap';
                script.type = 'text/javascript';
                script.src = `https://api.map.baidu.com/api?v=3.0&ak=你的ak&callback=baiduinit`;
                document.body.appendChild(script);
            })
        }
        ...
```
## 源码
[https://gitee.com/clausliang/qiankun-demo](https://gitee.com/clausliang/qiankun-demo)

