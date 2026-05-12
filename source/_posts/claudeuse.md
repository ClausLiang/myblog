---
title: claude code的使用记录
date: 2026-05-09 17:40:11
updated: 2026-05-12
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
mac/linux接入方式
```bash
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_AUTH_TOKEN=<你的 DeepSeek API Key>
export ANTHROPIC_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash
export CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash
export CLAUDE_CODE_EFFORT_LEVEL=max
```
windows接入
```bash
$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="<你的 DeepSeek API Key>"
$env:ANTHROPIC_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_EFFORT_LEVEL="max"
```


# 使用经验记录
## 交互模式中的斜杠命令
| 命令 | 作用 |
| --- | ---|
| /init | 扫描项目并生成 CLAUDE.md 记忆文件，让 AI 理解项目结构
| /clear | 清空当前对话历史，开启全新任务
| /compact	|压缩过长对话，解决 token 超限问题
| /memory	|编辑 CLAUDE.md 文件，添加项目规范或编码习惯
| /model	|切换模型（Sonnet/Opus/Haiku）
| /status	|查看当前会话状态和配置信息
|/cost	|查看 token 消耗与预估费用
|/permissions	|查看或更新权限设置

## 6种权限模式
| 模式 | Claude 无需询问可执行的操作 | 最适合场景 | 备注
| --- | ---| --- | --- |
| default| 只能读文件| 入门使用、敏感工作|
| acceptEdits| 读取并编辑文件| 边看边改代码|
| plan| 只能读文件| 探索代码库、规划重构|
| auto| 所有操作（有后台安全检查）| 长任务、减少打断| pro不支持
| dontAsk| 只有预先批准的工具| 锁定环境、CI 流水线|
| bypassPermissions| 所有操作，无任何检查| 仅限隔离容器/虚拟机|

按住 shift + tab 可以在前4中模式之间循环顺序切换

## 先执行init还是先优化代码
先init后优化
1. CLAUDE.md 现在就有价值。重构本身是个多阶段工程（按我们之前的方案至少 5–9 天），这期间你/同事/Claude 都需要一份能描述现状的文档。先有总比等到重构完才有要好。
2. CLAUDE.md 描述"现状"，不是"理想态"。它本来就会随代码演进，这是常态，不是返工。
3. 重构过程本身会用到 CLAUDE.md。比如阶段 2 要把 pageId === ... 收敛进配置时，那一段"17 处分支"的描述刚好是工作起点。
