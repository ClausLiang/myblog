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
## 执行命令
mac：要用python3 test1.py（历史原因导致的，python指向python2）
windows：python/py test1.py（py是别名）

# 语法
## 数据类型6种（总览）
数值（int float complex(复数) bool）
字符串str
列表list（可变序列）
元组tuple（不可变序列）
集合set（元素唯一无序）
字典dict（键值对）
特殊数据类型None


## 内置函数
- 获取数据类型 type()
```py
type(1) # print(type(1)) 打印 <class 'int'>
```

- 判断数据是不是某个类型
```py
isinstance(1, int) # 返回True/False
```

- 获取对象在内存中的地址
```py
id(1) # print(id(1))打印 140718693467256 (-5~256都是同一个地址，小整数池)
```

- 执行x表达式，并返回表达式的值
```py
eval(x)
```

- 输入 input()
```py
name = input('请输入你的名字：')
print('你好，' + name)
```

- 输出 print()
```py
print('a')
print('a', 'b', 'c', sep='-', end='!')
```
## 数值类型
### float类型计算会有精度问题，可以引入decimal
```py
from decimal import Decimal
f1 = Decimal('0.1')
f2 = Decimal('0.2')
f3 = f1 + f2
print(f3)
```
### python3中，bool是int的子类
True False的值分别是1 0

## 字符串str
### 编码解码
编码：将字符串转换为字节的过程
```py
str1 = '你好中国'
b1 = str1.encode(encoding='utf-8')
print(b1) #b'\xe4\xbd\xa0\xe5\xa5\xbd\xe4\xb8\xad\xe5\x9b\xbd'
```
解码：将字节数据转换为字符串的过程
```py
str1 = '你好中国'
b1 = str1.encode(encoding='utf-8')
str2 = b1.decode(encoding='utf-8')
print(str2) #你好中国
```
### 字符串中用 % 占位
```py
int1 = 1
float1 = 1.0
str1 = 'int1=%d, float1=%f' % (int1, float1)
print(str1) #int1=1, float1=1.000000
```
格式符号列表
| 格式符号 | 说明 |
| - | - |
| %d | 十进制整数 |
| %f | 浮点数 |
| %s | 字符串 |
| %o | 八进制整数 |
| %x | 十六进制整数 |
| %e | 科学计数法 |

### 字符串format()方法
不指定顺序
```py
int1 = 1
float1 = 1.0
bool1 = True
str1 = 'int1={}, float1={}, bool1={}'.format(int1, float1, bool1)
print(str1) #int1=1, float1=1.0, bool1=True
```
指定顺序
