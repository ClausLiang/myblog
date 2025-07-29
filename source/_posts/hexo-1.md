---
title: hexo入门--用hexo搭建一个自己的博客网站真香
date: 2022-08-31 21:54:57
tags: hexo
categories: 进阶
---
<script type="text/javascript" src="/myblog/custom.js"></script>

> 作为一个前端一开始想不用框架，自己开发搭建一个博客网站，后来发现hexo真香。

# 了解学习hexo的使用方式
## 安装hexo
```bash
npm install -g hexo-cli
```
## 初始化项目
```bash
hexo init myblog
```
## 选一个比较好看的主题安装
查阅了很多文章，知乎上有篇文章写的比较好。总结下推荐3款：butterfly、shoka、kaze

我选了比较流行的butterfly，根据butterfly的文档将其安装到项目里

将butterfly的配置文件内容复制到_config.butterfly.yml中，_config.butterfly.yml的优先级高，这样可以避免butterfly升级后带来的不必要的麻烦。

附：
[hexo官网](https://hexo.io/zh-cn/)
[butterfly官网](https://butterfly.js.org/)

## hexo常用基本命令
```bash
hexo g # 生成静态文件
hexo new abc # 生成文章，会在source/_posts目录下生成一个abc.md文件
hero new page about # 生成页面
hexo server # 启动本地服务
hexo clean # 清除缓存文件 (db.json) 和已生成的静态文件 (public)
```
## 了解front-matter
文件最上方以’---'分隔的区域，用以指定单个文件的变量，常用参数有下列几个：
```md
layout: # 布局 默认是post
title: # 标题
date: # 创建时间
update: # 修改时间
comments:true # 开启文章的评论
tags：# 标签（不适用于分页）
categories: #分类（不适用于分页）
```
分类具有顺序和层次性，标签没有。简单处理就是一篇文章设置一个分类就好了，标签可以设置多个。当然也可以设置多级分类，详情参考hexo官方文档，里面说的比较明白。
## yaml
在项目中发现很多.yml后缀的文件，这些是yaml文件，科普：yet another markup language，不是一种标记语言，仍是一种标记语言。
## 创建几个必要页面

### 创建标签页面
在主题官网的文档里查到创建标签页面`hexo new page tags`，找到文件`source/tags/index.md`,添加type: “tags"
```md
---
title: 标籤
date: 2018-01-01 00:00:00
type: "tags"
---
```
### 创建分类页面
`hexo new page categories`，并修改文件`source/categories/index.md`,添加type: “categories"
### 创建友情链接
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

## 修改主题的配置文件_config.butterfly.yml
修改主页顶部的菜单方便其正确展示
```yml
menu:
  主页: / || fas fa-home
  归档: /archives/ || fas fa-archive
  标签: /tags/ || fas fa-tags
  分类: /categories/ || fas fa-folder-open
```
修改头像avatar
```yml
avatar:
  img: xxx/img/avatar.gif
  effect: false # true会一直转
```
修改首页banner index_img
```yml
# The banner image of home page
index_img: xxx/img/bg2.jpg # 首页banner
```
修改首页文章卡片的封面相关
```yml
cover:
  # display the cover or not (是否顯示文章封面)
  index_enable: false # 关闭文章封面
  aside_enable: false # 关闭侧边栏最新文章图标
  archives_enable: true
  # the position of cover in home page (封面顯示的位置)
  # left/right/both
  position: both
  # When cover is not set, the default cover is displayed (當沒有設置cover時，默認的封面顯示)
  default_cover:
    # - https://i.loli.net/2020/05/01/gkihqEjXxJ5UZ1C.jpg
```
等等，很多配置可以根据自己喜好修改，不再赘述
## 给博客引入评论系统
查看文档butterfly支持很多评论系统，有disqus，livere，gitalk，valine，waline，twikoo等等，我一开始准备选gitalk，因为其是基于github issues的插件，想着是可能比较稳定，结果测试半天发现在国内几乎没法使用，被墙的严重。后尝试发现`livere`是真的好用，只需在livere官网注册一个应用，拿到一个id，在hexo中配一下id即可。非常好用。

## 给博客加上搜索功能
在butterfly官网上有三个插件可供选择，我主要试了hexo-algoliasearch和hexo-generator-search，前一个是借助第三方的网站algolia，需要在algolia注册账号，并需要执行命令把自己网站的信息上传到algolia，每次搜索都需要请求algolia的数据，网络较慢，导致我的网址打开速度降低，影响用户体验。并且我不知道什么原因，没有试成功，搜索结果为空。
hexo-generator-search插件是把文章的信息生成一个搜索库放在本地，所以搜索效率很高。
该插件使用步骤如下：
### 在博客目录下，运行以下命令安装hexo-generator-search插件：
```bash
npm install hexo-generator-search --save
```

### 配置插件：
在Hexo博客的配置文件_config.yml中，添加以下配置：
```yaml
search:
  path: search.xml
  field: post
  format: html
  limit: 10000
```
其中，path为生成的搜索文件名，field指定搜索的对象（可以是post或page），format指定搜索结果的格式，limit指定最多显示的搜索结果数量。

在_config.butterfly.yml中，修改local_search的enable为true
```
local_search:
  enable: true
  preload: false
  CDN:
```

### 生成搜索文件：
在Hexo博客目录下，运行以下命令生成搜索文件：
```bash
hexo generate
```

完成以上步骤后，您的Hexo博客就可以使用站内搜索功能了。您可以在博客中输入关键字进行搜索，并查看搜索结果页面。
需要注意的是插件官网的配置中有个template配置，无需配置该项。配置了反而无法正常搜索。

# 将博客系统部署到服务器
如果想不花一分钱，可以直接将博客项目部署到github page或者gitee page，优点就是免费，只此一个优点吊打所有。

也可以花点小钱，在阿里云先买个域名再买台云服务器，这样的话，就可以拥有一个属于自己的域名，也不能干啥特别的事，就当是给自己做的一个名片吧，玩玩。一个域名5年几百块钱，一台ecs一个月几十块钱。

云服务器根据自己需要买适合的配置，我一开始买了一个最低配的1核1G的，后发现跑服务太卡所以给它多花了一块钱升级了一下，改成了突发性能型的，因为我大部分时间对性能要求不高，只需跑命令的时候性能好点就行，突发性能的性价比高。

学习相关知识，在服务器搭建一个nginx，再搭一个Jenkins方便部署博客。关于nginx和Jenkins的配置我也在其他文章中做了简单记录。

至此一个简单的博客网站就搭建好了，大功告成，当然还有很多可以优化的地方后面慢慢研究。

[我的博客网站](http://liangyonggang.com/myblog)

