---
title: git常用命令
date: 2025-03-04 19:14:51
updated: 2025-04-16
tags: git
categories: git
---
<script type="text/javascript" src="/myblog/custom.js"></script>

# 常用
## 清理远端已经删除但本地还有缓存的分支
```bash
git remote prune origin
```
或者
```bash
git remote update origin --prune 
```

## 拉取远端release分支并合并到当前分支
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

## 推送
```bash
git push -u origin release
```
-u是为使本地release和远端release做关联
```bash
git push --force # 强制推送
```

## 退到某个版本
```bash
git reset --hard  d36a7281ca2c72a739e887d572faaee5ccdbfc05
```
git reset HEAD^ 回退到上个版本
git reset HEAD^^ 回退到上上个版本

# 基础
## 初始化
```bash
git init
git add index.html
git commit -m '注释内容' // 提交本地仓库
git remote add origin 'url' //将本地仓库关联到github仓库上
git push -u origin master //提交代码
```
## 分支管理
```bash
git branch //查看分支
git checkout -b 'branchName' //创建分支
git checkout 'branchName' //切换分支

git merge 'branchName' //合并分支
git branch -d 'branchName' //删除分支
git branch -D 'branchName' //强制删除分支

git status //查看状态

```