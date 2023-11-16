---
title: 搜索表格数据但不影响表格的数据选中，怎么做？
date: 2023-11-16 10:47:24
tags: antd
categories: vue
---
场景：表格数据勾选了某条数据或某几条数据，再通过搜索框搜索数据，此时界面上看不到刚才已勾选的数据，但是点击提交时却需要提交所有刚刚勾选的数据。
搜索出来的数据勾选或取消勾选，当重新搜索或重置搜索时，勾选不会受影响。

这就需要做一些特殊操作，不能直接把selectedRowKeys赋值给`选中的keys`，具体应该怎么处理，请看下文。
![图片](https://liangyonggang.com/imgasset/tableCheck-23-11-16.png)

```html
<a-table
  @change="handleTableChange"
  :row-selection="{
    selectedRowKeys: data.selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: checkboxPropsFn,
  }"
  :loading="data.loading"
  :columns="data.columns"
  :data-source="data.dataList"
  :pagination="showPage ? data.options : false"
>
</a-table>
```
```js
const data = reactive({
  dataList: [], //数据源
  selectedRowKeys: [],// 选中的key
  options: {
    position: ['bottomRight'],
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50', '100', '200'],
    current: 1, //当前页数
    pageSize: 9999, // 不分页
    total: 0,
    pages: 0,
    onChange: page => {
      data.options.current = page;
    },
    onShowSizeChange: (_current, size) => {
      data.options.pageSize = size;
    },
  },
})
// 翻页函数
const handleTableChange = () =>{}

// 勾选发生变化时
// const onSelectChange = selectedRowKeys => {data.selectedRowKeys = selectedRowKeys} 
// 显然是不行的
const onSelectChange = selectedRowKeys => {
  // 未选中的
  const listIds = data.dataList
    .map(item => item.roleId)
    .filter(item => !selectedRowKeys.includes(item));

  // 原来选中的并去掉新去掉的（未选中的）
  const oldIds = data.selectedRowKeys.filter(item => !listIds.includes(item));

  data.selectedRowKeys = [...new Set(oldIds.concat(selectedRowKeys))];
};

// 是否展示分页器，不展示。
const showPage = computed(() => data.options.total > 9999);

// 特殊数据不允许选择或取消
const checkboxPropsFn = record => ({
  disabled: record.roleName == '企业管理员' && data.creator,
});

```

