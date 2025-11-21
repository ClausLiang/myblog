---
title: vue pinia store持久化实现方法
date: 2025-05-28 09:25:06
updated: 2025-05-28
tags: vue
categories: vue
---
<script type="text/javascript" src="/myblog/custom.js"></script>

vue3全局状态管理的方案是用pinia，pinia的持久化要怎么实现呢？
# 方法1 利用插件
## 安装插件
```bash
yarn add pinia-plugin-persistedstate
```
## 在创建pinia实例的时候，注册插件
```js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
```
## 在store中定义持久化字段
```js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    userInfo: null,
  }),
  persist: {
    key: 'auth', // 存储的键名，默认为store的id
    storage: sessionStorage, // 指定存储方式，默认localStorage
    paths: ['token'], // 仅持久化token字段
  },
})
```
通过以上3步就可以实现pinia持久化了

# 方法2 手动实现
## 定义Store时初始化数据
```js
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  actions: {
    // 从存储中加载数据
    hydrate() {
      const savedState = localStorage.getItem('cart')
      if (savedState) {
        this.$patch(JSON.parse(savedState))
      }
    },
    // 保存数据到存储
    saveState() {
      localStorage.setItem('cart', JSON.stringify(this.$state))
    }
  }
})
```

## 在组件中初始化和订阅变化
```js
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
// 初始化时加载数据
cartStore.hydrate()

// 订阅state变化，自动保存
cartStore.$subscribe((mutation, state) => {
  localStorage.setItem('cart', JSON.stringify(state))
})
```
