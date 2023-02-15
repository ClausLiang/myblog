---
title: el-input输入框限制输入数字
date: 2020-10-13 16:29:46
tags:
    - element
    - vue
categories: 基础
---

> 利用input方法限制输入框只能输入限制范围内的数字
```html
<!-- 只能输入数字 -->
<el-input
    v-model="abc"
    @input="abc=abc.replace(/\D/g,'')"
></el-input>

<!-- 只能 0～100.00之间的 两位小数 -->
<el-input
    v-model="minProportionValue"
    @input="minProportionValue = formatTwoDecimal(minProportionValue, 100)"
>
</el-input>
```

```js
/**
 * 不超过某个值的正数，小数位数最多两位
 * @value
 * @maxNumber 最大值
 * @isIncludeMax true不能输入maxNumber false 能输入
 */
formatTwoDecimal(value, maxNumber, isIncludeMax) {
    value = value.replace(/[^\d.]/g, ''); // 只能数字
    value = value.replace(/\.{2,}/g, "."); // 只能一个小数点
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    if (value.indexOf('.') < 0 && value != '') {
        value = parseInt(value);
    }
    // 设置最大限制
    if (maxNumber) {
        const bool = isIncludeMax ? +value >= maxNumber : +value > maxNumber;
        if (bool) {
           let valueString = String(value)
           value = valueString.slice(0, valueString.length - 1)
        }
    }
    if (value === '.') {
        value = '0.'
    }
    return value
},
```
