---
title: git推代码报错了
date: 2023-04-11 17:32:14
tags: git
categories: 基础
---
别人往我的分支上合并了代码，我在不清楚的情况下直接提交，并推送，git报错，也无法拉取代码了。错误信息如下
```
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint: 
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint: 
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.
```
遇到问题不要慌，即使是英文。仔细读一读。
大致翻译一下，如下文：
你有不同的分支需要说明怎么协调他们。
你可以在下次拉取代码之前执行以下任一条命令
git config pull.rebase false  # 合并
git config pull.rebase true   # 重设基址
git config pull.ff only       # 仅限快进
可以将“git config”替换为“git config--global”来设置默认首选项为所有的仓库。
也可以通过--rebase, --no-rebase, 或者--ff-only写在命令里来覆盖配置的默认项。

然后执行一下 git config pull.rebase false 重新拉取代码，发现可以拉取了。