# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

求职学生（校招为主；用户原话："服务对象主要是同学求职的时候，做测评"）。场景：笔试测评准备期，碎片时间刷题、模考、复盘错题。

## Product Purpose

求职测评练习平台「上岸测评」：言语理解、资料分析、图形推理三科真题练习 + 全真限时模考 + 错题本 + 学情看板 + AI 逐题讲解与举一反三变式题。成功 = 用户在真实求职测评笔试中通过（上岸）。

## Positioning

真题题库 × AI 思维链拆解 × 举一反三变式生成的「测-学-练」闭环；数据全部本地（localStorage），无账号门槛。

## Operating Context

浏览器 SPA（React 19 + Vite + Tailwind v4），express 后端代理 AI（/api/ai/*）。进度、错题、笔记、AI 变式题库存于 localStorage（key 前缀 shangan_*）。

## Capabilities and Constraints

- 7 个主 tab：题库精练 / 图推实验室 / 全真模考 / 错题本 / AI 变式题库 / 考点速算宝典 / 学情看板
- 题目内容来自题库 PDF 解析（src/data/*Questions.ts，只读数据，不得虚构）
- 无登录体系；AI 依赖服务端 key（.env）
- 品牌词严禁出现「北森」（法律原因，用户确认）

## Brand Commitments

- 名称：「上岸测评」（用户本会话选定）
- 视觉世界：套用 drawably 手绘控件语言（用户钉死；深度重整、非最小路径）
- 禁用一切「北森/beisen」品牌痕迹

## Evidence on Hand

- 真题数据：src/data/{verbal,dataAnalysis,graphic}Questions.ts（727 题）+ public/qbank 配图（400+ webp）
- 手绘参考：/tmp/drawably（drawably@0.3.10 源码 clone，机制已研读）；npm 包已安装
- 学情口径：src/data/analytics.ts（真实作答驱动）

## Product Principles

1. 做题效率优先：刷题/模考操作路径最短，视觉服务于任务不干扰任务
2. 数据诚实：一切统计与掌握度来自真实作答记录，不虚构
3. 本地优先：用户进度永存本地，任何升级不丢数据
4. 上岸氛围：手账式手绘带来备考仪式感，但 Operate 场景下克制、可扫描

## Accessibility

prefers-reduced-motion 时冻结 boil 动画（drawably 内建支持）；真实控件保留键盘与读屏语义（drawably attach 模式）。
