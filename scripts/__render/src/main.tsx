import { createRoot } from 'react-dom/client';
import { MarkdownRenderer } from '../../../src/components/MarkdownRenderer';
import '../../../src/index.css';

/* 模拟 AI 真实输出形态（prompts.ts 规定的「有序列表 + 加粗 emoji 小标题」结构） */
const cotContent = `1. 🎯 **考点透析与破题眼**：本题考查**增长率比较**中的"间隔增长率"模型，切入点是识别题干中"2023年比2021年"的跨期表述。

2. 💡 **思维链完整推导 (Step-by-Step CoT)**：
   - 第一步：识别跨期 → 间隔 r = r₁ + r₂ + r₁×r₂
   - 第二步：代入 \`r₁=8%\`、\`r₂=12.5%\`，得 \`8% + 12.5% + 1%\`
   - 第三步：截位直除秒算 → **答案为 C（21.5%）**

3. ❌ **易错选项排雷**：
   | 选项 | 陷阱类型 | 排除理由 |
   |---|---|---|
   | A | 计算陷阱 | 直接相加忽略了交叉项 r₁×r₂ |
   | B | 单位看错 | 把百分点当成百分数 |

4. 🚀 **秒杀口诀**：*跨期别慌张，加乘一起上*。

> 提示：遇到"隔一年"表述时，优先检查交叉项，这是命题人最爱的陷阱。

5. 📝 **举一反三变式思考**：若题干改为"月产量环比连续两月增长"，同样套用间隔模型。

\`\`\`
间隔增长率 = r1 + r2 + r1 × r2
\`\`\`

以下情况~~不需要~~可以近似忽略交叉项：当 r₁、r₂ 均小于 5% 时。详见[速算手册](https://example.com)。`;

const chatContent = `好问题！B 选项错在**偷换概念**：题干说的是"利润率"，B 说的是"利润"。

- 利润率 = 利润 ÷ 收入
- 利润 = 收入 − 成本

所以即使利润上升，利润率也可能下降。还有什么疑问吗？`;

const headingsContent = `# 一级标题：资料分析速算体系

## 二级标题：截位直除法

### 三级标题：三位数除法

#### 四级标题：误差控制

正文一段：验证标题阶梯与间距节奏——标题上方留白应大于下方留白，各级标题靠字号、字重与色调三轴区分。
`;

function App() {
  return (
    <div
      style={{
        maxWidth: 700,
        margin: '0 auto',
        display: 'grid',
        gap: 24,
        background: '#fdfbf7',
        padding: 20,
      }}
    >
      <section>
        <div className="text-xs font-bold text-[#854d0e] mb-2">面板 A：bg-[#f8f3e8]（CoT 拆解）</div>
        <div className="bg-[#f8f3e8] p-4 rounded-xl border border-[#e3d8c2]" data-case="cot">
          <MarkdownRenderer content={cotContent} />
        </div>
      </section>

      <section>
        <div className="text-xs font-bold text-[#854d0e] mb-2">面板 B：bg-[#fff8eb]（PatternLab 透析）</div>
        <div className="bg-[#fff8eb] p-4 rounded-xl border border-[#ebdcb9]" data-case="pattern">
          <MarkdownRenderer content={headingsContent} />
        </div>
      </section>

      <section>
        <div className="text-xs font-bold text-[#854d0e] mb-2">面板 C：聊天气泡（自由追问）</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 9999,
              background: '#b45309',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              flexShrink: 0,
            }}
          >
            AI
          </div>
          <div
            className="bg-[#f8f3e8] text-[#26201a] border border-[#e3d8c2] rounded-2xl px-4 py-2.5 text-xs sm:text-sm"
            style={{ maxWidth: '85%' }}
            data-case="chat"
          >
            <MarkdownRenderer content={chatContent} />
          </div>
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
