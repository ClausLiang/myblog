---
title: Linux下jenkins的安装与配置
date: 2022-08-23 17:48:59
tags: linux
categories: 前端得懂的运维技能
---
## 安装jenkins
上jenkins官网查看其安装方法 https://www.jenkins.io/zh/download/
第一次选了稳定版，但是在装插件的过程中出现插件不适应于当前版本的问题（稳定版更新较慢），遂将其卸载，安装了定期发布版。安装命令如下：
```zsh
# 下载repo 文件
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat/jenkins.repo
# 导入公钥
sudo rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key
# 安装jdk，本人试了装其他低版本的jdk会有问题，后改为Jenkins官网推荐的版本
yum install fontconfig java-11-openjdk
# 安装jenkins
yum install jenkins
```

## 启动jenkins
```
service jenkins start

service jenkins restart # 重启

service jenkins stop # 停止
```
启动以后报个错：Job for jenkins.service failed because a timeout was exceeded.
浏览器访问Jenkins提示如下
![jenkinerror](/images/jenkins_error_2022-8-25.png)

### 因为访问官网的源太慢。我们需要换一个源，不使用官网的源
查找文件 find / -name *.UpdateCenter.xml，结果是 /var/lib/jenkins/hudson.model.UpdateCenter.xml
用vim修改该文件。

将url标签里面的内容 https://updates.jenkins.io/update-center.json

改为：https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json

重新启动即可，完成后打开浏览器输入ip:8080，
默认密码用cat /var/lib/jenkins/secrets/initialAdminPassword查看

登入后安装推荐插件

## 创建jenkins任务
填写git地址用户名密码等等，步骤略，构建命令：
```
hexo clean
hexo g
rm -rf /root/myblog/* # 每次清空项目部署的目录
mv ./public/* /root/myblog # 将项目打包文件移动到目录
```

## 开始构建
`报错了 hexo：command not found`
但是用ssh远程连接服务器找到jenkins的工程所在目录/var/lib/jenkins/workspace/myblog 执行上述命令是成功的，不知道为何jenkins执行它们就不能成功。搜索了一堆解决方案：
### 尝试方法1:
修改Jenkins的配置文件 vim /etc/sysconfig/jenkins 将 JENKINS_USER=“root"由Jenkins改为root，在构建命令前增加
`#!/bin/bash -ilex`

解析：可以通过-i参数和-l参数让bash为login shell and interactive shell，就可以读取/etc/profile和~/.bash_profile等文件，对于e参数表示一旦出错,就退出当前的shell，x参数表示可以显示所执行的每一条命令。

重启Jenkins，重新构建，并不生效。

### 尝试方法2:
`echo $PATH`查看系统环境变量，将服务器的环境变量加入Jenkins。还是不生效。

### 尝试方法3:
搜索“Jenkins执行脚本没有权限”找到方法如下：

修改默认用户权限
```
chown -R root:root /var/log/jenkins/
chown -R root:root /var/lib/jenkins/
chown -R root:root /var/cache/jenkins/
```
执行之后重启jenkins，这个时候坏了，Jenkins都不能重启了。

### 尝试方法4:
再次搜索‘jenkins command not found’找到如下解决办法：

在Google中突然发现一篇修改端口踩坑的文章，文章中提到使用systemctl 启动时不会使用上述的etc/init.d/jenkins配置文件。
而是会使用/usr/lib/systemd/system/jenkins.service文件，vim /usr/lib/systemd/system/jenkins.service将user=jenkins改为root，重启。此时Jenkins又启动起来了，但是构建项目依然报错。

经过同事提醒，再次尝试方法1，结果成功了，终于成功了。

记录一下配置Jenkins的全过程。

