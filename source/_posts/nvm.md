---
title: nvm或者n管理node版本
date: 2022-02-13 13:56:03
tags: npm
categories: 基础
---
<script type="text/javascript" src="/myblog/custom.js"></script>

# 使用nvm管理node版本

## 安装
要学会看文档，这个时候就体现到英文的重要性了。打开github把文档仔细读一读。
```bash
sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```
或者
```zsh
sudo wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

执行完第一步的安装命令，此刻执行nvm并不生效啊，提示找不到命令。nvm command not found

官网上说安装完nvm就会添加以上代码到.zshrc中，但是并没有啊，仔细阅读文档下面有mac不生效的解决办法，balabala，但是英文没那么好，看的一知半解啊。

### 需要手动添加以下代码到.zshrc中
```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

通过百度Google了解到mac的新系统中已经默认用zsh了，不用bash了，好吧，根据提示先创建一个.zshrc。

```bash
touch ~/.zshrc
```
*小插曲：发现自己的终端打开还是默认用的bash，但是终端中有个提示让升级到zsh。好吧，执行一下命令升级，完了再次打开终端就是这个样子的了。*

![image.png](/images/nvm-2022-2-13.png)

拷贝上面export...的代码到.zshrc中，然后执行一下 `source ~/.zshrc` （这个source命令是让代码生效。）

此后打开终端就可以直接使用nvm了。
## 使用nvm
```bash
nvm -v #查看nvm的版本
nvm current #查看当前的node版本 与 node -v 效果一样
nvm ls #查看所有的node版本
nvm install 14 #安装node v14.18.0 先install后use
nvm use 14 #使用node v14.18.0
nvm run 0.10.24 myApp.js # 指定node版本执行js
rm -rf ~/.nvm # 卸载nvm
```

我发现安装了nvm以后node的版本都安装在了.nvm文件夹下面的version文件夹中，但是之前安装的node是在.node-gyp文件夹中，这些就没用了吗，暂时搞不懂，留作以后研究吧。

# 使用n也可以管理node版本
## 安装
```bash
npm install n -g
```
n就是node的一个模块，它依赖node的，得先装一个node，然后才能安装n
## 使用
```bash
sude n stable # 安装最新的稳定版node
sudo n lastest # 安装最版
sudo n 12.13.0 # 安装某个版本
sudo n rm 12.13.0 # 删除某个版本
sudo n use 12.13.0  some.js # 用指定版本执行脚本
n ls # 查看安装了哪些版本
n # 切换版本
```

# nvm和n的区别
`安装简易度`
nvm 安装起来显然是要麻烦不少；n 这种安装方式更符合 node 的惯性思维。见仁见智吧。
`系统支持`
nvm 不支持 Windows。
`对全局模块的管理`
n 对全局模块毫无作为，因此有可能在切换了 node 版本后发生全局模块执行出错的问题。
nvm 的全局模块存在于各自版本的沙箱中，切换版本后需要重新安装，不同版本间也不存在任何冲突。
`关于 node 路径`
n 是万年不变的 /usr/local/bin； n在切换不同版本的node时，会将指定版本的node，复制进/usr/local/bin下。
nvm安装实际是将不同的node版本存储进~/.nvm/node-version内，然后修改PATH，将指定版本的node路径加入，这样就实现了切换node版本.