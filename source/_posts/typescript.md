---
title: typescript的学习记录
date: 2023-02-16 00:04:59
tags: typescript
categories: 进阶
---
<script type="text/javascript" src="/myblog/custom.js"></script>

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
## 安装
```bash
npm i -g typescript
```
## 编译生产js
```bash
tsc index.ts
```
## 不编译直接运行
安装一个工具 npm i -g ts-node
```bash
ts-node index.ts
```

# ts的语法
## 声明变量并给它指定类型
```ts
let a: number = 3
```

`类型的别名`
用type定义一个类型的别名
```ts
type mytype = 1 | 2 | 3
let x: mytype = 1
```

## 函数的类型声明
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

## ts的类型
> string number boolean undefined null `bigint` symbol object (8种内置类型)
9 array(数组) `10 tuple`(元组 固定长度 固定类型的数组) `11 enum`(枚举)
`12 any` `13 unknown` `14 void` `15 never`
`16 literal`(字面量类型) `17 union types联合类型`

`8 object`
{}用来指定对象可以包含哪些属性
```ts
let b:{name: string, age?:number} // ?表示属性是可选的
b = {name: '孙悟空', age: 18}

// [propName: string]:any 表示任意类型的属性，属性名是字符串
let c:{name: string, [propName: string]:any} // name必须有，其他不管
```

`9 array数组`
两种方式
```ts
let e: string[]
e = ['a','b','c']

let g:Array<string>
```

`10 tuple元组`
```ts
let h: [string, number]
h = ['hello', 12]
```

`11 enum枚举`
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


`12 any`
表示任意类型，一个变量设置类型为any后相当于对该变量关闭了ts的类型检测，不建议使用any
声明变量如果不指定类型，则ts解析器会自动判断变量的类型为any

`13 unknown`
表示未知的类型

any和unknown的区别：
any类型的变量可以赋值给其他类型的变量，相当于嚯嚯了别的变量。unknown类型的变量不能直接赋值给其他类型的变量，会报错。

`14 void`
用来表示空，以函数为例，表示没有返回值的函数
```ts
function fn():void{
}
```

`15 never`
表示永远不会返回结果
```ts
function fn2():never{
    throw new Error(‘error’)
}
```
`16 literal字面量`
限制变量的值就是该字面量的值
```ts
let a: '男' ｜ '女'
a = '男'
```
`17 union types联合类型`
```ts
let myFavoriteNum: string ｜ number
myFavoriteNum = 'seven'
myFavoriteNum = 7
```

### 类型断言
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
    "exclude": [], // 不需要被编译的文件目录
    "files": [],//不常用，指定要编译的文件列表
    /**
     * 编译器的选项
     */
    "compilerOptions": {
        "target": "ES3", // 指定ts被编译为的es的版本
        "module": "ES6", // 指定要使用的模块化的规范
        // "lib":['dom'],// 指定项目中要用的库。一般不需要设置
        "outDir": "./dist",// 指定编译后文件所在的目录
        // "outFile": "",// 将代码合并为一个文件，所有全局作用域中的代码会合并到一个文件中
        "allowJs": false, // 是否对js文件进行编译，默认false
        "checkJs": false,// 检查js代码是否符合语法规范，默认false
        "removeComments": false,//是否移除注释
        "noEmit":false,// 不生成编译后的文件
        "noEmitOnError": false,// 当有错误时不生成编译文件
        "strict": false,// 所有严格检查的总开关
        "alwaysStrict": false,// 设置编译后的文件是否使用严格模式。默认false
        "noImplicitAny": true, // 不允许隐式any类型
        "noImplicitThis": false, // 不允许不明确类型的this
        "strictNullChecks": false, // 严格检查空值
    }
}
```

# 面向对象
## 抽象类 abstract
```ts
// 关键字abstract定义抽象类，抽象不能实现，只能被继承
abstract class Animal{
    name: string
    constructor(name: string){
        this.name = name
    }
    // abstract定义抽象方法，子类对抽象方法进行重写
    abstract say():void
    eat(){
        console.log('eat')
    }
}
```
## 继承 extends super
```ts
class Dog extends Animal{
    age: number
    constructor(name:string, age: number){
        // 子类的构造函数会重写父类的构造函数，所以必须先调用父类的构造函数
        super(name)
        this.age = age
    }
    say(){
        console.log('汪汪汪')
    }
    eat(){
        // 调用父类的方法
        super.eat()
    }
}
```
## 接口 interface implement
用来定义一个类结构，用来定义一个类中应该包含哪些熟悉和方法，不能有实际值，方法都是抽象方法。
接口和抽象类的区别是抽象类中可以有非抽象的方法，而接口中都是抽象方法。
同时接口也可以当成类型声明去使用
```ts
interface myinterface{
    name: string,
    age: number,
    sayHellow():void
}
//当作类型声明的话 和 自定义类型type 类似
const obj: myinterface{
    name: 'aaa',
    age: 18,
    sayHellow(){
        console.log('sayHellow')
    }
}

// 定义类，可以使类去实现一个接口
class myClass implements myinterface{
    name: string
    age: number
    constructor(name: string, age:number){
        this.name = name
        this.age = age
    }
    sayHello(){
        console.log('hellow')
    }
}
```

## 属性的封装 private
public 属性默认是公共的
private 私有属性 用getter setter，只能在当前类访问
protected 受保护的，只能在当前类和子类中访问
```ts
class Person{
    private _name: string
    private _age: number

    constructor(name: string, age: number){
        this._name = name
        this._age = age
    }
    // 可以暴露，也可以不暴露
    get name(){
        return this._name
    }
    set name(value: string){
        this._name = value
    }
    // 暴露的设置属性的方法可以写自己的逻辑
    set age(value: number){
        if(value > 0) {
            this._age = value
        } else {
            // 抛出错误
        }
    }
}
```
## 定义类的简写
```ts
class Person{
    constructor(name: string, age: number){}
}
let p = new Person('aa',18)
```
## 泛型
在定义函数或者类时，如果遇到类型不明确就可以使用泛型
> 不预先指定具体的类型，而是在使用时再指定类型

```ts
function fn<T>(a: T):T{
    return a
}

fn(10) // 不指定泛型，ts可以自动对类型进行推断
fn<string>('hello') // 指定泛型

// 可以指定多个泛型
function fn2<T, K>(a: T, b:K):T{
    return a
}

// 缩小范围的泛型
interface Inter{
    length: nuumber
}
function fn3<T extends Inter>(a: T): number{
    return a.length
}
```