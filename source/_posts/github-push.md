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
