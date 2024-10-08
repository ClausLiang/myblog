---
title: markdown语法
date: 2024-01-04 14:22:15
tags: markdown
categories: 基础
---
<script type="text/javascript" src="/myblog/custom.js"></script>

# 标题(一级标题对应h1)
后面得有个空格
```md
# 一级标题 对应h1
## 二级标题 对应h2
### 三级标题 对应h3
#### 四级标题 对应h4
##### 五级标题 对应h5
###### 六级标题 对应h6
```
效果如下（数字序号1.1.1是我自己加的）：
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题


# 引用说明区块
```md
> 此处是引用
```
> 此处是引用

# 代码块
## 少量代码 单行使用
`<html></html>`
## 大量代码 多行使用
```md
<html>
  <body></body>
</html>
```

# 图片
```md
![图片描述](url)
```

# 分隔符
```md
---
```
---

```md
***
```
***

# 强调
## 斜体
```md
*斜体*
```
*斜体*

## 加粗
```md
**加粗**
```
**加粗**

## 删除线
```md
~~删除线~~
```
~~删除线~~

# 转义
```md
\\
```
\\ 转义

# 表格
```md
|姓名|年龄|性别|学号|
|:-:|:-:|:-:|:-:|
|张三|18|男|001|

```
|姓名|年龄|性别|学号|
|:-:|:-:|:-:|:-:|
|张三|18|男|001|

# 列表
## 无序列表
形式一：
```md
+ a
+ b
+ c
```
+ a
+ b
+ c

形式二：
```md
- a
- b
- c
```
- a
- b
- c

形式三：
```md
* a
* b
* c
```
* a
* b
* c
## 有序列表
正常情况：
```md
1. a
2. b
3. c
```
1. a
2. b
3. c

序号写错会按第一个往下顺延：
```md
3. d
1. e
4. f
```
3. d
1. e
4. f
