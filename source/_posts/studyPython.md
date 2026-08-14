---
title: 学习python(一、基础语法)
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


# 内置函数
- type()获取数据类型
```py
type(1) # print(type(1)) 打印 <class 'int'>
```

- isinstance()判断数据是不是某个类型
```py
isinstance(1, int) # 返回True/False
```

- id()获取对象在内存中的地址
```py
id(1) # print(id(1))打印 140718693467256 (-5~256都是同一个地址，小整数池)
```

- eval()执行表达式，并返回表达式的值
```py
eval(x)
```

- input() 获取用户输入的内容，并存储到字符串类型的变量中
```py
name = input('请输入你的名字：')
print('你好，' + name)
```

- print() 输出
```py
print('a')
print('a', 'b', 'c', sep='-', end='!') # end 指定行的结尾， sep 指定用什么拼接
```


# 运算符
## 算术运算符6个
`+` `-` `*` `/` `//`(整除，向下取整) `%`(模运算，取余数) `**`(幂运算，`10**3==1000`)
javascript没有`//`

## 赋值运算符
### 普通的几个
`=` `+=` `-=` `*=` `/=` `//=` `**=`
### 海象运算符
`:=`(在表达式中同时进行赋值和返回赋值的值)
```py
print((str1 := 10) > 5)
print(str1) #10
```
## 比较运算符
`>` `<` `==` `!=` `>=` `<=`

## 逻辑运算符
`and` `or` `not` (与或非) 与JavaScript的`&& || !`结果是一样的
x and y, 若x为false，返回x，否则返回y
x or y, 若x为true，返回x，否则返回y
not x, 若x为true，返回false，否则返回true

## 位运算符
> 位运算，说白了就是直接对整数在内存中的二进制位（0和1）进行操作

按位与`&`：两个都是1才是1，否则是0
按位或`|`：只要有一个是1就是1
按位异或`^`：两个不同为1，相同为0
按位取反`~`：0变1,1变0
按位左移`<<`：所有位向左移动右边补0，相当于乘以2
按位右移`>>`：所有位向右移动，左边补符号位，相当于除以2

### 为什么学它
在算法、底层框架、游戏开发中，位运算常常是降维打击：
1. 快速判断奇偶（不用 %2）：
```py
if ((n & 1) == 0) { print("偶数"); }
```
2. 交换两个数（不用临时变量）：
利用异或的自反性 a ^ b ^ b = a，可以骚操作交换：
```py
a = a ^ b
b = a ^ b  # 此时 b = (a^b)^b = a
a = a ^ b  # 此时 a = (a^b)^a = b
```
3. 权限系统的核心（如 Linux 的 chmod）：
用二进制位表示开关。例如：读(1)、写(2)、执行(4)。
- 授权读写：flag = 1 | 2 = 3（二进制 011）。
- 检查是否有写权限：if (flag & 2) != 0。
4. 乘除 2 的幂次（极快）：
a << 2 等于 a * 4；a >> 3 等于 a / 8。在底层数组扩容（如 HashMap）中大量使用。
5. 判断两个数是否同号：
直接 (a ^ b) < 0，因为符号位（最高位）相同异或为0，不同异或为1。

## 成员运算符
`in` `not in`
```py
list1 = [1,2,3]
print(1 in list1) #True
```

## 身份运算符
`is` `is not` 判断两个标识符是不是引用同一个地址
```py
m = 20
n = 20
print(m is n) #True
```

# 流程控制语句
## 顺序
## 分支
### 单分支
python里没有{}，if后面不需要写小括号，条件语句后面写冒号，4个空格缩进
```py
from random import randint
balance = randint(10, 100)
print(balance)
if balance < 20:
    print('余额不足')
```
### 双分支
```py
if balance < 20:
    print('余额不足')
else:
    print('余额充足')
```
### 多分支
```py
if balance < 50:
    print('情况1')
elif balance < 60:
    print('情况2')
elif balance < 70:
    print('情况3')
else:
    print('充足')
```
### match case
类比js switch case
```py
age = 25
match(age // 10):
  case 0:
    print("还是个儿童")
  case 1:
    print("十岁多了，是个少年了")
  case 2:
    print("20+了，是个青年了")
```
对比js
```js
let age = 25
switch(Math.floor(age / 10)) {
  case 0:
    console.log("还是个儿童")
    break
  case 1:
    console.log("十岁多了，是个少年了")
    break
  case 2:
    console.log("20+了，是个青年了")
    break
}
```
### 三目运算符
`num1 if num1 > num2 else num2`
```py
num1 = 10
num2 = 20
max_num = num1 if num1 > num2 else num2
print(max_num)
```
对比js
```js
let num1 = 10, num2 = 20
let max = num1 > num2 ? num1 : num2
console.log(max)
```
## 循环
### `while`
```py
counter = 0
while counter < 5:
    i = 0
    while i <= counter:
        if i < counter:
            print('*', end='')
        else:
            print('*')
        i += 1
    counter += 1

# 另一种写法
counter = 0
while counter < 5:
    i = 0
    print('*' * (counter + 1))
    counter += 1

# 打印结果
# *
# **
# ***
# ****
# *****
```
while 后面可以跟else，只有循环结束才会进else，break中断的循环不会执行else
### `for in`
语法和js有一定差别
```py
for a in [1, 2, 3]:
    print(a)
for i in 'abc':
    print(i)
```
# 数据类型6种
数值（int float complex(复数) bool）
字符串str
列表list（可变序列）
元组tuple（不可变序列）
集合set（元素唯一无序）
字典dict（键值对）
特殊数据类型None

不可变：数值 字符串 元组
可变：list set dict

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

## 列表list（有序）
通过[]定义，可变的
### 切片
```py
list1 = [1, 2, 3, 4, 5]
print(list1) 
print(list1[2:4]) # [3, 4] 切片
print(list1[::-1]) # [5, 4, 3, 2, 1] 倒序
```
### append
```py
list1.append(6)
print(list1) # [1, 2, 3, 4, 5, 6]
```
### insert
```py
list1.insert(0, 0)
print(list1) # [0, 1, 2, 3, 4, 5, 6]
```
### 列表相加 相乘
```py
list1 = [1, 2, 3, 4, 5]
list2 = ['a', 'b', 'c']
print(list1 + list2) # [1, 2, 3, 4, 5, 'a', 'b', 'c']
print(list2 * 2) # ['a', 'b', 'c', 'a', 'b', 'c']
```
### 修改
```py
list1[0] = 'a'
print(list1) # ['a', 2, 3, 4, 5]
list1[1:3] = ['b', 'c']
print(list1) # ['a', 'b', 'c', 4, 5]
```
### 判断对象是否在列表中
```py
print(1 in list2) # False
```
### 判断list的长度
```py
print(len(list2)) # 3
```
### 列表的最小值 最大值 求和
```py
print(min(list1)) # 1
print(max(list1)) # 5
print(sum(list1)) # 15
```
### 遍历
```py
for item in list2:
    print(item)

for i,item in enumerate(list1):
    print(i, item)
```
### 删除
```py
list2.remove('b') # 删除第一次出现的b
del list2[0]
```
```py
list1 = [100, 200, 200, 300, 400, 500,200]
for item in list1[:]: # 注意这里是遍历了一个新的列表，如果是遍历原列表，一边遍历一边删，可能会出问题
    if item == 200:
        list1.remove(item)
print(list1)
```
### 列表推导式
```py
list1 = [100, 200, 300, 400, 500]
list2 = [i * 2 for i in list1] # 列表推导式
print(list2) # [200, 400, 600, 800, 1000]
```
### zip()
```py
list1 = [1,2,3,4,5]
list2 = ['a','b','c','d','e']
zip1 = zip(list1, list2) # <zip object at 0x0000020376E6D380>
print(list(zip1)) # [(1, 'a'), (2, 'b'), (3, 'c'), (4, 'd'), (5, 'e')]
```
### 其他常用方法
略

## 字符串（有序）
不可变，可以通过单引号 双引号 三个引号定义字符串
### 很多方法同list
略
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
```py
int1 = 1
float1 = 1.0
bool1 = True
str1 = 'int1={2}, float1={1}, bool1={0}'.format(int1, float1, bool1)
print(str1) #int1=True, float1=1.0, bool1=1
```
设置参数
```py
int1 = 1
float1 = 1.0
bool1 = True
str1 = 'int1={a}, float1={b}, bool1={c}'.format(a = int1, b = float1, c = bool1)
print(str1)  # int1=1, float1=1.0, bool1=True
```
数字格式化
```py
# 以*填充，宽度为20，
# < 居左 > 居右 ^ 居中
# 逗号表示每3位一分割
# .3f保留3位小数
float1 = 334443.1489
str1 = '{:*^20.3f}'.format(float1)
print(str1) #*****334443.149*****

str2 = '{:*>20,.4f}'.format(float1)
print(str2) #********334,443.1489
```

### f字符串
```py
int1 = 1
float1 = 1.0
str1 = f'int1={int1}, float1={float1}'
print(str1) #int1=1, float1=1.0
```
另一种简写方法
```py
int1 = 1
float1 = 1.0
str1 = f'{int1=}, {float1=}'
print(str1) #int1=1, float1=1.0
```
### strip()去前后空格 lstrip rstrip
```py
str1 = '  abc def '
print(str1.strip())
print(str1.lstrip())
print(str1.rstrip())

# 还可以传参
str2 = '111abc111'
print(str2.lstrip('1'))
```
js中是str1.trim()
### 大小写转化
```py
str1 = 'hellO World'
print(str1.upper())
print(str1.lower())
print(str1.title()) # 每个单词首字母大写，其他小写
print(str1.capitalize()) # 第一个字母大写，其他小写
print(str1.swapcase()) # 大小写互换
```

## 元组tuple（有序）
通过()定义元组对象，不可变，元素可以重复
```py
tuple1 = (1, 2, 3, 4, 5)
print(tuple1) # (1, 2, 3, 4, 5)
```
### tuple不支持修改
```py
tuple1 = (1, 2, 3, 4, 5)
tuple1[0] = 9 # 报错 TypeError: 'tuple' object does not support item assignment
```
## 集合set（无序）
集合是无序的，且不包含重复元素。使用{}定义，也可以使用set()定义。
集合没有索引，所以不能通过切片方式访问集合元素
### 创建集合对象
```py
# 创建集合
set1 = {1, 2, 3, 4, 5}

# 将列表转化为集合，一般可用于去重场景
set2 = set([1, 2, 2, 4, 4])
print(set2) # {1, 2, 4}

# 通过推导式创建集合对象
set3 = {i for i in range(10) if i % 2 == 0}
print(set3) # {0, 2, 4, 6, 8}
```

### 添加元素
```py
set1.add(6)
```

### 删除元素
```py
set1.remove(3) # 不存在会报错
set1.discard(5) # 不存在不报错
set1.pop() # 随机删一个
set1.clear() # 清空
```
### 判断是不是成员
```py
print(1 in set1) # True
```
### 长度 最大值 最小值 求和
```py
print(len(set1), max(set1), min(set1), sum(set1))
```
### 遍历
```py
set1 = {1, 2, 3, 4, 5}
for item in set1:
    print(item)
```
### update 并集，改变原集合
```py
set1 = {1, 2, 3}
set1.update({4,})
print(set1) # {1, 2, 3, 4}
```
### union 并集，不改变原集合，返回新集合；intersection 交集，返回新集合
```py
set1 = {1, 2, 3}
set2 = {3, 4, 5}
set1.union(set2) # {1, 2, 3, 4, 5}
set1.intersection(set2) # {3}
```
### difference 差集（我有你没有）
```py
set1 = {1, 2, 3}
set2 = {3, 4, 5}
print(set1.difference(set2)) # {1,2} 不改set1
set1.difference_update(set2) # 求差集，并更新
print(set1) # {1, 2}
```
### 运算符求交集 并集 差集
```py
set1 = {1, 2, 3}
set2 = {3, 4, 5}
print(set1 & set2) # {3}
print(set1 | set2) # {1, 2, 3, 4, 5}
print(set1 ^ set2) # {1, 2, 4, 5}
print(set1 - set2) # {1, 2}
```

### 其他方法
```py
print(set1.isdisjoint(set2)) # False 是否无交集
print(set1.issubset(set2)) # False 是否是子集
print(set1.issuperset(set2)) # False 是否是父集
set1.symmetric_difference_update(set2) # 求两集合不重复的元素
print(set1) # {1, 2, 4, 5}
```

## 字典dict（无序）
通过{}定义