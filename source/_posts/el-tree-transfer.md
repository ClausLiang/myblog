---
title: 结合el-tree和el-transfer做一个树形穿梭框
date: 2022-02-18 23:25:17
updated: 2022-02-18
tags: element
categories: vue
---


![image.png](/images/transfer-2022-02-18.png)
项目中有个需求是树形穿梭框，element的穿梭框又不支持，所以得想办法。看到一个大佬改造el-transfer的方案，受到很多启发。记录一下自己改造的过程。
### 1.拷贝el-transfer的源码放到项目中
>我用的element的版本是2.15.7（不同版本的源码可能不一样），vue的版本是2.6.11。

具体步骤是在github上搜索element，下载tag是2.15.7的源码zip包，解压，拷贝packages/transfer/src中的vue文件，放到项目的components/tree-transfer目录。


将main.vue文件名改为index.vue方便引用

在项目中引用拷贝的transfer源码的组件，效果和使用el-transfer效果一致
```html
<my-el-tree-transfer
    v-model="treeChecked"
    :data="treeData"
    :titles="['请选择功能', '已选择功能']"
    @change="transferChange"
    target-order='push'>
</my-el-tree-transfer>
...
import myElTreeTransfer from '@/components/treeTransfer'
export default {
    data(){
        // 初始的数据源
        functionSourceArray: [
            { key: 1, label: '功能1' },
            { key: 2, label: '功能2' },
            { key: 3, label: '功能3' },
            { key: 4, label: '功能4' },
        ],
        treeChecked: [],
        // 改造后数据源需要tree结构的数据
        treeData: [
            {
                label: '一级 1', children: [
                    { key: 2, label: '二级 1-1' },
                    { key: 3, label: '二级 1-2' },
                ]
            },
            {
                label: '一级 2', children: [
                    { key: 5, label: '二级 2-1' },
                    { key: 6, label: '二级 2-2' },
                ]
            },
        ]
    }
}

```

![image.png](/images/transfer2-2022-02-18.png)
### 2.准备改造el-transfer的源码
阅读代码发现index.vue的dom由三部分组成，左边的panel、中间的操作按钮，右边的panel。

经过分析需要修改左边的panel部分，以及组件入口index.vue。
### 3.拷贝一份pannel.vue并改名
最终改造完成的transfer左边是一个tree，右边还是原来的结构。拷贝一份transfer-panel.vue并修改名字为tree-transfer-panel.vue。修改index.vue中的第一部分的引用
```html
// index.vue
<div class="el-transfer">
    <tree-transfer-panel ...></tree-transfer-panel>
    <div class="el-transfer__buttons">...</div>
    <transfer-panel ...></transfer-panel>
</div>
...
import TreeTransferPanel from './tree-transfer-panel.vue';
```

### 4.修改tree-transfer-panel.vue
先将中间部分的checked-group替换为`el-tree`
```html
// tree-transfer-panel.vue
<div :class="['el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']">
    <el-input class="el-transfer-panel__filter" v-model="query" size="small" :placeholder="placeholder"
        @mouseenter.native="inputHover = true" @mouseleave.native="inputHover = false" v-if="filterable">
        <i slot="prefix" :class="['el-input__icon', 'el-icon-' + inputIcon]" @click="clearQuery"></i>
    </el-input>
    <!-- 原先的el-checkbox-group -->
    <!-- <el-checkbox-group v-model="checked" v-show="!hasNoMatch && data.length > 0"
        :class="{ 'is-filterable': filterable }" class="el-transfer-panel__list">
        <el-checkbox class="el-transfer-panel__item" :label="item[keyProp]" :disabled="item[disabledProp]"
            :key="item[keyProp]" v-for="item in filteredData">
            <option-content :option="item"></option-content>
        </el-checkbox>
    </el-checkbox-group> -->
    <!-- 替换后的el-tree -->
    <el-tree :data="filteredData" node-key="key" default-expand-all show-checkbox :default-checked-keys="checked" @check="treeCheckChange"></el-tree>
    <p class="el-transfer-panel__empty" v-show="hasNoMatch">{{ t('el.transfer.noMatch') }}</p>
    <p class="el-transfer-panel__empty" v-show="data.length === 0 && !hasNoMatch">{{ t('el.transfer.noData') }}
    </p>
</div>
```
添加`el-tree`选择的event
> `@check` **当复选框被点击的时候触发** 共两个参数，依次为：传递给 `data` 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性<br><br>checkedKeys选中的key<br>halfCheckedKeys半选中的key
```js
treeCheckChange(cur,checkedInfo){
    const {checkedKeys} = checkedInfo
    this.checked = checkedKeys
}
```
这个时候看浏览器页面，结构已经变为我们希望看到的样子。但是操作一下就能发现有问题。
### 5.修改index.vue
先把dom结构的第一个panel换为tree-transfer-panel.vue
```html
<div class="el-transfer">
    <tree-transfer-panel ...
```
左边的panel及右边的panel`:data`数据都是计算属性，右边的结构没有改变，左边的结构变为了tree，所以只需要把左边的`:data`改变即可。原来的数据结构是一维数组，现在的是二维数组，数据源需要根据数据结构做相应的改变。

这个`sourceData`作用是每次把左边的数据添加到右边以后需要把添加的数据从左边去掉。
```js
// index.vue
sourceData() {
    let temp = []
    const originalData = this.data
    for(let i=0; i<originalData.length;i++){
        temp.push({label: originalData[i].label})
        temp[i].children = []
        for(let j=0; j<originalData[i].children.length; j++){
            let tempKey = originalData[i].children[j].key
            if(this.value.indexOf(tempKey) === -1){
                temp[i].children.push(originalData[i].children[j])
            }
        }
    }
    return temp
    // return this.data.filter(item => this.value.indexOf(item[this.props.key]) === -1);
},
```
修改完以后每次往右边添加左边的该数据就会消失。但是此时右边并没有显示出左边添加过去的数据，此时需要修改`addToRight`方法
```js
addToRight() {
    let currentValue = this.value.slice();
    const itemsToBeMoved = [];
    const key = this.props.key;
    let dataTemp = []
    // 该处是修改部分，数据结构变为二维以后，需要把第二层的数据放到数据源中
    this.data.forEach(item=>{
        dataTemp = dataTemp.concat(item.children)
    })
    dataTemp.forEach(item => {
        const itemKey = item[key];
        if (
            this.leftChecked.indexOf(itemKey) > -1 &&
            this.value.indexOf(itemKey) === -1
        ) {
            itemsToBeMoved.push(itemKey);
        }
    });
    currentValue = this.targetOrder === 'unshift'
        ? itemsToBeMoved.concat(currentValue)
        : currentValue.concat(itemsToBeMoved);
    this.$emit('input', currentValue);
    this.$emit('change', currentValue, 'right', this.leftChecked);
},
```
右边panel展示的数据`computed`由于用到的`dataObj`，所以计算属性dataObj也要做相应调整
```js
dataObj() {
    const key = this.props.key;
    let temp = []
    // 获取第二层的数据
    this.data.forEach(item=>{
        temp = temp.concat(item.children)
    })
    return temp.reduce((o, cur) => (o[cur[key]] = cur) && o, {});
    // return this.data.reduce((o, cur) => (o[cur[key]] = cur) && o, {});
},
```
至此基本上工作已经做完了。右边添加到左边的方法不需要修改。
### 6.总结
基本功能已经实现，从标题上的全选以及反选功能还没有改造，这个不影响大局，可以先隐藏掉该功能。希望这篇文章能帮到您。

我在阅读element的源码中发现其中对`数组reduce方法`的使用很巧妙，搜了一篇reduce的文章可以帮助您理解reduce的功效（[reduce文章url](https://juejin.cn/post/7011096419985522701)）

参考文章：[juejin](https://juejin.cn/post/6844904048982753287)<br>
本例子的 [gitee源码](https://gitee.com/clausliang/vue2-project)

