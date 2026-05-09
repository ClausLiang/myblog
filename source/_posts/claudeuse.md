---
title: claude code的使用记录
date: 2026-05-09 17:40:11
updated: 2026-05-09
tags: ai
categories: ai
---
<script type="text/javascript" src="/myblog/custom.js"></script>

# 安装
官网安装的方式如下
```bash
# mac
curl -fsSL https://claude.ai/install.sh | bash
# macOS 也可使用 Homebrew：
brew install --cask claude-code

# windows
irm https://claude.ai/install.ps1 | iex

# 验证安装成功
claude --version
```
在国内一般安装不成功，Anthropic 已弃用 npm 安装方法，但npm的安装方式仍是一种可行方案
```bash
npm install -g @anthropic-ai/claude-code
```

# 配置
## 官方方式
```bash
# 打开项目目录
cd your-project
# 执行claude命令
claude
```
首次启动时会：
1. 提示选择主题、确认安全须知
2. 在浏览器中完成 Claude 账号授权
3. 信任当前工作文件夹
## 接入deepseek模型方式
国内上述方式不可用，可以接入deepseek-v4大模型



# 使用经验记录