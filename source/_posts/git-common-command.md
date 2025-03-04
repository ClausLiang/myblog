---
title: git常用命令
date: 2025-03-04 19:14:51
tags: git
categories: git
---
<script type="text/javascript" src="/myblog/custom.js"></script>

# 拉取远端release分支并合并到当前分支
```bash
git pull origin release
```
git pull = git fetch + git merge
以上一条命令等于下面两条命令
```bash
git fetch origin release # 从远端把release分支拉下来
git merge origin/release
```
```bash
git merge release # 把本地的release合并到本地当前分支
```

# 推送
```bash
git push -u origin release
```
-u是为使本地release和远端release做关联
```bash
git push --force # 强制推送
```

# 退到某个版本
```bash
git reset --hard  d36a7281ca2c72a739e887d572faaee5ccdbfc05
```
git reset HEAD^ 回退到上个版本
git reset HEAD^^ 回退到上上个版本

