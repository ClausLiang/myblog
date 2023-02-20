---
title: typescript的学习记录
date: 2023-02-16 00:04:59
tags: typescript
categories: 基础
---
# ts的准备工作

> `什么是ts`
TypeScript是JavaScript的超集，因为它扩展了JavaScript，有JavaScript没有的东西。
硬要以父子类关系来说的话，TypeScript是JavaScript子类，继承的基础上去扩展。
`为什么要用ts`
> 简单来说就是因为JavaScript是弱类型, 很多错误只有在运行时才会被发现
而TypeScript提供了一套静态检测机制, 可以帮助我们在编译时就发现错误
`ts的特点`
> 支持最新的JavaScript新特特性
支持代码静态检查
支持诸如C,C++,Java,Go等后端语言中的特性 (枚举、泛型、类型转换、命名空间、声明文件、类、接口等)
## 1.安装
```bash
npm i -g typescript
```
## 2.编译生产js
```bash
tsc index.ts
```
## 3.不编译直接运行
安装一个工具 npm i -g ts-node
```bash
ts-node index.ts
```

# ts的语法
## 1.声明变量并给它指定类型
```ts
let a: number = 3
```

`类型的别名`
用type定义一个类型的别名
```ts
type mytype = 1 | 2 | 3
let x: mytype = 1
```

## 2.函数的类型声明
声明参数的类型及返回值的类型
```ts
// 函数的类型声明
let d: (a: number, b: number) => number
d = function(n1: number, n2: number): number{
    return n1 + n2
}

function sum(a:number, b:number):number{
    return a+b
}
let result = sum(a:1,b:3)
```

## 3.ts的类型
> string number boolean undefined null `bigint` symbol object (8种内置类型)
`literal`(字面量类型)
array `tuple`(元组 固定长度 固定类型的数组) `enum`(枚举)
`any` `unknown` `void` `never`

`字面量`
限制变量的值就是该字面量的值
```ts
let a: '男' ｜ '女'
a = '男'
```

`any`
表示任意类型，一个变量设置类型为any后相当于对该变量关闭了ts的类型检测，不建议使用any
声明变量如果不指定类型，则ts解析器会自动判断变量的类型为any

`unknown`
表示未知的类型

any和unknown的区别：
any类型的变量可以赋值给其他类型的变量，相当于嚯嚯了别的变量。unknown类型的变量不能直接赋值给其他类型的变量，会报错。

`void`
用来表示空，以函数为例，表示没有返回值的函数
```ts
function fn():void{
}
```

`never`
表示永远不会返回结果
```ts
function fn2():never{
    throw new Error(‘error’)
}
```

`object`
{}用来指定对象可以包含哪些属性
```ts
let b:{name: string, age?:number} // ?表示属性是可选的
b = {name: '孙悟空', age: 18}

// [propName: string]:any 表示任意类型的属性，属性名是字符串
let c:{name: string, [propName: string]:any} // name必须有，其他不管
```


`数组`
两种方式
```ts
let e: string[]
e = ['a','b','c']

let g:Array<string>
```

`元组`
```ts
let h: [string, number]
h = ['hello', 12]
```

`enum`
```ts
// 定义一个枚举Gender
enum Gender{
    Male = 1,
    Female = 0
}
let i: {name: string, gender: Gender}
i = {
    name: '孙悟空',
    gender: Gender.Male
}
console.log(i.gender === Gender.Male) // true
```

### `类型断言`
可以告诉解析器变量的实际类型。以下为两种写法：
```ts
<string>abc
abc as string
```

# ts的编译选项
## -w
tsc index.ts -w 自动监听当index.ts变化时自动编译
## tsconfig.json
ts编译器的配置文件，ts编译器可以根据它的信息来对代码进行编译
有了这个文件，只需执行tsc -w可以同时自动编译根目录下的所有ts文件
```json
{
    "include": ["./src/**/*"], //指定哪些ts需要被编译 **表示任意目录 *表示任意文件
    "exclude": []
}
```