---
title: hexo入门--用hexo搭建一个自己的博客网站真香
date: 2022-08-31 21:54:57
tags:
    - hexo
categories: 进阶
---
> 想不用框架搭建一个自己的博客网站，后来发现hexo真香。
## 1.安装hexo
```zsh
npm install -g hexo-cli
```
## 2.初始化项目
```zsh
hexo init myblog
```
## 3.比较好看的主题
查阅了很多文章，知乎上有篇文章写的比较好。总结下推荐3款：butterfly、shoka、kaze

我选了比较流行的butterfly，根据butterfly的文档安装将其到项目里

将butterfly的配置文件内容复制到_config.butterfly.yml中，_config.butterfly.yml的优先级高，这样可以避免butterfly升级后带来的不必要的麻烦。

## 4.常用基本命令
```zsh
hexo g # 生成静态文件
hexo new abc # 生成文章，会在source/_posts目录下生成一个abc.md文件
Hero new page about # 生成页面
Hexo server # 启动本地服务
hexo clean # 清除缓存文件 (db.json) 和已生成的静态文件 (public)
```
## 5.了解front-matter
文件最上方以’---'分隔的区域，用以指定单个文件的变量，常用参数有下列几个：
```
layout: # 布局 默认是post
title: # 标题
date: # 创建时间
update: # 修改时间
comments:true # 开启文章的评论
tags：# 标签（不适用于分页）
categories: #分类（不适用于分页）
```
分类具有顺序和层次性，标签没有。简单处理就是一篇文章设置一个分类就好了，标签可以设置多个。当然也可以设置多级分类，详情参考hexo官方文档，里面说的比较明白。
## 6.yaml
科普：不是一种标记语言，仍是一种标记语言。后缀.yml
## 7.创建标签页面
在主题官网的文档里查到创建标签页面`hexo new page tags`，找到文件`source/tags/index.md`,添加type: “tags"
```
---
title: 标籤
date: 2018-01-01 00:00:00
type: "tags"
---
```
## 8.同上创建分类页面
`hexo new page categories`，并修改文件`source/categories/index.md`,添加type: “categories"
## 9.创建友情链接
`hexo new page link`，并修改文件`source/link/index.md`,添加type: "link"

在Hexo博客目录中的source/_data（如果没有 _data 文件夹，请自行创建），创建一个文件link.yml
```yml
- class_name: 友情链接
  class_desc: 那些人，那些事
  link_list:
    - name: Hexo
      link: https://hexo.io/zh-tw/
      avatar: https://d33wubrfki0l68.cloudfront.net/6657ba50e702d84afb32fe846bed54fba1a77add/827ae/logo.svg
      descr: 快速、简单且强大的网誌框架

```
友情链接界面也可以由用户自己自定义，只需要在友情链接的md档设置就行，以普通的Markdown格式书写。

## 10.修改主题的配置文件_config.butterfly.yml
展示主页顶部的菜单
```yml
menu:
  主页: / || fas fa-home
  归档: /archives/ || fas fa-archive
  标签: /tags/ || fas fa-tags
  分类: /categories/ || fas fa-folder-open
```
