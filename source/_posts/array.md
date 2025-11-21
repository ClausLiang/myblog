---
title: js基础之数组
date: 2019-05-16 23:24:35
updated: 2022-11-06
tags: 基础
categories: 基础
---

## 数组简介
数组的每一项可以保存任何数据类型
new Array() 一个参数代表长度，两个及以上参数代表数组元素
## 数组常用的20+个方法：
又复习到这，这二十多个方法你都牢牢掌握吗？
数组的方法是最最基础的基础，但是有些方法不是很常用，很多人都会出错，这就奇怪了。

### 1.push(item) 可添加多个逗号隔开
### 2.pop() 无参,删除最后一个，返回删除掉的元素
### 3.unshift(item) 前面加一个，返回变化后的数组的长度。可添加多个，逗号分隔
### 4.shift() 无参，删除第一个，返回删除的元素
### 5.splice(index,) 拼接
①arr.splice(开始下标，长度); 删除，返回删除的。
②arr.splice(开始下标);  从下标开始删除，返回删除的。
③arr.splice(开始下标，0，'aa'); 添加，在开始下标位置
④arr.splice(开始下标，1，'aa'); 替换
### 6.reverse() 无参，倒叙
### 7.sort(fn) 排序
需要传递一个函数作为参数
```js
arr.sort(function(a,b){
    return a-b;
})
```


`以上方法改变数组`<br>
`以下方法不改变数组，返回新数组`

### 8.concat(item) 合并，能加数组也能加元素
### 9.slice(开始下标，结束下标)切片。查找包括开始下标不包括结束下标
> 1.只有开始下标，表示从开始一直到结束<br>2.负值表示倒数。

```js
var arr=[1,2,3,4,5];
arr.slice(-3); // 结果[3,4,5];
```

### 10.indexOf(item); 查找元素所在的下标，找不到，返回-1
### 11.toString(); 数组转字符串，逗号分隔
### 12.join([',']); 参数可填可不填，用指定分隔符转字符串，无参默认逗号
### 13.valueOf(); 返回数组本身

`以下是ES6中新增的数组方法，都涉及到数组的遍历`
### 14.forEach(fn)

```js
var arr=[1,2,3,4];
var sum=0;
var res=arr.forEach(function(v,i,a){
    sum+=v;
})
```

### 15.map(fn) 对数组中的每一项进行操作，并把操作的结果放到新的数组中，返回新数组

```js
var arr1=arr.map(function(x){
    return x*3;
})
console.log(arr1);    //[1,6,9,12]
```

### 16.filter(fn) 用来筛选数组中所有符合条件的元素，并把处理结果放到一个新数组中，（如果没有返回值，新数组中的每一项都是undefined）

```js
var arr2 = ['电视','音响','耳机','收音机'];
var arr3 = arr2.filter(function(x){
    return new RegExp('机').test(x);
})
console.log(arr3);    //['耳机','收音机']
```

### 17.find(fn) 用来返回数组中符合条件的第一个元素。
```js
var arr2 = ['电视','音响','耳机','收音机'];
var item = arr2.find(function(x){
    return x.length > 2
})
console.log(item); // 收音机
```
### 18.findIndex(fn) 用来返回数组中符合条件的第一个元素的下标。
```js
var arr2 = ['电视','音响','耳机','收音机'];
var index = arr2.findIndex(function(x){
    return x.length > 2
})
console.log(index); // 3
```
### 19.every(fn) 返回true/false，每一项都要符合条件
```js
var arr2 = ['电视','音响','耳机','收音机'];
var flag = arr2.every(function(x){
    return x.length < 3;
})
console.log(flag);    //false
```
### 20.some(fn) 返回true/false，只要有一项符合条件就行
```js
var flag2 = arr2.some(function(x){
    return x.length<3;
})
console.log(flag2);     //true
```

### 21.reduce(fn) 从左往右
```js
var arr=[1,2,3,4];
// 从左到右，取大的，再和下一个比较，取大的。
var res=arr.reduce(function(x,y){
    if(x>y){
        return x;
    }else{
        return y;
    }
}) // res=4;
```
### 22.reduceRight(fn) 从右往左
```js
var arr4 = [2,2,4];
// 从左往右
var res2 = arr4.reduce(function(x,y){
    console.log(x,y);
    return Math.pow(x,y);
})
// 2，2
// 4，4
// 最后结果256

// 从右往左
var res2 = arr4.reduceRight(function(x,y){
    console.log(x,y);
    return Math.pow(x,y);
})
// 4，2
// 16，2
// 最后结果256
```
这个例子，reduce和reduceRight结果竟然一样，但是中间的过程是不一样的。
### 23.keys() 
### 24.values() 
### 25.entries() 
以上三个都返回一个遍历器对象，可以用for...of循环进行遍历，唯一的区别是keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。
```js
for (let index of ['a', 'b'].keys()) {
    console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
    console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
    console.log(index, elem);
}

// 0 "a"
// 1 "b"
```
