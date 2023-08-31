---
title: github推送代码由于网络原因一直失败的解决办法
date: 2023-08-31 11:41:22
tags:
    - git
categories: 基础
---
> github是全球最大的代码托管平台，但是由于墙的原因，在国内访问经常会有问题，虽然国内也有平替比如gitee，但是说实话比github还是差点意思。

最近发现github推送代码总是失败，查看错误日志一般都是由于网络的原因。

于是各种切换网络，使用各种梯子，但总是不能完美解决问题。

今天实在是忍不了，好好搜了一下解决方法。原路可以用ssh的方式解决这个问题。（原先我下载代码一般习惯用http的方式，这下发现它的弊端了。）下面介绍一下用ssh克隆以及推送代码的方法：

# 1.创建ssh密钥
本机是mac电脑，打开ssh的目录
```
cd ~/.ssh
```
生成公钥私钥
```
ssh-keygen -t rsa -C "<github资料里的邮箱>"
```
-t 指定要创建的密钥类型为rsa
-C 注释

敲了该命令会出现 `Enter file in which to save the key (/Users/用户名/.ssh/id_rsa):`让输入密钥文件名的提示，可以直接回车，默认生成名为 id_rsa 及 id_rsa.pub 的私钥及公钥。

再次出现`Enter passphrase (empty for no passphrase):`让输入密码的提示，可以直接回车表示不设密码。

# 2.打开github新建ssh key
打开github，点击右上角头像 -> settings -> SSH and GPG keys -> New SSH keys

title随便填，key的输入框中填写上一步生成的id_rsa.pub文件中的内容。

# 3.重新克隆仓库，复制ssh的链接
此后拉取以及推送代码就不会出现网络问题而导致失败了。


