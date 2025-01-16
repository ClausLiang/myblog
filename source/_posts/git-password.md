---
title: git每次拉代码都需要输密码?
date: 2020-06-22 17:30:02
tags: git
categories: git
---
## sourcetree每次拉代码都需要输密码？
在.git目录有个config文件，在路径前配置下用户名和密码

```
[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
	ignorecase = true
	precomposeunicode = true
[remote "origin"]
	url = http://用户名:密码@url.git
	fetch = +refs/heads/*:refs/remotes/origin/*
```

## vscode每次拉代码都需要输密码？
在code打开推送的代码目录并打开终端输入以下代码
```bash
git config --global credential.helper store
```
一般来说执行完上述命令，第一次推送需要再次填一次账号密码，之后就不需要了
