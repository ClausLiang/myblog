---
title: variableTextarea可插入变量的文本框
date: 2025-10-30 09:22:12
tags: vue
categories: vue
---
<script type="text/javascript" src="/myblog/custom.js"></script>

![图片](/images/variableTextarea-2-25-10-30.png)

项目中这样一个需求：配置一个消息的模板，可输入文字，可插入变量。

在Ant-Design-Vue中，原生的a-textarea组件并不直接支持插入类似标签的特殊节点或变量。但是，我们可以通过一些变通的方法来实现。具体思路如下：使用可编辑 Div 配合隐藏的 a-textarea 模拟文本框。
# 封装variableTextarea组件
```html
<template>
  <div class="variable-textarea-container">
    <!-- 可编辑区域 -->
    <div
      ref="editableDiv"
      class="editable-div"
      contenteditable="true"
      @input="handleInput"
      @paste="handlePaste"
      @keydown="handleKeydown"
      @blur="handleBlur"
      @focus="handleFocus"
    ></div>

    <!-- 隐藏的文本域，用于表单提交 -->
    <a-textarea v-model:value="internalValue" style="display: none" />

    <!-- 变量选择器 -->
    <div class="variable-selector">
      <span class="selector-label">插入变量：</span>
      <a-button
        v-for="variable in availableVariables"
        :key="variable.name"
        size="small"
        style="margin-right: 8px; margin-bottom: 4px"
        :disabled="internalValue.includes(variable.name)"
        @click="insertVariable(variable)"
      >
        {{ variable.label }}
      </a-button>
      <div class="tip">{{ countInputValue.length }}/50</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

// 传入属性
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  // 可用的变量列表
  availableVariables: {
    type: Array,
    default: () => []
  }
});

// 事件定义
const emit = defineEmits(['change', 'focus', 'blur']);

// 响应式数据
const editableDiv = ref(null); // 可编辑的div元素引用
const internalValue = ref(''); // 内部存储的文本值
const isFocused = ref(false); // 是否聚焦状态
const countInputValue = ref(''); // 计算纯文本长度

// 监听外部值变化
watch(
  () => props.modelValue,
  newVal => {
    if (newVal !== internalValue.value) {
      internalValue.value = newVal;
      // updateDivContent();
    }
  }
);
watch(
  () => props.availableVariables.length,
  value => {
    if (value > 0) {
      updateDivContent();
    }
  }
);

// 监听内部值变化
watch(internalValue, newVal => {
  emit('change', newVal);
  countInputValue.value = internalValue.value.replace(/\{([^}]+)\}/g, '');
});

// 将纯文本转换为带变量标签的HTML
const parseContentToHTML = text => {
  if (!text) return '';

  // 匹配 {variable} 格式的变量
  const regex = /\{([^}]+)\}/g;
  return text.replace(regex, (match, variableName) => {
    const variable = props.availableVariables.find(v => v.name === match);
    const label = variable ? variable.label : variableName;
    return `<span class="variable-tag" contenteditable="false" data-variable="${match}">${label}</span>`;
  });
};

// 将HTML内容转换为纯文本
const parseHTMLToText = html => {
  if (!html) return '';

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // 遍历所有变量标签，恢复为 {variable} 格式
  const variableTags = tempDiv.querySelectorAll('.variable-tag');
  variableTags.forEach(tag => {
    const variableName = tag.getAttribute('data-variable');
    tag.replaceWith(`${variableName}`);
  });

  return tempDiv.textContent || tempDiv.innerText || '';
};

// 更新可编辑div的内容
const updateDivContent = () => {
  if (editableDiv.value) {
    editableDiv.value.innerHTML = parseContentToHTML(internalValue.value);
  }
};

// 处理输入事件
const handleInput = event => {
  const html = event.target.innerHTML;
  internalValue.value = parseHTMLToText(html);
};

// 处理粘贴事件（只保留纯文本）
const handlePaste = event => {
  event.preventDefault();
  const text = event.clipboardData.getData('text/plain');
  document.execCommand('insertText', false, text);
};

// 处理按键事件
const handleKeydown = event => {
  // 退格键或删除键处理
  if (event.key === 'Backspace' || event.key === 'Delete') {
    handleDeleteKey(event);
  }
};

// 处理删除键逻辑
const handleDeleteKey = event => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const startContainer = range.startContainer;

  // 如果光标在变量标签后面，删除整个变量标签
  if (startContainer.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
    const previousSibling = startContainer.previousSibling;
    if (previousSibling && previousSibling.classList.contains('variable-tag')) {
      event.preventDefault();
      previousSibling.remove();
      handleInput({ target: editableDiv.value });
    }
  }
};

// 处理焦点事件
const handleFocus = event => {
  isFocused.value = true;
  emit('focus', event);
};

// 处理失焦事件
const handleBlur = event => {
  isFocused.value = false;
  emit('blur', event);
};

// 插入变量
const insertVariable = async variable => {
  if (!editableDiv.value) return;

  // 确保可编辑区域有焦点
  if (!isFocused.value) {
    editableDiv.value.focus();
    await nextTick();
  }

  const variableHTML = `<span class="variable-tag" contenteditable="false" data-variable="${variable.name}">${variable.label}</span>`;

  // 获取当前选区
  const selection = window.getSelection();

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);

    // 检查选区是否在可编辑区域内
    if (!editableDiv.value.contains(range.commonAncestorContainer)) {
      // 如果不在，将光标移到末尾
      range.selectNodeContents(editableDiv.value);
      range.collapse(false);
    }

    // 删除选区内容（如果有）
    range.deleteContents();

    // 创建变量节点并插入
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = variableHTML;
    const variableNode = tempDiv.firstChild;

    range.insertNode(variableNode);

    // 将光标移动到变量后面
    const newRange = document.createRange();
    newRange.setStartAfter(variableNode);
    newRange.setEndAfter(variableNode);
    selection.removeAllRanges();
    selection.addRange(newRange);
  } else {
    // 如果没有选区，则追加到末尾
    editableDiv.value.innerHTML += variableHTML;
  }

  // 触发input事件同步数据
  handleInput({ target: editableDiv.value });

  // 重新聚焦到可编辑区域
  editableDiv.value.focus();
};

// 提供方法给父组件调用
defineExpose({
  insertVariable,
  focus: () => {
    if (editableDiv.value) {
      editableDiv.value.focus();
    }
  }
});
</script>

<style scoped>
.variable-textarea-container {
  border: 1px solid #dee0e9;
  border-radius: 6px;
  background-color: #fff;
  transition: all 0.3s;
}

.variable-textarea-container:focus-within {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}

.editable-div {
  min-height: 100px;
  max-height: 300px;
  padding: 8px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 2.5;
  font-family: inherit;
  font-size: 14px;
}

.editable-div:empty:before {
  content: attr(placeholder);
  color: #bfbfbf;
}

.variable-selector {
  padding: 8px 12px 4px;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  position: relative;
}
.variable-selector .tip {
  position: absolute;
  right: 2px;
  top: 2px;
  font-size: 12px;
  color: #999;
}

.selector-label {
  font-size: 14px;
  color: #666;
  margin-right: 8px;
}

/* 变量标签样式 */
:deep(.variable-tag) {
  display: inline-block;
  padding: 2px 8px;
  margin: 0 2px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  color: #1890ff;
  font-size: 12px;
  line-height: 1.5;
  user-select: none;
  cursor: default;
  vertical-align: middle;
}
</style>

```
# 组建使用示例
```html
<template>
  <div class="demo-container">
    <h3>带变量的文本框示例</h3>
    
    <div class="form-item">
      <label>消息模板：</label>
      <VariableTextarea 
        v-model:modelValue="messageTemplate"
        :available-variables="variables"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>
    
    <div class="preview">
      <h4>预览效果：</h4>
      <div class="preview-content">{{ parsedMessage }}</div>
    </div>
    
    <div class="current-value">
      <h4>当前值（纯文本）：</h4>
      <pre>{{ messageTemplate }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import VariableTextarea from './VariableTextarea.vue'

// 响应式数据
const messageTemplate = ref('亲爱的{{username}}，您的订单{{orderId}}已于{{date}}发货。')

// 可用变量列表
const variables = ref([
  { name: 'username', label: '用户名' },
  { name: 'orderId', label: '订单号' },
  { name: 'date', label: '日期' },
  { name: 'amount', label: '金额' },
  { name: 'address', label: '地址' }
])

// 解析消息模板（模拟真实数据）
const parsedMessage = computed(() => {
  return messageTemplate.value
    .replace('{{username}}', '张三')
    .replace('{{orderId}}', 'ORD2023123456')
    .replace('{{date}}', '2023-12-20')
    .replace('{{amount}}', '¥258.00')
    .replace('{{address}}', '北京市朝阳区')
})

// 事件处理
const handleChange = (value) => {
  console.log('内容变化:', value)
}

const handleFocus = (event) => {
  console.log('获得焦点', event)
}

const handleBlur = (event) => {
  console.log('失去焦点', event)
}
</script>

<style scoped>
.demo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.preview, .current-value {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background-color: #fafafa;
}

.preview-content {
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  min-height: 40px;
}

pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
```

# 功能特点
1. 变量插入：通过按钮插入预定义的变量标签

2. 双向绑定：支持 v-model 绑定，与表单系统集成

3. 纯文本存储：实际存储的是包含 {variable} 格式的纯文本

4. 视觉反馈：变量在编辑器中显示为特殊标签样式

5. 完整事件：支持 focus、blur、change 等事件

6. 快捷键处理：正确处理删除键等操作

# 实现原理
1. 使用 contenteditable="true" 的 div 作为可视化编辑器

2. 使用隐藏的 a-textarea 存储和同步纯文本数据

3. 通过正则表达式在纯文本和 HTML 表示之间转换

4. 变量标签设置为 contenteditable="false" 防止内部编辑

