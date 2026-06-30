---
title: 学习python的笔记
date: 2026-06-30 11:03:17
updated: 2026-06-30
tags: python
categories: python
---
<script type="text/javascript" src="/myblog/custom.js"></script>

# 快速开始
1. 安装Python程序。官网下载地址https://www.python.org/downloads/
2. 写一个后缀为py的脚本test.py，写一行代码 `print('hello')`，在终端执行`python test.py`就能看到执行结果。

# 语法
## 数据类型6种
数值（int float complex(复数) bool）
字符串str
列表list（可变序列）
元组tuple（不可变序列）
集合set（元素唯一无序）
字典dict（键值对）
特殊数据类型None

---
float类型计算会有精度问题，可以引入decimal
```py
from decimal import Decimal
f1 = Decimal('0.1')
f2 = Decimal('0.2')
f3 = f1 + f2
print(f3)
```
python3中，bool是int的子类

## 内置函数
```
print() # 打印
type() # 获取数据类型 print(type(1)) 打印 <class 'int'>
isinstance(1, int) # 判断数据是不是某个类型 返回True/False
id(1) # 获取对象在内存中的地址 print(id(1))打印 140718693467256 (-5~256都是同一个地址，小整数池)
```