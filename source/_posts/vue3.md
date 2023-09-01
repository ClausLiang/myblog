---
title: 快速熟悉vue3的语法
date: 2023-03-06 10:18:06
tags: vue
categories: vue
sticky: true
---
<script type="text/javascript" src="/custom.js"></script>
> 本文前提 --- 特别熟悉vue2，有一定的基础。对比一下vue3有哪些新的语法，以便可以快速上手vue3

# <font color=orange>基础</font>
## <font color=green>setup</font>
setup是新增的生命周期，早于beforeCreate，setup里没有this，是组合式API的入口，只在组件初始化时执行一次。

```ts
<script lang="ts">
    import { reactive, toRefs } from 'vue'
    export default {
        setup(props,context){
            const data = reactive({
                message: 'hello'
            })
            const change = () => {
                data.message = 'world'
            }
            return {
                ...toRefs(data),
                change
            }
        }
    }
</script>
<template>
    {{ message }}
    <button type="primary" @click="change">change</button>
</template>
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
### 回调的触发机制
当你更改了响应式状态，它可能会同时触发 Vue 组件更新和侦听器回调。
默认情况下，用户创建的侦听器回调，都会在 Vue 组件更新之前被调用。这意味着你在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态。
如果想在侦听器回调中能访问被 Vue 更新之后的 DOM，你需要指明 flush: 'post' 选项
```ts
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```
### 停止监听
在 setup() 或 `<script setup>` 中用同步语句创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止。因此，在大多数情况下，你无需关心怎么停止一个侦听器。

一个关键点是，侦听器必须用同步语句创建：如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。如下方这个例子：
```ts
<script setup>
import { watchEffect } from 'vue'

// 它会自动停止
watchEffect(() => {})

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```
要手动停止一个侦听器，请调用 watch 或 watchEffect 返回的函数：
```ts
const unwatch = watchEffect(() => {})

// ...当该侦听器不再需要时
unwatch()
```
注意，需要异步创建侦听器的情况很少，请尽可能选择同步创建。如果需要等待一些异步数据，你可以使用条件式的侦听逻辑：
```ts
// 需要异步请求得到的数据
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // 数据加载后执行某些操作...
  }
})
```
## <font color=green>组件</font>
### 使用`<script setup>`,导入的组件都在模板中直接可用
```ts
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

### 传递props用defineProps
```ts
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```
defineProps 是一个仅 `<script setup>` 中可用的编译宏命令，并不需要显式地导入。声明的 props 会自动暴露给模板。defineProps 会返回一个对象，其中包含了可以传递给组件的所有 props：
```ts
const props = defineProps(['title'])
console.log(props.title)
```

如果你没有使用 `<script setup>`，props 必须以 props 选项的方式声明，props 对象会作为 setup() 函数的第一个参数被传入：
```ts
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

### 派发事件用defineEmits
```ts
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```
如果你没有在使用 `<script setup>`，你可以通过 emits 选项定义组件会抛出的事件。你可以从 setup() 函数的第二个参数，即 setup 上下文对象上访问到 emit 函数：
```ts
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

### 插槽，用`<slot/>`作为占位符

### 动态组件
通过 Vue 的 `<component>` 元素和特殊的 `is` attribute 实现
```html
<component :is="tabs[currentTab]"></component>
```
在上面的例子中，被传给 :is 的值可以是以下几种：被注册的组件名、导入的组件对象。
你也可以使用 is attribute 来创建一般的 HTML 元素。

当使用 `<component :is="...">` 来在多个组件间作切换时，被切换掉的组件会被卸载。我们可以通过 `<KeepAlive>` 组件强制被切换掉的组件仍然保持“存活”的状态。

### dom模板解析注意事项
如果你想在 DOM 中直接书写 Vue 模板，Vue 则必须从 DOM 中获取模板字符串。由于浏览器的原生 HTML 解析行为限制，有一些需要注意的事项。如果你使用来自以下来源的字符串模板，就不需要顾虑这些限制了：
1.单文件组件
2.内联模板字符串 (例如 template: '...')
3.`<script type="text/x-template">`

# <font color=orange>组件深入</font>
## <font color=green>组件命名格式</font>
### PascalCase 帕斯卡命名
PascalCase是合法的 JavaScript 标识符。这使得在 JavaScript 中导入和注册组件都很容易，同时 IDE 也能提供较好的自动补全。
`<PascalCase />` 在模板中更明显地表明了这是一个 Vue 组件，而不是原生 HTML 元素。同时也能够将 Vue 组件和自定义元素 (web components) 区分开来。
在单文件组件和内联字符串模板中，我们都推荐这样做。但是，PascalCase 的标签名在 DOM 模板中是不可用的。

### camelCase 驼峰命名

### kebab-case 串式命名
为了方便，Vue 支持将模板中使用 kebab-case 的标签解析为使用 PascalCase 注册的组件。这意味着一个以 MyComponent 为名注册的组件，在模板中可以通过 `<MyComponent>` 或 `<my-component>` 引用。这让我们能够使用同样的 JavaScript 组件注册代码来配合不同来源的模板。

### snake_case 蛇形命名（这个不用于组件命名，只是列在这里）
每个单词全小写或全大写，多单词使用下划线隔开

### Hungarian 匈牙利命名法（这个不用于组件命名，只是列在这里）
匈牙利命名法通过在变量名前面加上相应的小写字母的符号标识作为前缀，标识出变量的作用域，类型等。这些符号可以多个同时使用，顺序是先m_（成员变量），再指针，再简单数据类型，再其他。例如：m_lpszStr, 表示指向一个以0字符结尾的字符串的长指针成员变量。 

## <font color=green>props</font>
