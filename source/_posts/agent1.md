---
title: 大模型工程落地的一些概念
date: 2026-08-30 17:23:12
updated: 2026-08-30
tags: agent
categories: agent
---
<script type="text/javascript" src="/myblog/custom.js"></script>

岗位：大模型应用工程师、智能体开发、agent开发

大模型工程的5种方式：提示词工程、RAG、微调、续训、智能体开发。

# AIGC、AGI
## AIGC（Artificial Intelligence Generated Content）
人工智能生成内容
以大模型预训练模型为核心，通过学习海量数据中的统计规律和语义结构，在人类输入提示或条件约束后，自动生成文本、图像、音频、视频、代码等多模态内容的技术与应用体系。
## AGI（Artificial General Intelligence）
通用人工智能
跨领域、跨任务的通用认知能力的人工智能形态。拥有和人类一样通用的认知能力。
有人认为AGI永远不会出现，有人认为会出现。
### 认为AGI不会出现的原因：
1、物理的边际快达到了。2、用于大模型训练的只是文字，视觉听觉的材料之前没有很好的保存，没法喂给大模型训练。3、AI只是模式匹配，没法真正推理。
### 主流认为通向AGI的路径主要有：
1.提升基础模型的通用能力。
2.通过Agent设计对模型的能力进行组织和调度，使模型具备目标分解、长期规划、工具使用与环境交互等能力。从而在复杂任务中表现出来更接近通用智能的行为。

# 提示词工程
略
# RAG（Retrieval-Augmented Generation）
检索增强生成
一种结合信息检索（retrieval）与文本生成（generation）的技术，AI应用收到用户请求后，先从外部知识库检索相关资料，并将这些资料与用户请求一并提交给大模型，大模型在此基础上生成更准确、更有依据的回答。
## 何时需要RAG
当模型缺乏必要的参考信息时，RAG可以用来补充外部知识与上下文。如获取最新信息，或者需要查询公司内部资料等场景。
## 实现方式
1.在线平台：dify/coze
2.离线客户端：各种笔记软件、 cherry studio、ima
3.借助langchain等框架或纯python代码实现

# 微调（Fine-tuning）
在已训练好的模型上，按照SFT或RLHF/RLAIF的范式训练模型。通常采用SFT的训练范式。
