---
title: sortablejs实现拖拽功能
date: 2025-10-29 16:47:26
tags: vue
categories: vue
---
<script type="text/javascript" src="/myblog/custom.js"></script>

> vue项目中实现拖拽功能有两个现有的插件，sortablejs和vuedraggable。
vuedraggable是基于sortablejs封装的。

在Vue项目中，结合 `<div v-for="item in list"></div>` 和 sortable.js 实现拖拽排序是一个常见需求。
或者是对一个表格的行进行拖拽排序，也是一个常见需求。
# 安装Sortable.js
```
npm install sortablejs --save
```
# 在Vue组件中的使用说明
## 一个普通的列表
```html
<template>
  <div>
    <!-- 这是你的拖拽列表容器 -->
    <div ref="sortableList">
      <!-- 使用v-for渲染列表 -->
      <div v-for="item in list" :key="item.id" class="sortable-item">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<script>
const sortableList = ref(null); // 获取DOM引用
const list = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
]);

onMounted(() => {
  // 初始化Sortable
  const sortable = Sortable.create(sortableList.value, {
    animation: 150, // 动画时长
    ghostClass: 'sortable-ghost', // 拖拽时占位符的样式
    chosenClass: 'sortable-chosen', // 被选中项的样式
    dragClass: 'sortable-drag', // 正在被拖拽项的样式

    // 拖拽结束时的回调函数，非常重要！
    onEnd: function ({ oldIndex, newIndex }) {
      if (oldIndex === newIndex) return;
      
      // 获取要移动的项
      const movedItem = list.value.splice(oldIndex, 1)[0];
      // 移动到新的位置
      list.value.splice(newIndex, 0, movedItem);
      
    },
  });
});

</script>
```

## a-table表格数据的拖拽排序
原理和普通的列表一样，区别在于获取到表格的tbody节点
```html
<template>
  <a-table ref="tableRef"></a-table>
</template>
<script>
const tbody = tableRef.value.$el.querySelector('.ant-table-tbody');
const sortable = Sortable.create(tbody, {
  ...同上
});
</script>

```
# vuedraggable怎么实现拖拽
## 安装 Vue.Draggable
```
npm install vuedraggable --save
```
## 在Vue组件中使用
```html
<template>
  <div>
    <!-- 使用draggable组件 -->
    <draggable 
      v-model="list" 
      item-key="id"
      @end="onDragEnd"
      class="drag-area"
    >
      <template #item="{ element }">
        <!-- 这里定义每个列表项如何渲染 -->
        <div class="drag-item">
          {{ element.name }}
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  data() {
    return {
      list: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ],
    };
  },
  methods: {
    onDragEnd(evt) {
      console.log('拖拽结束，新顺序:', this.list);
      // 因为使用了v-model，数据已经自动更新了
    },
  },
};
</script>
```
对于大多数Vue项目，如果你希望更快的上手和更少的代码，可以使用 Vue.Draggable。如果你需要进行非常底层的自定义或控制，那么直接使用 Sortable.js 会更合适。