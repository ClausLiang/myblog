---
title: node基础知识
date: 2025-08-08 17:12:11
tags:
  - node
  - npm
categories: node
---
<script type="text/javascript" src="/myblog/custom.js"></script>

# node概念
node.js 是一个基于 Chrome V8 引擎的 JavaScript运行环境。它让Javascript成为与PHP、Ruby、Python、Perl等服务端语言平起平坐的脚本语言。
# NPM
NPM（Node Package Manager）是 Node.js 运行时环境默认集成的包管理工具，用于下载、安装、更新和发布 Node.js 包。
## 一些命令
1. npm init
创建package.json文件
2. npm install
安装依赖包
3. npm get registry
获取npm的默认仓库地址
4. npm config set registry https://registry.npm.taobao.org
设置npm的仓库地址为淘宝的
5. npm config list
列出npm的配置信息
6. npm cache ls
列出npm缓存目录下的所有文件
7. npm cache clean
清空npm缓存目录下的所有文件
8. npm adduser
添加npm账号
9. npm login
登录npm
10. npm publish
发布npm包

# node常用模块
Node使用Module模块去划分不同的功能，以简化应用的开发。Modules模块有点像C++语言中的类库。每一个Node的类库都包含了十分丰富的各类函数，比如http模块就包含了和http功能相关的很多函数，可以帮助开发者很容易地对比如http,tcp/udp等进行操作，还可以很容易的创建http和tcp/udp的服务器。

## node中的系统常量
__dirname 文件所在路径（两杠）
__filename 文件名

## 文件系统fs
```js
var fs = require('fs');
var buf = new Buffer(5);
fs.open("hello.txt","r+", function (err, data) {
  if (err) {
    return console.error(err);
  }
  console.log("打开文件");
  fs.read(data,buf,0,buf.length,0,function(err,bytes){
    if(err){
      console.log(err);
    }
    console.log(bytes+"字节被读取");

    if(bytes > 0){
      console.log(buf.slice(0, bytes).toString());
    }
  })
});
fs.readFile('hello.txt', function (err, data) {
  if (err) {
    return console.error(err);
  }
  console.log("异步读取: " + data.toString());
});
```

### 文件读写5阶段
1. 读文件并写文件
```js
var fs = require("fs");
fs.readFile("./hello.txt",function(err,data){
  if(err){
    return console.error(err);
  }
  fs.writeFile("./hello_copy.txt",data, function (err) {
    if(err){
      console.error(err);
    }
  })
})
```
2. 同步读文件并写文件
```js
var fs = require("fs"); 
var data = fs.readFileSync("hello.txt"); 
fs.writeFile("hello_copy.txt",data, function (err) { 
  if(err){ 
    console.error(err); 
  } 
}) 
```
3. 创建读写流拷贝文件
```js
var path = require("path"); 
var sourceFile = path.join(__dirname,"hello.txt"); 
var targetFile = path.join(__dirname,"target","hello_copy.txt"); 

var fs = require("fs"); 
var readStream = fs.createReadStream(sourceFile); 
var writeStream = fs.createWriteStream(targetFile); 

readStream.pipe(writeStream); 
```
4. 创建读写流一边读一边写
```js
var path = require("path"); 
var sourceFile = path.join(__dirname,"hello.txt"); 
var targetFile = path.join(__dirname,"target","hello_copy.txt"); 

var fs = require("fs"); 
var readStream = fs.createReadStream(sourceFile); 
var writeStream = fs.createWriteStream(targetFile); 

readStream.on("data", function (dats) { 
  writeStream.write(dats); 
}); 
readStream.on("end",function(){ 
  writeStream.end(); 
}) 
```
5. 创建读写流再优化
```js
var path = require("path"); 
var sourceFile = path.join(__dirname,"hello.txt"); 
var targetFile = path.join(__dirname,"target","hello_copy.txt"); 

var fs = require("fs"); 
var readStream = fs.createReadStream(sourceFile); 
var writeStream = fs.createWriteStream(targetFile); 

readStream.on("data", function (chunk) { 
  //当数据写入没有完成，先暂停 
  if(writeStream.write(chunk)===false){ 
    readStream.pause(); 
  } 
}); 
//当数据写入完成 
writeStream.on("drain", function () { 
  readStream.resume(); 
}) 
readStream.on("end",function(){ 
  writeStream.end();
}) 
```

## path模块
var path = require("path");
var url = path.normalize("///a\\b/c");//格式化一个路径

path.resolve(from,to);//从from到to的绝对路径，无参数时，获取当前目录
path.relative(from,to);//相对路径
path.sep 操作系统下文件分隔符 widow：\ unix: /
path.delimiter 操作系统中目录分隔符 window:";",unix:':'

### 遍历目录的几种方式
//同步方式获取文件路径的状态 
var status = fs.statSync(url); 
//判断文件路径是目录还是文件 
if(status.isDirectory()){} 
```js
//异同
var readDir = function (_dir) { 
  //异步方式读取指定目录中的文件 
  fs.readdir(_dir,function(err,files){ 
    if(err){
      consle.error(err);
    }
    //遍历子目录(文件) 
    for(var i=0;i<files.length;i++){ 
      //把文件目录及文件名拼接起来 
      var url = path.normalize(_dir+"/"+files[i]); 
      //同步方式获取文件路径的状态 
      var status = fs.statSync(url); 
      //判断文件路径是目录还是文件 
      if(status.isDirectory()){ 
        readDir(url); 
      }else{ 
        console.log(url); 
      } 
    } 
  }) 
} 
readDir("../"); 
```
```js
//同异 
var tongyi = function(dir){
  //同步方式读取指定目录的所有文件
  var files = fs.readdirSync(dir);
  files.forEach(function(v,i,a){
    var filename = path.normalize(dir+"/"+v); 
    //异步方式获取文件路径的状态 
    fs.stat(filename,function(err,stats){ 
      if(err){ 
        console.error(err); 
      } 
      //如果状态显示是文件夹递归执行 
      if(stats.isDirectory()){ 
        tongyi(filename); 
      }else{ 
        console.log(filename); 
      } 
    }) 
  }) 
} 
tongyi("../") 
```
```js
//异异
var yiyi = function (dir) {
  //异步方式读取指定目录的所有文件 
  fs.readdir(dir,function(err,files){
    if(err){ 
      console.error(err); 
    } 
    files.forEach(function(v,i,a){ 
      var filename = path.normalize(dir+"/"+v); 
      //异步判断目录是文件夹还是文件 
      fs.stat(filename,function(err,ss){ 
        if(err){ 
          console.error(err); 
        } 
        if(ss.isDirectory()){ 
          yiyi(filename); 
        }else{ 
          console.log(filename); 
        } 
      }) 
    }) 
  }) 
} 
yiyi("../");
```
```js
//同同 
var tongtong = function(dir){ 
  //同步获取指定目录的文件 
  var files = fs.readdirSync(dir); 
  files.forEach(function(v,i,a){ 
    var filename = path.normalize(dir+"/"+v); 
    //同步获取文件的状态 
    var stats = fs.statSync(filename); 
    if(stats.isDirectory()){ 
      tongtong(filename); 
    }else{ 
      console.log(filename); 
    } 
  }) 
}
tongtong("../"); 
```

## http
```js
var http = require("http"); 
var url = require("url"); 
var http_server = http.createServer(function(request,response){ 
  response.writeHead(200,{'Content-Type':'text/html','Access-Control-Allow-Origin':'localhost'});
  response.write("hello world!");
  response.end();
});
http_server.listen(9000, function () { 
  console.log("端口是9000");
})
```
## url
url.parse(urlstr) 将url字符串转为对象
url.format(urlobj) 将对象格式化为url字符串

urlObj.query 参数
urlOjb.path /index.html?name=2s
## queryString
querystring.parse(str) 将字符串转为对象
querystring.stringify(obj) 将对象转为字符串
## zlib
```js
var zlib = require('zlib');
var gzip = zlib.createGzip();
var sourfile = fs.createReadStream('./readme.txt');
var targfile = fs.createWriteStream('./readme.txt.gz');
sourfile.pipe(gzip).pipe(targfile);
```
为了减少网路传输数据量，http传输过程中会采用通用的压缩算法压缩数据，gzip属于最常用的压缩算法。
## process进程 全局对象
process.version
process.title
process.argv 参数
process.stdout.write('123'); 标准输出
process.stdin 标准输入
```js
//标准输入
process.stdin.on('data', function (chunk) { 
  process.stdin.resume();//启动
  console.log(chunk);
  process.stdin.pause();//暂停
  process.stdin.emit("end");
});
process.stdin.on("end",function(){
  console.log("end")
});
```
process.stderr
process.swd() 返回进程当前的工作目录
process.env 一个包含用户环境的变量
process.config
process.platform win32平台
process.arch 返回当前处理器架构
process.momeryUseage();
process.nextTick(callback); 在事件循环的下一次循环调用callback

## child_process 模块 util模块
```js
var cmds=util.format('copy',source,target);
child_process.exec(cmds.function(){})

var runnode = child_process.spawn('node',['test.js']);
runnode.stdout.on('data',function(chunk){
  console.log(chunk.toString());
})
```

## cluster 模块
cluster.isMaster 判断是否主进程
cluster.isWorker 判断是否子进程

```js
if(cluster.isMaster){
  var worker = cluster.fork();
  worker.send('hello');
}else{
  process.on('message',function(data){
    console.log(data)
  });
  process.exit(); //退出进程，正常退出时是0，异常1
}
process.on('exit',function(){});


var worker = child_process.spawn('node',['']);
worker.stdout.on('data',function(){})
```

## domain
domain类封装了将错误和没有被捕获的异常导向有效对象的功能。domain是eventEmitter类的一个子类，监听它的error事件来处理它捕获到的错误。
```js
var domain = require("domain").create(); 
var random_aSync = function(){ 
  setTimeout(function(){
    var num = Math.random() * 100; 
    if(num > 50){ 
      console.log(num);
      throw new Error("Random number is bigger than 50"); 
    }
    console.log(num);
  },0)
}
console.log("before ...");
setInterval(function(){
  domain.run(random_aSync);
},1000)
console.log("after ...");

domain.on("error",function(err){
  console.error("caught error:"+err);
})

```

## express路由 ejs模块
```js
var express = require("express"); 
var app = express(); 
var ejs = require("ejs"); 
var path = require("path"); 

app.set("views",path.join(__dirname,"views"));//设置视图路径
app.set("view engine","html");//设置视图引擎格式
app.engine("html",ejs.__express);//渲染引擎改为HTML
app.use(express.static(path.join(__dirname,"public")));

app.get("/",function(req,res){
  res.send("hello world");
});

app.get("/home", function (req,res) { 
  res.send("home page");
});
app.get("/register",function(req,res){
  res.render("registerpage");//渲染页面
})
//post，提供一个接口
app.post("/register",function(req,res){
  res.send("hello world,this is post register");
})
app.listen(8004,function(){
  console.log("port is 8004")
})
```

## mysql
```js
var mysql = require("mysql");//引入模块 

var option = { 
  host:"localhost",
  user:'root',
  password:'rootroot',
  database:'testdb'
}
var connection = mysql.createConnection(option);//创建连接 
connection.connect();//连接
connection.query("select * from denglu",function(err,data){
  if(err){
    return console.error(err); 
  }
  console.log(data);
})
connection.end();//关闭数据库
```

# node技巧
## 搭建一个静态服务器
安装模块：npm install http-server -g
运行：http-server -p 8080