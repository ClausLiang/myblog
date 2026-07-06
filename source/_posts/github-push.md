---
title: github推送代码由于网络原因经常失败的解决办法:ssh方式推送
date: 2023-08-31 11:41:22
updated: 2026-06-09
tags: git
categories: git
---
<script type="text/javascript" src="/myblog/custom.js"></script>

> github是全球最大的代码托管平台，但是由于墙的原因，在国内访问经常会有问题，虽然国内也有平替比如gitee，但是说实话比github还是差点意思。

最近发现github推送代码总是失败，查看错误日志一般都是由于网络的原因。

于是各种切换网络，使用各种梯子，但总是不能完美解决问题。

今天实在是忍不了，好好搜了一下解决方法。原来可以用ssh的方式解决这个问题。（原先我下载代码一般习惯用http的方式，这下发现它的弊端了。）下面介绍一下用ssh链接克隆以及推送代码的方法：

# 用ssh链接clone代码仓库
## 创建ssh密钥
1. 新方式
github说明文档里给的创建ssh密钥方式：
```
ssh-keygen -t ed25519 -C "公司电脑"
```
-t 创建密钥的类型为ed25519
ed25519比下述的rsa方式是一种更新的方式。
-C 注释

2. 创建ssh密钥（旧方式 可忽略）
```
ssh-keygen -t rsa -C "公司电脑"
```
-t 指定要创建的密钥类型为rsa


敲了该命令会出现 `Enter file in which to save the key (/Users/用户名/.ssh/id_rsa):`让输入密钥文件名的提示，可以直接回车，默认生成名为 id_rsa 及 id_rsa.pub 的私钥及公钥。

再次出现`Enter passphrase (empty for no passphrase):`让输入密码的提示，可以直接回车表示不设密码。

## 打开github新建ssh key
打开github，点击右上角头像 -> settings -> SSH and GPG keys -> New SSH keys

title随便填，key的输入框中填写上一步生成的公钥文件(id_rsa.pub)中的内容。

## 重新克隆仓库，复制ssh的链接
此后拉取以及推送代码就不会出现网络问题而导致失败了。


# ssh登录远程服务器
## 命令
```
ssh xxx@ip
```
输完上述命令回车，会要求你输入密码
## 简化命令
每次输入`ssh 用户名@ip`比较繁琐，可以在.ssh目录下创建一个config文件，然后写入以下代码
```
Host myserver           # 这里写你的自定义别名
    HostName 192.168.1.100   # 远程服务器的IP地址或域名
    User claus       # 登录远程服务器的用户名
    Port 22                  # SSH端口，默认为22，如有修改则需更改 (也可不写这行)
```
现在只需输入`ssh myserver`等同`ssh claus@192.168.1.100 -p 22`

## ssh免密登录
使用SSH命令将本地生成的公钥（.ssh/id_rsa.pub）复制到远程服务器
```
ssh-copy-id claus@192.168.1.100
```
或者，如果没有ssh-copy-id命令，可以手动将公钥内容追加到远程服务器的~/.ssh/authorized_keys文件中。以下是手动复制的方法：
```
cat ~/.ssh/id_rsa.pub | ssh claus@192.168.1.100 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

这条命令会：
1. 读取本地公钥内容
2. 通过 SSH 登录到远程服务器（需要输入一次密码）
3. 在服务器上创建 ~/.ssh 目录（如果不存在），并设置正确权限（700）
4. 将公钥内容追加到 authorized_keys 文件中
5. 设置 authorized_keys 文件权限为 600

现在，您应该能够通过SSH免密登录到远程服务器，而无需输入密码。

## 进阶与安全小贴士
使用 ssh-agent 管理密钥：如果为私钥设置了密码（passphrase），每次连接仍需输入，这时 ssh-agent 可以帮你“代劳”。

管理多个密钥：在 ~/.ssh/config 文件中，可以通过 IdentityFile 指令为不同的服务器指定不同的私钥。

配置“跳板机”：如果公司网络需要先登录一台“跳板机”（Jump Server）才能访问其他服务器，也可以在 config 文件中配置，实现“一步直达”。

禁用密码登录：为确保安全，在确认密钥登录配置成功后，建议在远程服务器的 /etc/ssh/sshd_config 文件中将 PasswordAuthentication 设置为 no，然后重启 SSH 服务。这样，只有拥有私钥的人才能登录，安全性大大提高。

# scp上传文件或文件夹到远程服务器
```
# 上传文件
scp xxx.jpg claus@47.74.35.228:/data/claus/tmp/
# 上传文件夹 参数 -r
scp -r D:\project\idt-tars-web\dist root@8.145.35.144:/app/nginx/html/tars/
```

# linux常用命令
## 解压缩
```bash
yum install -y unzip zip
unzip xx.zip -d xx
```
## mv更名或移动
当第二个参数是文件名时更名，当第二个参数是目录时移动
```bash
mv file1.txt file2.txt   # 将 file1.txt 重命名为 file2.txt
mv file1.txt /home/user/Documents/   # 将文件移动到 Documents 目录下
```
## rm删除文件/文件夹
```bash
rm index.html #删除文件
rm -rf static #删除文件夹
```
-r 代表向下递归，不管有多少级目录
-f 代表不提示

## 创建目录
```bash
mkdir xxx
```

## 后台跑服务（命令后加 &）
```bash
xxx &
```

## 查看正在运行的进程状态（process status）
```bash
ps -ef
```

# yum
yum是 Linux 系统中一款基于 `RPM 包管理`的命令行软件包管理器。它主要用于 Red Hat 系的发行版，如 RHEL（红帽企业版）、CentOS 和 Fedora（较旧版本）
它的核心价值在于自动处理软件依赖关系。如果你手动用 rpm 命令安装一个软件，经常遇到“缺 A 依赖，装了 A 又缺 B”的依赖地狱；而 yum 会像贴心的管家一样，自动从软件源（Repository）里把所需的所有依赖包一起下载并安装好。
```bash
yum install <包名>	# 安装指定软件
yum remove <包名> # 卸载指定软件（保留配置文件）
yum erase <包名> # 彻底卸载（连带配置文件一起删）
yum update <包名> # 更新指定软件

yum list installed # 可以查看yum已经安装过的软件(能查到你系统上所有通过 RPM 机制安装的软件，但不是“所有能运行的程序”)
```
## 现代替代品 dnf
如果你使用的是 RHEL 8/9、CentOS 8+ 或 Fedora 最新版，系统默认的包管理器已经换成了 dnf（Dandified YUM）
- 虽然为了兼容性，输入 yum 通常仍然生效（软链接到 dnf），但在这些新系统上，建议直接使用 dnf，因为它的依赖解析算法更先进，性能更好，且用 C++ 重写了内核。
- 好消息是：dnf 的命令用法和 yum 几乎 99% 相同，把上面的命令里的 yum 直接换成 dnf 即可无缝使用。

## 其他安装软件的方式
### wget
wget 本身不是一种“安装方式”，而是一个“下载工具”。
```bash
wget https://example.com/nginx.rpm    # 下载
rpm -ivh nginx.rpm                    # 安装（如果缺依赖会报错）
```
### curl
万能数据传输。它不仅能下载，还能模拟浏览器发请求、调 API 接口、查看网页源码。它默认把内容打印在屏幕上
网络“管道”安装：`curl ... | bash`
这是网上教程最常见也最危险的“一行命令”：
```bash
curl -fsSL https://example.com/install.sh | bash
```
它本质上是从网上下载一个 Shell 脚本，并直接交给 Bash 解释执行。这个脚本里写什么，系统就执行什么（可能是在线安装、配置环境变量、甚至删除文件）
### “即下即用”的单文件格式：AppImage
这是一种无需安装的格式。软件被打包成一个单独的 .AppImage 文件，下载后给它加上执行权限（chmod +x），双击就能运行，不用解压、不用安装、不用 root 权限。用完直接删掉文件，系统干干净净，不留任何痕迹。
### 内核级驱动安装：DKMS（动态内核模块支持）
这不是安装普通应用，而是安装内核驱动模块（如显卡驱动、VirtualBox 内核增强）。它会在你每次升级 Linux 内核时，自动重新编译驱动，确保驱动版本与最新内核匹配。如果你用 yum 装显卡驱动，底层往往调用的就是 DKMS 机制。
### 不可变系统的“原子更新”：rpm-ostree
这是 CentOS 8/9 中 CoreOS 或 Silverblue 变种使用的技术。它不直接修改根文件系统，而是把整个操作系统当成一个 Git 仓库来管理。你执行 rpm-ostree install nginx，它不会立刻改动当前系统，而是下载一个完整的系统镜像层，重启时直接切换到这个新镜像。

# 主流操作系统的包管理器
| 操作系统 | 包管理器 | 说明 |
| - | - | - |
|Red Hat 系 (CentOS/RHEL/Fedora)| yum / dnf | 后缀为 .rpm|
|Debian 系 (Ubuntu/Debian)| apt / apt-get | 同样自动解决依赖，后缀为 .deb（最流行的 Linux 桌面/服务器）|
|Arch 系 (Manjaro/Arch)| pacman |滚动更新，软件包极新，深受极客喜爱|
|macOS| brew (Homebrew) |  Mac 上的包管理器，用来装命令行工具（如 wget、node）。注意：brew 在 Linux 上也能装，但一般不作为主力，Linux 还是优先用系统自带的 apt/yum|
|Windows| winget / choco | Windows 原生包管理器，还在发展中|
