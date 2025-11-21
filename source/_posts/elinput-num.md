---
title: input输入框限制输入的几种情形
date: 2020-10-13 16:29:46
updated: 2025-04-30
tags: 基础
categories: 基础
---
<script type="text/javascript" src="/myblog/custom.js"></script>
> 利用input方法限制输入框只能输入限制范围内的数字

# el-input限制只能整数
```html
<!-- 只能输入数字 -->
<el-input v-model="abc" @input="abc=abc.replace(/\D/g,'')"></el-input>

```
# el-input限制只能两位小数（限制不超过100的两位小数）
```html
<!-- 只能 0～100.00之间的 两位小数 -->
<el-input v-model="minProportionValue" 
 @input="minProportionValue = formatTwoDecimal(minProportionValue, 100)"
>
</el-input>
```
```js
/**
 * 不超过某个值的正数，小数位数最多两位
 * @value
 * @maxNumber 最大值
 * @isIncludeMax true 不包含maxNumber false包含
 */
formatTwoDecimal(value, maxNumber, isIncludeMax) {
  value = value.replace(/[^\d.]/g, ''); // 只能数字和小数点
  value = value.replace(/^\./g, ''); // 不能开头是.
  value = value.replace(/\.{2,}/g, "."); // 只能一个小数点
  // 为了处理可能出现多个小数点的情况，
  // 先将第一个小数点替换为临时字符串$#$，然后去除所有的小数点，再将临时字符串替换回小数点
  value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  // 保留两位小数，并移除多余部分
  value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
  // 没有小数点时，将值转为整数
  if (value.indexOf('.') < 0 && value != '') {
    value = parseInt(value);
  }
  // 设置最大限制，当超过最大值时，无法输入
  if (maxNumber) {
    const bool = isIncludeMax ? +value >= maxNumber : +value > maxNumber;
    if (bool) {
      let valueString = String(value)
      value = valueString.slice(0, valueString.length - 1)
    }
  }
  return value
}
```
# 原生input限制输入四位小数
## 方法1:在每次输入发生变化时，使用正则表达式来验证输入内容是否符合要求。如果不符合，就将输入框的值恢复为上一次符合要求的值。
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF - 8">
  <title>限制输入数字和小数位数</title>
</head>

<body>
  <input type="text" id="inputBox">
  <script>
    const inputBox = document.getElementById('inputBox');
    let lastValidValue = '';
    inputBox.addEventListener('input', function () {
      const value = this.value;
      const regex = /^\d*(\.\d{0,4})?$/;
      // 符合正则，记录下来最后的结果
      if (regex.test(value)) {
        lastValidValue = value;
      } else {
        // 不符合，就恢复到上一次的结果
        this.value = lastValidValue;
      }
    });
  </script>
</body>

</html>
```
## 方法2:使用replace方法替换输入内容
该方法和上述限制两位小数的方法类似，具体不同的地方为限制小数位数的方式
```js
numberInput.addEventListener('input', function () {
  this.value = this.value.replace(/[^\d.]/g, '');// 只保留数字和小数点
  this.value = this.value.replace(/^\./g, '');// 不以小数点开头
  this.value = this.value.replace(/\.{2,}/g, '.');// 只有一个小数点
  // 为了处理可能出现的多个小数点情况，
  // 先将第一个小数点替换为一个临时字符串$#$，然后去除所有小数点，再将临时字符串替换回小数点
  this.value = this.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  // 只保留四位小数
  if (this.value.split('.').length > 1) {
    this.value = this.value.split('.')[0] + '.' + this.value.split('.')[1].substring(0, 4);
  }
});
```
# a-input限制输入字母和数字
遇到了@input="data.inputValue.replace(/[^a-zA-Z0-9]/g, '')"不生效的情况，可采用如下写法
```html
<a-input :value="data.inputValue" @input="inputChange" :maxlength="20"></a-input>
const inputChange = e => {
  const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
  data.inputValue = value;
  e.target.value = value; // 强制更新输入框的值
};
```
