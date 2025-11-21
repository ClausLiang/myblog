---
title: a-tree右侧的checkbox
date: 2023-11-08 09:45:58
updated: 2023-11-08
tags: antd
categories: vue
---
业务场景中，分配职责权限，职责权限是树的结构，需求是树的左侧为新勾选的职责，数的右侧为用户的角色带的职责。如图所示。
树用的是`ant-design-vue`的a-tree，该组件默认是没有右侧的checkbox的，但是它提供的插槽可供开发人员自定义树中每个节点的展示形式。所以我们可以通过插槽的形式自定义树的节点。
`该需求的难点是右侧checkbox的选中时，实现父级的全选与半选。`
![图片](/images/a-treewithcheckbox_2023-11-8.png)


```html
<a-input
  v-model:value="data.searchValue"
  placeholder="权限名称"
  style="width: 200px; margin: 8px 0"
  :maxlength="20"
  @change="searchFn"
>
  <template #suffix>
    <search-outlined style="color: rgba(0, 0, 0, 0.45)" />
  </template>
</a-input>
<a-tree
  v-if="data.permissionTrees.length"
  :auto-expand-parent="data.autoExpandParent"
  v-model:checkedKeys="data.checkedKeys"
  v-model:expandedKeys="data.expandedKeys"
  checkable
  :tree-data="data.permissionTrees"
  @expand="onExpand"
  @check="onCheck"
  :fieldNames="{
    title: 'name',
    key: 'code',
  }"
>
  <template #title="{ name, code, id, remark, children, roleDutyCodeAll, indeterminate }">
    <!-- 能匹配搜索的结果 -->
    <span
      v-if="name.indexOf(data.searchValue) > -1"
      class="tagName"
    >
      {{ name.substr(0, name.indexOf(data.searchValue)) }}
      <span style="color: #f50">{{ data.searchValue }}</span>
      {{ name.substr(name.indexOf(data.searchValue) + data.searchValue.length) }}
      <a-checkbox
        :checked="data.roleDutyCodes.includes(code) || roleDutyCodeAll"
        :indeterminate="indeterminate"
        disabled
        style="margin-left: 10px"
      ></a-checkbox>
    </span>
    <!-- 不匹配搜索的结果 -->
    <span @click="showDetailFn(name, id, remark, children)" v-else class="tagName">
      {{ name }}
      <a-checkbox
        :checked="data.roleDutyCodes.includes(code) || roleDutyCodeAll"
        :indeterminate="indeterminate"
        disabled
        style="margin-left: 10px"
      ></a-checkbox>
    </span>
  </template>
</a-tree>
```
```js
// data.permissionTrees: 树的tree-data
// data.aTitle: 树打平每个节点name和code作为item，存到数组中。初始[]
// data.roleDutyCodes: 角色的职责code数组
onMounted(async () => {
  await getData(); // 获取树的结构，--> data.permissionTrees
  await getDutyCodeList(); // 获取原先的职责，--> data.roleDutyCodes
  for (let i = 0; i < data.permissionTrees.length; i++) {
    recursionFn(data.permissionTrees[i], data.aTitle);
  }
  // 第二次执行，为了使父级的checkbox勾选，tree层级最多是3层，所以遍历两次就可以
  for (let i = 0; i < data.permissionTrees.length; i++) {
    recursionFn(data.permissionTrees[i], data.aTitle);
  }
  // 根据搜索为''时，把树的所有的code存到expandedKeys中，实现树的展开
  searchFn();
});
// 递归，实现了将tree结构的职责的所有name，code打平，存到一个数组中。
// 实现了右侧checkbox的全选与半选
const recursionFn = (tree, aFlat) => {
  aFlat.push({
    code: tree.code,
    name: tree.name,
  });
  if (tree.children && tree.children.length > 0) {
    tree.roleDutyCodeAll = false; // 全选
    tree.indeterminate = false; // 半选
    let count = 0;
    tree.children.forEach(item => {
      if (data.roleDutyCodes.includes(item.code)) {
        count++;
      }
      if (item.indeterminate) {// 子级只要存在半选，就把父级半选了
        tree.indeterminate = true;
      }
      recursionFn(item, aFlat);
    });
    if (tree.children.length == count) {
      tree.roleDutyCodeAll = true;
    } else if (count > 0) {
      tree.indeterminate = true;
    }
    tree.roleDutyCodeAll ? data.roleDutyCodes.push(tree.code) : '';
  } else {
    // data.isLeafs.push(tree.code); // 叶子结点（没有子级了）
  }
};
const onExpand = keys => {
  data.expandedKeys = keys;
  data.autoExpandParent = false;
};
const onCheck = () => {};
// 搜索
const searchFn = () => {
  data.searchValue = data.searchValue.trim();
  const expanded = data.aTitle.map(t => {
    if (t.name.indexOf(data.searchValue) > -1) {
      return getParentKey(t.code, data.permissionTrees);
    }
    return null;
  });
  data.expandedKeys = expanded;
  data.autoExpandParent = true;
};
// 递归 找出对应的父级key
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.code === key)) {
        parentKey = node.code;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
```
