---
title: gitignore修改了但不生效
date: 2023-09-18 14:07:49
updated: 2023-09-18
tags: git
categories: git
---
gitignore修改了但不生效，一般是由于缓存导致的，可以尝试清除缓存并重新提交
```zsh
git rm -r --cached .
git add .
git commit -m "清除 Git 缓存并重新提交"
```