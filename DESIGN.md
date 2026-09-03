# 上岸测评设计系统

## 方向：上岸手账

面向求职学生的备考工具。界面像一本持续被填写的练习手账：暖纸、琥珀墨、标记笔与轻微活笔迹。视觉必须服务于快速做题、模考和复盘，不能牺牲扫描效率。

## 视觉基础

| Token | Value | 用途 |
| --- | --- | --- |
| `--paper` | `#f8f3e7` | 页面暖纸底 |
| `--card` | `#fdfaf2` | 纸卡与控件底色 |
| `--ink` | `#33291d` | 主文字 |
| `--ink-soft` | `#6f5f4b` | 次级文字 |
| `--ink-accent` | `#9a4a12` | 手绘描边、强调 |
| `--ink-accent-strong` | `#7c3a0c` | 实心主按钮 |
| `--marker` | `#f6d76b` | 标记笔高亮 |
| `--line` | `#e2d5ba` | 纸面分隔线 |
| `--drawably-error` | `#bf4236` | 错误/危险红墨 |
| `--drawably-success` | `#3c7a37` | 正确绿墨 |

正文使用 `Noto Sans SC` 字体栈；关键数字、分数、进度和短标题使用 `font-display`（Drawably Pen）。

## 控件语言

- 使用 `drawably/react` 的 `DrawablyButton`、`DrawablyInput`、`DrawablySelect`、`DrawablyTextarea`；不要用普通圆角 SaaS 按钮替代。
- 默认操作为 `outline`；当前选项或当前模式为 `scribble`；唯一主操作为 `solid`。
- `tone="neutral"` 用于返回、取消、重置当前步骤；`tone="danger"` 只用于删除、清空、不可逆重置。
- 涂鸦 hatch 全局透明度为 18%，内容层位于笔迹之上，确保中文标签可读。
- 高密度单元（题号矩阵、图表、热力格、标注计数色块）保留紧凑原生交互，不为手绘而制造噪声。

## 状态语义

- 题目未答：墨线描边。
- 当前选择：涂鸦填充。
- 批改正确：绿墨 `success`。
- 批改错误：红墨 `error`。
- 其余选项：降低透明度，但仍可辨识。
- 禁用态必须保留原生 `disabled`，不可只靠颜色表达。

## 页面结构

- 顶栏：品牌与活动页签使用手绘下划线；统计数字用展示字体。
- 练习/模考：题目优先，筛选与导航退居其次；模考状态栏可作为唯一深墨色严肃区。
- 公式宝典：速算输入手绘化；“秒杀口诀”使用 `drawablyHighlight` 标记笔高亮。
- 图推实验室：模式、规律和步进控制使用统一涂鸦选中态；题面与 SVG 保持白纸高对比。
- 学情看板：只手绘操作与模式切换，图表本身保持清晰、克制。
- 弹窗：暖纸面板 + 深色遮罩；主要动作手绘实心，关闭图标保持轻量。
- 页脚：虚线纸张分隔，作为手账落款，不做营销型大页脚。

## 动效与无障碍

- Drawably boil 只用于控件笔迹；遵循 `prefers-reduced-motion`。
- 禁止 bounce/elastic 动效；进入状态使用短促淡入。
- 保留真实 `button`、`input`、`select` 与表单语义；弹窗使用 `role="dialog"` 和 `aria-modal`。
- 键盘焦点为 2px 琥珀墨 outline；正文与实心按钮文字满足可读对比度。
- 390px 页面不得出现横向溢出；横向标签栏可自身滚动并隐藏滚动条。

## 来源

手绘机制与控件语言来自 `drawably@0.3.10`（项目研究副本：`/tmp/drawably`）。产品定位与约束见 `PRODUCT.md`；界面方向契约见 `.impeccable/surfaces/src-app-tsx.md`。
