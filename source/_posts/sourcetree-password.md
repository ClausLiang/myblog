---
title: 解决sourcetree每次拉代码都需要输密码
date: 2020-06-22 17:30:02
tags:
    - sourcetree
categories: 基础
---

**在.git目录有个config文件，在路径前配置下用户名和密码**

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

