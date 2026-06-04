---
title: claude code的使用记录
date: 2026-05-09 17:40:11
updated: 2026-06-04
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

## ! 用法
! 是输入框的 shell 直通前缀，如`! git push origin main`
  具体行为：

  - 命令直接在你的 $SHELL 里跑，和你自己在终端敲完全等价——同样的环境变量、同样的权限、同样的工作目录
  - 输出（stdout/stderr）和命令本身会以 `<bash-input>` / `<bash-stdout>` 标签的形式喂回给我作为上下文，所以你看到我(指CLAUDE CODE)能"知道"刚才推送成功了
  - 不经过 Claude Code 的权限系统——既不弹 permission prompt，也不过 auto 模式分类器。因为执行主体是你，不是我

  这就是为什么我代你 git push origin main 被 auto 拦了，但你用 ! 推就没事——分类器管的是"Claude 主动做的事"，不管"用户自己敲的命令"。

  所以 ! 适合两类场景：
  1. 需要交互的命令（gcloud auth login、vim、docker run -it）
  2. 我被权限系统拦住但你判断没问题、不想动 settings 的命令（push main、rm -rf、force 系列）
  
  代价：因为是你的 shell，敏感操作不要随便用 —— 没有任何 review/guard，敲下回车就执行。

## 幻觉
用AI处理复杂任务，有时候容易出现幻觉，或者说出现虚构。是指模型生成的内容看起来合理，但其实是错的，编造的。而且大模型说错话时的语气和说对话时一模一样，这很可怕。
在写代码时容易出现的幻觉场景有这几种常见形态：
1. 编造API，比如，其实这个函数根本不存在。
2. 编造import路径，有些看着合理的路径其实并不存在。
3. 版本错配，比如AI说vue3.4有vapor mode，但其实在3.6中才出现。
4. 完成度虚报，说已修复UI卡顿问题，但大模型并没有真正启动浏览器验证，只是觉得应该修复了。
5. subagent自报完成了xx任务，但其实只做了一半，自己总结时美化了。

### 为什么会发生？
大模型是按概率预测token，遇到不知道的事，它倾向于补一个最像的，而不是停下来说不知道。
训练数据里这类的api或者版本见多了，觉得概率上就应该是这样，但我们的代码里并不是这样。
复杂任务会积累，第2步一个小幻觉，到第7步可能就是方向上的差别。

### 应该怎么预防？
一、首先是写prompt的时候要写相对准备的描述，这样能极大减少出现幻觉的概率
好的prompt=明确的事实 + 明确的边界 + 明确的"允许说不知道" + 可验证的输出格式

1. 如何给AI明确的事实我举一个例子，比如用Claude code修改一个bug，不要简单的说这个错误改一下，而应该说我点击某个按钮的时候，没有达到什么样的预期，控制台报错信息是什么，把问题描述清楚，也把预期说清楚，不要让AI猜。
2. 如何给AI划清边界我举一个例子，比如修改某个分页报错问题，告诉他不要重构，不要重命名，不要顺手优化别的内容。当然可能好的模型不需要这么繁琐的界定边界。
3. 如何给AI说不知道的台阶我举一个例子，比如要问antDesign某个版本有没某个特性，最好是这样说，antDesign4.2版本支不支持某某特性，如果不确定就说不确定，不要根据相邻版本推测。

二、预防幻觉的方法是把一些反幻觉的文档写进claude.md中。（如果用的是Claude code）比如记录一些重要的反直觉点，Claude code每次开启会话，都会读Claude.md，这样就可以避免很多幻觉。

上面说的都是预防的方案，但最主要的还是要去人工审核AI生成的代码。当项目出现问题的时候，AI永远都不会给你背锅，人永远都是第一责任人。

## 工具是什么意思？内建工具？mcp工具？
"工具"是一个具体的技术概念，不是泛指。MCP 工具是它的一个子集。
  
    "工具"在 LLM 上下文里的精确含义
  
    我（LLM）本身只会输出文本。我没法自己打开文件、跑命令、上网。
  
    工具 = 我能调用的函数。当我"想读一个文件"时，我其实是输出了一段特殊格式的文本（一个工具调用请求），harness（Claude Code
    这个外壳程序）接住它、真的去执行、把结果作为下一条消息塞回给我。我看到的是"我读了文件"，本质上是 我输出请求 → harness 执行 → 把结果当用户消息回灌。
  
    每个工具都有一份 schema：名字、参数定义、返回什么。我必须按 schema 调用，否则报错。
  
    Claude Code 里"工具"的几个来源
  
    在你当前这个会话里，工具来自三个不同地方：
    
  1. 内建工具（Claude Code 自带）
    
  - Read / Edit / Write — 读写文件
  - Bash — 执行 shell 命令
  - Agent — 派子代理（比如刚才的 Explore）
  - TaskCreate / TaskUpdate — 任务清单
  - ScheduleWakeup — 定时唤醒
    
    这些是 Claude Code 团队写的，跟着 CLI 一起发布。
    
  2. Skills（技能）
    
  - 你这边可用的：update-config / simplify / loop / schedule / review 等
  - 通过 Skill 工具调用，每个 skill 是一段预设的工作流 + 它自己可能调用其他工具
    
  3. MCP 工具（这才是你问的那种）
    
    MCP = Model Context Protocol，是 Anthropic 推的一个开放协议，让外部进程（"MCP 服务器"）把自己的能力以工具形式暴露给 LLM。
    
    你这个会话里有几个 MCP 工具，一眼能认出来——它们的名字带 mcp__ 前缀：
    
    mcp__claude_ai_Gmail__authenticate
    mcp__claude_ai_Google_Calendar__authenticate
    mcp__claude_ai_Google_Drive__authenticate
    
    格式是 mcp__<服务器名>__<工具名>。这三个分别来自 Gmail / Google Calendar / Google Drive 的 MCP 服务器——理论上我可以让 Claude 帮你查邮件、看日历、读 Drive
    文件，前提是先走 authenticate 流程。
    
    三者关系
    
    所有"工具"
    ├── 内建工具（Read / Bash / Edit ...）        ← Claude Code 自带
    ├── Skills（review / simplify / loop ...）   ← 预设工作流
    └── MCP 工具（mcp__xxx__yyy）                 ← 通过 MCP 协议接入的外部能力
    
    对我（LLM）来说，调用方式是一样的——都是输出工具调用请求，harness 路由到对应实现。区别只在"谁在执行"：
  - 内建工具：Claude Code 进程自己执行
  - MCP 工具：转发给一个独立的 MCP 服务器进程执行（可能是本地的，也可能跨网络）
    
    为什么 MCP 重要
    
    MCP 是扩展机制。任何第三方都能写 MCP 服务器，把自己产品的能力暴露给 Claude——数据库查询、Jira、Linear、Slack、内部 API……不用 Anthropic 改 Claude Code 代码，装个 MCP server 就能用。
    
    一个本会话里能验证的事实
    
    会话开头我看到一条 system reminder 说，有一堆工具是"deferred"（延迟加载），其中就包括那三个 mcp__claude_ai_* 工具。意思是 schema 没自动塞给我，要用得先调 ToolSearch
    加载——这跟内建工具默认就在我手里、随时能调，是不一样的。

### mcp工具具体能干什么事情，你给我举几个例子说明
MCP 工具的本质是"把外部系统的 API 包装成我能调用的函数"。举几类真实例子，从你本会话已经有的开始：

1. 你这会话里已经装着的三个
  
  mcp__claude_ai_Gmail__authenticate
  mcp__claude_ai_Google_Calendar__authenticate
  mcp__claude_ai_Google_Drive__authenticate
  
  每个服务器一般不止 authenticate 这一个工具（你看到的只是登录入口，登录后会出来更多）。实际能干的事：
  
- Gmail：你说"帮我看下昨天后端那个同事发的邮件他要的接口字段是啥"——我去搜邮件、把正文摘出来。或者"草拟一封回复"——我写草稿、你审完发送。
- Google Calendar：你说"看下我下周三下午有没有空开会"——我查日历、回答忙闲；或者"在 5/20 下午 2 点建一个 1 小时的'重构评审'会议"——我直接创建。
- Google Drive：你说"找我去年写的那篇 idt-tars 架构 doc 的链接"——我搜 Drive、返回文件 URL；或者读文档内容回来分析。
  
2. 开发工作流（最常用的一类）
  
- GitHub MCP：评论 PR、查 issue 状态、读 CI 日志、merge PR。"帮我看下 PR #234 上 CI 为什么挂了"——我调工具拿日志、定位失败 step。
- Linear / Jira MCP：建 ticket、改状态、查谁分配了什么。"把刚才发现的那个 bug 建个 ticket，标 P1"——直接建。
- Sentry MCP：查最近的报错。"看下生产环境过去 1 小时报最多的那个错的 stack trace"——拉回来。
  
3. 数据库 / 数据查询
  
- Postgres / MySQL MCP：直接跑 SQL。"线上 users 表里 created_at 是 NULL 的有多少条"——我跑查询、拿结果。
- BigQuery / Snowflake MCP：跑数据仓库查询。"过去 7 天 DAU 趋势画一下"——跑 SQL + 直接画图。
  
  ▎ 这类危险性最高——直接连生产库的 MCP 通常会配只读权限。
  
4. 浏览器自动化
  
- Playwright MCP：开浏览器、点页面、截图。
- 在你这个 idt-tars-web 项目里就很合适：你说"启动 dev server 后访问 /tars-web/cert-mgmt，截一张图给我看现在的样子"——我启
server、开浏览器、截图、回灌图到对话里供我"看"。
- CLAUDE.md 里那条"UI 改动要在浏览器里手测"的硬规矩，有 Playwright MCP 就能我自己测。
  
5. 设计与文档
  
- Figma MCP：读设计稿。"按 Figma 里 'Cert 列表页 v2' 那张稿子改 CertMgmt.vue"——我直接读设计、改代码，不需要你给我截图。
- Notion / Confluence MCP：读内部知识库。"我们团队的代码评审规范是哪条"——去 Notion 搜回来。
  
6. 内部 / 自定义系统
  
  这是 MCP 最大的价值点——任何公司都能写自己的 MCP server：
  
- 你们公司的工单系统、内部用户后台、客服系统、监控平台……写个 MCP server 包一下，就能让 Claude 直接操作。
- 比如你们做 SSL 证书管理（idt-tars），完全可以包一个 mcp__tars__list_certs，让我直接查证书状态而不是 grep 代码。
  
7. 本机能力
  
- Filesystem MCP：操作工作目录之外的文件系统。
- Shell MCP（远程）：登 SSH 跑命令。"在那台测试机上看下 nginx 日志最后 100 行"——MCP 走过去查回来。
  
`一个让"MCP 是什么"具象化的例子`
  
  不用 MCP 时，你想让我看一封邮件：
1. 你打开 Gmail
2. 复制正文
3. 粘贴到对话里
4. 我读
  
  用了 Gmail MCP：
1. 你说"看那封邮件"
2. 我调 mcp__Gmail__search + mcp__Gmail__get_message
3. 直接读到内容
  
  MCP 把"你做中间转运工"这一步消掉了——这是它存在的全部意义。
  
`怎么知道你能装哪些`
  
- 公开市集：anthropic.com 和社区里有 MCP server 目录，能搜到几百个公开 server
- Claude Code 装法：通过 claude mcp add 命令或在 settings.json 里配置（如果你想装某个，我可以告诉你具体命令）

## plan文件方案
`用claude code执行一个比较复杂的任务，应该怎么去操作。`
1. Claude code有一套内置的工具，当处理复杂任务的时候，你可以主动告知他用taskCreate这个工具将要执行的步骤拆分成任务列表。
Claude会自动按照这个任务列表一项一项执行，每当执行完一项，它会在对应的步骤上打勾，标记执行完成。因为是Claude的内置工具，你也可以不去特别干预，完全交给Claude自行判断是否调用。

2. 还有一种方式，你可以告诉Claude让它先给你创建一个方案的file，也就是先要把要执行的步骤落到文件上面来。我一般是这么操作的，我告诉claude先不要修改代码，先把生成的方案创建一个文件，记录详细步骤以及执行状态。这种方式的优势是可以跨越会话，也防止claude如果发生一些意外的崩溃，或者产生幻觉，而导致方案中断。这时候你可以重新开启会话，告诉Claude根据方案文件继续执行。

`对比：`这两种方式应该怎么选择？具体根据场景来区分。
1. 如果只是一个比较简单的任务，不需要跨会话执行，你就只需要告诉Claude调用taskCreate去创建任务列表。
2. 但是如果一个复杂的任务，有可能会执行很长时间，或者中间需要中断处理别的任务，你就需要让claude给你创建一个任务的文件。有了这个文件，就不用担心claude意外中断了。
