---
title: 快速熟悉vue3的语法
date: 2023-03-06 10:18:06
tags: vue
categories: vue
---
> 本文前提 --- 特别熟悉vue2。对比并记录vue3有哪些新的语法，以便可以快速上手vue3

## <font color=green>setup</font>
setup是新增的生命周期，早于beforeCreate，setup里没有this，是组合式API的入口，只在组件初始化时执行一次。

```ts
<script lang="ts">
    import { reactive, toRefs } from 'vue'
    export default {
        setup(props,context){
            const state = reactive({
                data:[
                    { title: '进行中', value: 1, type: 'blue' },
                    { title: '已完成', value: 2, type: 'green' }
                ]
            })
            const change = () => {
                state.data[0].value = 2
            }
            return {
                ...toRefs(state),
                change
            }
        }
    }
</script>
```
### `<script setup>`
在 setup() 函数中手动暴露大量的状态和方法非常繁琐。幸运的是，我们可以通过使用构建工具来简化该操作。当使用单文件组件（SFC）时，我们可以使用 `<script setup>` 来大幅度地简化代码。
```ts
<script setup lang="ts">
    import { reactive } from 'vue'
    const state = reactive({ count: 0 })
</script>
```
## <font color=green>组合式API（composition API）</font>
不同于vue2，vue3的组合式API（composition API）都用import {xxx} from 'vue'这种形式引入。vue3也支持选项式API（options API）。实际上，选项式API是在组合式API的基础上实现的。

## <font color=green>响应式</font>

### reactive
处理对象（非基本类型）
```ts
<script setup lang="ts">
    import { reactive } from 'vue'
    const state = reactive({ count: 0 })
</script>
// 模板中引用
<div>{{ state.count }}</div>
```

### ref
#### ref处理基本类型的数据
```ts
<script setup lang="ts">
    import { ref } from 'vue'
    const count = ref(0)
    console.log(count) // {value: 0}
    console.log(count.value) // 0
</script>
// 当 ref 在模板中作为顶层属性被访问时，它们会被自动“解包”，所以不需要使用 .value。
<template>{{count}}</template> <!-- 无需 .value -->
```
#### ref获取dom
```ts
<script setup lang="ts">
    import { ref } from 'vue'
    const hello = ref(null) // 这个hello和dom里的ref='hello'相对应
</script>
```

### toRefs
将reactive处理过的数据拆开，不太常用因为有了script setup

### toRef
let age = toRef(data,'age')，获取单个reactive处理过的数据，不太常用


## <font color=green>计算属性</font>
```ts
<script setup lang="ts">
    import { computed } from 'vue'
    const publishedBooksMessage = computed(() => {
        return author.books.length > 0 ? 'Yes' : 'No'
    })
</script>
```
可写计算属性
```ts
<script setup lang="ts">
    import { ref, computed } from 'vue'
    const firstName = ref('John')
    const lastName = ref('Doe')
    const fullName = computed({
        // getter
        get() {
            return firstName.value + ' ' + lastName.value
        },
        // setter
        set(newValue) {
            // 注意：我们这里使用的是解构赋值语法
            [firstName.value, lastName.value] = newValue.split(' ')
        }
    })
</script>
```
现在当你再运行 fullName.value = 'John Doe' 时，setter 会被调用而 firstName 和 lastName 会随之更新。

计算属性和方法的区别：
计算属性基于响应式依赖被缓存，一个计算属性仅会在其响应式依赖更新时才重新计算。这也解释了为什么下面的计算属性永远不会更新，因为 Date.now() 并不是一个响应式依赖：
```ts
const now = computed(() => Date.now())
```
相比之下，方法调用总是会在重渲染发生时再次执行函数。

## <font color=green>生命周期钩子</font>
```ts
<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  console.log(`the component is now mounted.`)
})
</script>
```
不同API的生命周期
|选项式API|组合式API|
|:-:|:-:|
|beforeCreate|不需要（直接写在setup中）|
|created|不需要（直接写在setup中）|
|beforeMount|onBeforeMount|
|mounted|onMounted|
|beforeUpdate|onBeforeUpdate|
|updated|onUpdated|
|beforeDestroyed|onBeforeUnmount|
|destroyed|onUnmounted|

## <font color=green>watch</font>
{ immediate: true } 立即执行
```ts
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')

// 可以直接侦听一个 ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexOf('?') > -1) {
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    }
  }
},{ immediate: true })
</script>
<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</template>
```
可以监听一个getter函数。`不能监听一个对象的属性值，这个是和vue2的区别。`想监听一个对象的属性值，就用getter函数这种形式
```ts
<script setup>
// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)
</script>
```
可以监听一个数组
```ts
<script setup>
// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
</script>
```

### watchEffect
不需要手动传入监听源，并且自动是立即执行的，自动跟踪回调的响应式依赖

`区别`
watch 只追踪明确侦听的数据源。另外，仅在数据源确实改变时才会触发回调。watch 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。
watchEffect，则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。

```ts
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```
