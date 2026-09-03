---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/components/Header.tsx","src/components/QuestionCard.tsx"]
---

# Surface brief — 上岸测评 全站手绘重整

Scope: 全应用（7 个 tab + 全部弹窗 + 页脚），替换视觉世界（redesign）。Mode: **Operate**（做题工具，扫描性/一致性/状态可见优先）。
Audience/job/action: 求职学生刷题与复盘；快速作答、状态一目了然、少干扰。Proof: 真题内容 + 真实作答统计。

## Direction contract

THESIS: 把测评练习做成一本「上岸手账」——每道题、每个按钮都是纸上的活笔迹；拒绝 SaaS 圆角卡片壳（类目默认样式即反参照）。
OWN-WORLD: 暖纸底 + 细噪点；琥珀墨 #9a4a12 双描边手绘控件、1200ms boil 微动；标记黄高亮口诀；DrawablyPen 呈现数字与拉丁字；中文 Noto Sans SC。
STORY: 学生像在纸上做题：手绘选项块、选中被墨圈勾选、手写体分数、AI 批注如导师红笔——工具退后，练习在前。
FIRST VIEWPORT: 顶栏品牌名带手绘下划线，7 个 tab 如书签排布；做题首屏：纸质题干卡 + A–D 手绘描边选项块，hover 笔迹加深，选中即墨圈。
FORM: drawably 手绘控件语言（用户钉死 pinned；roll 免除，无 seed key；code-led 路径，本机无图像生成）。
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
