---
title: 在github pages部署vue项目
date: 2025-12-26 15:49:47
updated: 2025-12-26
tags: githubpages
categories: 前端得懂的运维技能
---
<script type="text/javascript" src="/myblog/custom.js"></script>

# 将vue项目部署到github pages
主要运用了github pages的静态文件托管功能以及github提供的action功能
用`action`创建一个`workflow`，github会自动执行这个`workflow`，将项目打包成静态文件，并上传到github pages。
`workflow`的配置文件在`.github/workflows/deploy.yml`中

![image.png](/images/githubpages-20251226.png)

github提供了几个workflow模板，可以参考，比如Jekyll等，但是自己写一个比较好。
可参考vite官网中的的[部署静态站点](https://cn.vitejs.dev/guide/static-deploy)

# yaml文件
后缀为.yml或者.yaml的文件都是yaml文件
YAML（YAML Ain't a Markup Language）是一种‌以数据为中心的可读性序列化格式‌，设计初衷是简化配置文件编写。


# deploy.yml
点完create your own按钮后，记得把文件名改为deploy.yml，GitHub会帮你在目录`.github/workflows/deploy.yml`下生成文件，以下是yml文件内容。
```yml
# 将静态内容部署到 GitHub Pages 的简易工作流程
name: Deploy static content to Pages

on:
  # 仅在推送到默认分支时运行。
  push:
    branches: ['main']

  # 这个选项可以使你手动在 Action tab 页面触发工作流
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages。
permissions:
  contents: read
  pages: write
  id-token: write

# 允许一个并发的部署
concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  # 单次部署的工作描述
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6
      - name: Set up Node
        uses: actions/setup-node@v6
        with:
          node-version: lts/*
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v4
        with:
          # 上传dist文件夹
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

```
保存完以后，再次提交代码就会触发自动部署了。
可访问我的站点例子：[我的vue3-project](http://liangyonggang.com/vue3-project/)