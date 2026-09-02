// AI 生成 SVG 的服务端兜底清洗。
// 提示词里的安全约束不是信任边界：前端会用 dangerouslySetInnerHTML 直接注入返回的 svg 字符串，
// 因此任何进入响应的 svg 都必须先经过这里的过滤（对应审计 P0-3）。

// 可被用于加载外部资源/执行脚本/暗藏 DOM 的元素，全部移除
const BLOCKED_TAGS = [
  "script",
  "foreignobject",
  "iframe",
  "embed",
  "object",
  "handler",
  "image",
  "use",
  "animate",
  "animatetransform",
  "animatemotion",
  "set",
];

export function sanitizeSvg(svg: string): string {
  let out = svg;
  for (const tag of BLOCKED_TAGS) {
    const paired = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}\\s*>`, "gi");
    const lone = new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi");
    out = out.replace(paired, "").replace(lone, "");
  }
  // 事件属性：on*="..." / on*='...' / on*=bare
  out = out.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  // 链接属性：只允许 #fragment 引用，外链与 data: 一律移除
  out = out.replace(/\s(?:xlink:href|href)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi, (m, dq, sq) => {
    const v = String(dq ?? sq ?? "").trim();
    return v.startsWith("#") ? m : "";
  });
  // style 属性中的 javascript: / expression()
  out = out.replace(/\sstyle\s*=\s*(?:"[^"]*"|'[^']*')/gi, (m) =>
    /javascript:|expression\s*\(/i.test(m) ? "" : m
  );
  return out;
}

/** 就地清洗变式题 JSON 中的所有 svg 字段（stemFigures / options） */
export function sanitizeVariantSvgs(parsed: any): void {
  if (Array.isArray(parsed?.stemFigures)) {
    for (const f of parsed.stemFigures) {
      if (typeof f?.svg === "string") f.svg = sanitizeSvg(f.svg);
    }
  }
  if (Array.isArray(parsed?.options)) {
    for (const o of parsed.options) {
      if (typeof o?.svg === "string") o.svg = sanitizeSvg(o.svg);
    }
  }
}
