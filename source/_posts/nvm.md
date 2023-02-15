---
title: mac电脑用nvm管理node版本
date: 2022-02-13 13:56:03
tags: npm
categories: 基础
---


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f55cb0f90d643ccb781f49967db7b90~tplv-k3u1fbpfcp-watermark.image?)
要学会看文档，这个时候就体现到英文的重要性了。打开github把文档仔细读一读。
### 第一步执行命令安装nvm
```bash
sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```
或者
```zsh
sudo wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```
前面加上sudo不然可能没权限
### 第二步需要手动添加以下代码到.zshrc中
```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```
刚安装完此刻执行nvm并不生效啊，提示找不到命令。nvm command not found

官网上说安装完nvm就会添加以上代码到.zshrc中，但是并没有啊，仔细阅读文档下面有mac不生效的解决办法，balabala，但是英文没那么好看的一知半解啊。

通过百度Google了解到mac的新系统中已经默认用zsh了，不用bash了，好吧，根据提示先创建一个.zshrc。

```bash
touch ~/.zshrc
```
*小插曲：发现自己的终端打开还是默认用的bash，但是终端中有个提示让升级到zsh。好吧，执行一下命令升级，完了再次打开终端就是这个样子的了。*

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0138a6097ba44d58913ed56de26e771f~tplv-k3u1fbpfcp-watermark.image?)

拷贝上面export...的代码到.zshrc中，然后执行一下 `source ~/.zshrc` （这个source命令是让代码生效。）

此后打开终端就可以直接使用nvm了，之前是只能使用一次，重新打开终端又变成了找不到命令。
### 第三步，此刻就可以使用nvm了。
```bash
nvm -v #查看nvm的版本
nvm current #查看当前的node版本 与 node -v 效果一样
nvm ls #查看所有的node版本
nvm use 14 #使用node v14.18.0
nvm install 14 #安装node v14.18.0
```
以上命令也够一般情况下的使用了。

我发现安装了nvm以后node的版本都安装在了.nvm文件夹下面的version文件夹中，但是之前安装的node是在.node-gyp文件夹中，这些就没用了吗，暂时搞不懂，留作以后研究吧。

