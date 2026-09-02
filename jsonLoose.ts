// 宽松 JSON 解析（模型输出专用）。
// JSON.parse 失败时先做一轮本地机器修复，再失败才由上层（server.ts generateJsonSafely）
// 走模型修复重试。修复针对实测的 LLM 输出缺陷类：
//   1. 字符串值内部未转义的双引号（glm 系即便 json_object 模式也常见，
//      报错签名即 "Expected ',' or '}' after property value at position N"）
//   2. 全角结构符（，：｝］“”）被当作分隔符/定界符
//   3. 尾逗号
// 修复只应发生在「严格解析已失败」的文本上，正常输出零成本通过。

/** 单趟扫描修复：结构符归一化 + 字符串内未转义引号转义 + 尾逗号剔除。 */
export function repairModelJson(text: string): string {
  let out = "";
  let inString = false;
  // 字符串终止判定：其后第一个非空白字符必须是结构符或结尾，
  // 否则视为字符串内部的字面引号（这是未转义引号修复的核心启发式）
  const TERMINATORS = ",:}]，：｝］";

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (!inString) {
      if (ch === '"') {
        inString = true;
        out += ch;
      } else if (ch === "“" || ch === "”" || ch === "‘" || ch === "’") {
        // 全角引号作字符串定界符 → 归一化为 "
        inString = true;
        out += '"';
      } else if (ch === "，" || ch === ",") {
        // 逗号（含全角）：后面第一个非空白是 } 或 ] 则视为尾逗号丢弃
        let j = i + 1;
        while (j < text.length && /\s/.test(text[j])) j++;
        if (text[j] !== "}" && text[j] !== "]") out += ",";
      } else if (ch === "：") {
        out += ":";
      } else if (ch === "｝") {
        out += "}";
      } else if (ch === "］") {
        out += "]";
      } else {
        out += ch;
      }
      continue;
    }
    if (ch === "\\") {
      out += ch + (text[i + 1] ?? "");
      i++;
      continue;
    }
    if (ch === '"' || ch === "”" || ch === "’") {
      // ASCII " 或全角闭引号：后看第一个非空白字符，
      // 是结构符/结尾 → 归一为 " 闭合字符串；否则视为字符串内字面引号保留
      // （中文正文里合法的“”/’ 不会被破坏：后面跟的不是结构符）
      let j = i + 1;
      while (j < text.length && /\s/.test(text[j])) j++;
      const next = text[j];
      if (next === undefined || TERMINATORS.includes(next)) {
        inString = false;
        out += '"';
      } else {
        out += ch === '"' ? '\\"' : ch;
      }
      continue;
    }
    out += ch;
  }
  // 截断在字符串中间：补闭合引号，让 JSON 可解析；
  // 字段残缺由路由层的契约校验（选项数/correctAnswer/chart）拒绝，不会流入前端
  if (inString) out += '"';
  return out;
}

/** Tolerant JSON parsing: strips markdown code fences & extracts the outer object,
 *  then machine-repairs common LLM syntax defects before giving up. */
export function parseJsonLoose(text: string): any {
  let cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.slice(start, end + 1);
  }
  try {
    return JSON.parse(cleaned);
  } catch (originalError) {
    try {
      return JSON.parse(repairModelJson(cleaned));
    } catch {
      throw new Error(
        `JSON 解析失败: ${originalError instanceof Error ? originalError.message : originalError}`,
      );
    }
  }
}
