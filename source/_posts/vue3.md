---
title: 快速熟悉vue3的语法
date: 2023-03-06 10:18:06
tags: vue
categories: vue
sticky: true
---
<script type="text/javascript" src="/myblog/custom.js"></script>
> 本文前提 --- 特别熟悉vue2，有一定的基础。对比一下vue3有哪些新的语法，以便可以快速上手vue3

# <font color=red>基础</font>
## <font color=orange>setup</font>
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
## <font color=orange>组合式API（composition API）</font>
不同于vue2，vue3的组合式API（composition API）都用import {xxx} from 'vue'这种形式引入。vue3也支持选项式API（options API）。实际上，选项式API是在组合式API的基础上实现的。

## <font color=orange>响应式</font>

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


## <font color=orange>计算属性</font>
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

## <font color=orange>生命周期钩子</font>
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

## <font color=orange>watch</font>
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
## <font color=orange>组件</font>
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

## <font color=orange>表单输入绑定（v-model）</font>
这个是vue的特色，react没有的。
在前端处理表单时，我们常常需要将表单输入框的内容同步给 JavaScript 中相应的变量。手动连接值绑定和更改事件监听器可能会很麻烦：
```html
<input
  :value="text"
  @input="event => text = event.target.value">
```
v-model 指令帮我们简化了这一步骤：
```html
<input v-model="text">
```
v-model可以支持不同类型的输入，支持`input` `select` `textarea`这三种原生标签。它会根据所使用的元素自动使用对应的 DOM 属性和事件组合：
1.文本类型的 `<input>` 和 `<textarea>` 元素会绑定 value property 并侦听 input 事件；
2.`<input type="checkbox">` 和 `<input type="radio">` 会绑定 checked property 并侦听 change 事件；
3.`<select>` 会绑定 value property 并侦听 change 事件。

# <font color=red>组件深入</font>
## <font color=orange>组件注册</font>
### 全局注册
### 局部注册
1.全局注册，但并没有被使用的组件无法在生产打包时被自动移除 (也叫“tree-shaking”)。如果你全局注册了一个组件，即使它并没有被实际使用，它仍然会出现在打包后的 JS 文件中。
2.全局注册在大型项目中使项目的依赖关系变得不那么明确。在父组件中使用子组件时，不太容易定位子组件的实现。和使用过多的全局变量一样，这可能会影响应用长期的可维护性。
## <font color=orange>组件命名格式</font>
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

## <font color=orange>props</font>
### 仅写上 prop 但不传值，会隐式转换为 `true`
```html
<!-- 仅写上 prop 但不传值，会隐式转换为 `true` -->
<BlogPost is-published />
```
### 使用一个对象绑定多个 prop
```js
const post = {
  id: 1,
  title: 'My Journey with Vue'
}
```
```html
<BlogPost v-bind="post" />
```
等价于
```html
<BlogPost :id="post.id" :title="post.title" />
```
### 单向数据流
所有的 props 都遵循着单向绑定原则，props 因父组件的更新而变化，自然地将新的状态向下流往子组件，而不会逆向传递。这避免了子组件意外修改父组件的状态的情况，不然应用的数据流将很容易变得混乱而难以理解。
每次父组件更新后，所有的子组件中的 props 都会被更新到最新值，这意味着你不应该在子组件中去更改一个 prop。若你这么做了，Vue 会在控制台上向你抛出警告。

`导致你想要更改一个 prop 的需求通常来源于以下两种场景：`
1.prop 被用于传入初始值；而子组件想在之后将其作为一个局部数据属性。在这种情况下，最好是新定义一个局部数据属性，从 props 上获取初始值即可：
```js
const props = defineProps(['initialCounter'])

// 计数器只是将 props.initialCounter 作为初始值
// 像下面这样做就使 prop 和后续更新无关了
const counter = ref(props.initialCounter)
```
2.需要对传入的 prop 值做进一步的转换。在这种情况中，最好是基于该 prop 值定义一个计算属性：
```js
const props = defineProps(['size'])

// 该 prop 变更时计算属性也会自动更新
const normalizedSize = computed(() => props.size.trim().toLowerCase())
```
## <font color=orange>事件</font>
在组件的模板表达式中，可以直接使用 $emit 方法触发自定义事件 (例如：在 v-on 的处理函数中)：
```html
<!-- MyComponent -->
<button @click="$emit('someEvent')">click me</button>
```
父组件可以通过 v-on (缩写为 @) 来监听事件：
```html
<MyComponent @some-event="callback" />
```
## <font color=orange>组件v-model</font>
当使用在一个组件上时，v-model 会被展开为如下的形式：
```html
<CustomInput
  :model-value="searchText"
  @update:model-value="newValue => searchText = newValue"
/>
```
要让这个例子实际工作起来，`<CustomInput>` 组件内部需要做两件事：
1.将内部原生 `<input>` 元素的 value attribute 绑定到 modelValue prop
2.当原生的 input 事件触发时，触发一个携带了新值的 update:modelValue 自定义事件
```html
<!-- CustomInput.vue -->
<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

### v-model的参数
默认情况下，v-model 在组件上都是使用 modelValue 作为 prop，并以 update:modelValue 作为对应的事件。我们可以通过给 v-model 指定一个参数来更改这些名字：
```html
<MyComponent v-model:title="bookTitle" />
```
在这个例子中，子组件应声明一个 title prop，并通过触发 update:title 事件更新父组件值：
```html
<!-- MyComponent.vue -->
<script setup>
defineProps(['title'])
defineEmits(['update:title'])
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```
## <font color=orange>透传attributes</font>
“透传 attribute”指的是传递给一个组件，却没有被该组件声明为 props 或 emits 的 attribute 或者 v-on 事件监听器。当一个组件以单个元素为根作渲染时，透传的 attribute 会自动被添加到根元素上。

我们想要所有像 class 和 v-on 监听器这样的透传 attribute 都应用在内部的 `<button>` 上而不是外层的 `<div>` 上。我们可以通过设定 inheritAttrs: false 和使用 v-bind="$attrs" 来实现：
```html
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">click me</button>
</div>
```
```js
<script setup>
// 3.3开始
defineOptions({
  inheritAttrs: false
})
</script>
```
### 在 JavaScript 中访问透传 Attributes
```js
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```
如果没有使用 `<script setup>`，attrs 会作为 setup() 上下文对象的一个属性暴露：
```js
export default {
  setup(props, ctx) {
    // 透传 attribute 被暴露为 ctx.attrs
    console.log(ctx.attrs)
  }
}
```
## <font color=orange>插槽</font>
### 默认插槽
```html
<button type="submit">
  <slot>
    Submit <!-- 默认内容 -->
  </slot>
</button>
```
如果不提供内容，如`<SubmitButton />`就会渲染默认内容`<button type="submit">Submit</button>`，
如果提供了插槽内容`<SubmitButton>Save</SubmitButton>`，渲染时就会显示提供的内容`<button type="submit">Save</button>`
### 具名插槽
有时在一个组件中包含多个插槽出口是很有用的。举例来说，在一个 `<BaseLayout>` 组件中，有如下模板：对于这种场景，`<slot>` 元素可以有一个特殊的 attribute name，用来给各个插槽分配唯一的 ID，以确定每一处要渲染的内容：
```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```
要为具名插槽传入内容，我们需要使用一个含 v-slot 指令的 `<template>` 元素，并将目标插槽的名字传给该指令：v-slot 有对应的简写 `#`
```html
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```
当一个组件同时接收默认插槽和具名插槽时，所有位于顶级的非 `<template>` 节点都被隐式地视为默认插槽的内容。所以上面也可以写成：
```html
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <!-- 隐式的默认插槽 -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```
### 作用域插槽
`插槽的内容无法访问到子组件的状态。`
然而在某些场景下插槽的内容可能想要同时使用父组件域内和子组件域内的数据。要做到这一点，我们需要一种方法来`让子组件在渲染时将一部分数据提供给插槽`。

分两种情况
#### 默认作用域插槽
可以像对组件传递 props 那样，向一个插槽的出口上传递 attributes：
```html
<!-- <MyComponent> 的模板 -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```
通过子组件标签上的 v-slot 指令，直接接收到了一个插槽 props 对象：
```html
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```
#### 具名作用域插槽
向具名插槽中传入 props：
```html
<slot name="header" message="hello"></slot>
```
具名作用域插槽的工作方式也是类似的，插槽 props 可以作为 v-slot 指令的值被访问到：v-slot:name="slotProps"。当使用缩写时是这样：
```html
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```
`注意：`
如果同时使用了具名插槽与默认插槽，则需要为默认插槽使用显式的 `<template>` 标签。尝试直接为组件添加 v-slot 指令将导致编译错误。这是为了避免因默认插槽的 props 的作用域而困惑。
为默认插槽使用显式的 `<template>` 标签有助于更清晰地指出 message 属性在其他插槽中不可用：
```html
<template>
  <MyComponent>
    <!-- 使用显式的默认插槽 -->
    <template #default="{ message }">
      <p>{{ message }}</p>
    </template>

    <template #footer>
      <p>Here's some contact info</p>
    </template>
  </MyComponent>
</template>
```
# <font color=red>逻辑复用</font>
## <font color=orange>组合式函数</font>
## <font color=orange>自定义指令</font>
一个自定义指令由一个`包含`类似组件`生命周期钩子`的`对象`来定义。钩子函数会接收到指令所绑定元素作为其参数。
```html
<script setup>
// 在模板中启用 v-focus
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```
在没有使用 `<script setup>` 的情况下，自定义指令需要通过 directives 选项注册：
```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // 在模板中启用 v-focus
    focus: {
      /* ... */
    }
  }
}
```
将一个自定义指令全局注册到应用层级也是一种常见的做法：
```js
const app = createApp({})

// 使 v-focus 在所有组件中都可用
app.directive('focus', {
  /* ... */
})
```
### 指令钩子
一个指令的定义对象可以提供几种钩子函数 (都是可选的)：
```js
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode, prevVnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode, prevVnode) {}
}
```
### 简化形式
对于自定义指令来说，一个很常见的情况是仅仅需要在 mounted 和 updated 上实现相同的行为，除此之外并不需要其他钩子。这种情况下我们可以直接用一个函数来定义指令，如下所示：
```js
app.directive('color', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value
})
```
### 对象字面量
如果你的指令需要多个值，你可以向它传递一个 JavaScript 对象字面量。别忘了，指令也可以接收任何合法的 JavaScript 表达式。
```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```
```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```
## <font color=orange>插件</font>
### 定义
一个插件可以是一个拥有 install() 方法的对象，也可以直接是一个安装函数本身。安装函数会接收到安装它的应用实例和传递给 app.use() 的额外选项作为参数：
```js
const myPlugin = {
  install(app, options) {
    // 配置此应用
  }
}
```
### 使用
```js
app.use(myPlugin, {
  /* 可选的选项 */
})
```