/* Computed-style assertions for MarkdownRenderer, built with the app's real vite+tailwind v4 toolchain.
 *
 * Usage:
 *   cd shangan/scripts/__render && npx vite build && npx vite preview --port 4178 &
 *   PLAYWRIGHT_IMPORT=<path-to-playwright/index.mjs> node assert.mjs
 */
const playwrightPath =
  process.env.PLAYWRIGHT_IMPORT ||
  "/home/fezer/projects/the_card/node_modules/playwright/index.mjs";
const { chromium } = await import(playwrightPath);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 760, height: 1200 } });
await page.goto("http://localhost:4178/");
await page.waitForTimeout(1500);

const results = await page.evaluate(() => {
  const out = [];
  const assert = (name, ok, detail) =>
    out.push(`${ok ? "PASS" : "FAIL"} ${name}${ok ? "" : " — " + detail}`);

  // 1. Structure: no nested <pre> (react-markdown v10 fix), coffee-dark code block
  const pres = document.querySelectorAll("pre");
  assert(
    "no nested <pre>",
    document.querySelectorAll("pre pre").length === 0,
    "pre>pre found",
  );
  assert(
    "code block coffee bg #2c241d",
    pres[0] && getComputedStyle(pres[0]).backgroundColor === "rgb(44, 36, 29)",
    pres[0] ? getComputedStyle(pres[0]).backgroundColor : "no pre",
  );

  // 2. Body typography (desktop)
  const body = document.querySelector('[data-case="cot"] .markdown-body');
  const bs2 = body ? getComputedStyle(body) : null;
  assert(
    "body 15px on sm+",
    bs2 && bs2.fontSize === "15px",
    bs2 && bs2.fontSize,
  );
  assert(
    "leading-relaxed 1.625",
    bs2 && parseFloat(bs2.lineHeight) / parseFloat(bs2.fontSize) > 1.55,
    bs2 && bs2.lineHeight,
  );
  assert(
    "warm ink #3b3227",
    bs2 && bs2.color === "rgb(59, 50, 39)",
    bs2 && bs2.color,
  );

  // 3. Ordered-list marker amber (hero hierarchy)
  const li = document.querySelector('[data-case="cot"] ol > li');
  const marker = li ? getComputedStyle(li, "::marker").color : null;
  assert(
    "ol marker amber #b45309",
    marker === "rgb(180, 83, 9)",
    String(marker),
  );

  // 4. strong: bold ink + visible highlighter wash on cream panel
  const strong = document.querySelector('[data-case="cot"] strong');
  const ss = strong ? getComputedStyle(strong) : null;
  assert(
    "strong bold ink #26201a",
    ss && ss.fontWeight === "700" && ss.color === "rgb(38, 32, 26)",
    ss ? `${ss.fontWeight} ${ss.color}` : "no strong",
  );
  const nums = (ss ? ss.backgroundColor.match(/[\d.]+/g) : null) || [];
  const [r = 0, g = 0, b = 0, a = 1] = nums.map(Number);
  // blend the alpha over the #f8f3e8 panel the way the browser paints it
  const br = a * r + (1 - a) * 248;
  const bg2 = a * g + (1 - a) * 243;
  const bb = a * b + (1 - a) * 232;
  const delta = Math.abs(br - 248) + Math.abs(bg2 - 243) + Math.abs(bb - 232);
  assert(
    "strong wash visible on #f8f3e8 (Δ 40–120)",
    delta > 40 && delta < 120,
    `blended Δ=${delta.toFixed(0)}`,
  );

  // 5. em: upright for CJK, warm tone
  const em = document.querySelector('[data-case="cot"] em');
  const es = em ? getComputedStyle(em) : null;
  assert(
    "em not italic + #92400e",
    es && es.fontStyle === "normal" && es.color === "rgb(146, 64, 14)",
    es ? `${es.fontStyle} ${es.color}` : "no em",
  );

  // 6. Table vocabulary matches app tables (#f6efe2 header / white / #ded3bd border)
  const th = document.querySelector('[data-case="cot"] th');
  assert(
    "th parchment #f6efe2",
    th && getComputedStyle(th).backgroundColor === "rgb(246, 239, 226)",
    th ? getComputedStyle(th).backgroundColor : "no th",
  );

  // 7. blockquote: parchment card, no >1px colored left border (craft-floor)
  const bq = document.querySelector('[data-case="cot"] blockquote');
  const qs = bq ? getComputedStyle(bq) : null;
  assert(
    "blockquote parchment #faf1da",
    qs && qs.backgroundColor === "rgb(250, 241, 218)",
    qs ? qs.backgroundColor : "no bq",
  );
  assert(
    "blockquote no thick colored left border",
    qs && parseFloat(qs.borderLeftWidth) <= 1,
    qs ? `${qs.borderLeftWidth} ${qs.borderLeftColor}` : "no bq",
  );

  // 8. h2 amber tick pseudo
  const h2 = document.querySelector('[data-case="pattern"] h2');
  const h2b = h2 ? getComputedStyle(h2, "::before") : null;
  assert(
    "h2 amber tick",
    h2b &&
      h2b.backgroundColor === "rgba(180, 83, 9, 0.8)" &&
      h2b.width === "3px",
    h2b ? `${h2b.width} ${h2b.backgroundColor}` : "no h2",
  );

  // 9. heading rhythm: more space above than below (craft-floor)
  if (h2) {
    const h2s = getComputedStyle(h2);
    assert(
      "h2 mt > mb",
      parseFloat(h2s.marginTop) > parseFloat(h2s.marginBottom),
      `${h2s.marginTop} vs ${h2s.marginBottom}`,
    );
  }

  // 10. inline code warm pill
  const ic = document.querySelector('[data-case="cot"] li code');
  const ics = ic ? getComputedStyle(ic) : null;
  assert(
    "inline code pill #f0e4c8",
    ics && ics.backgroundColor === "rgb(240, 228, 200)",
    ics ? ics.backgroundColor : "no inline code",
  );

  // 11. chat bubble: first-child no stray top margin
  const chatFirst = document.querySelector(
    '[data-case="chat"] .markdown-body > *',
  );
  assert(
    "chat first-child mt-0",
    chatFirst && getComputedStyle(chatFirst).marginTop === "0px",
    chatFirst ? getComputedStyle(chatFirst).marginTop : "empty",
  );

  // 12. heading scale steps distinguishable (size+weight+tone)
  const h1 = document.querySelector('[data-case="pattern"] h1');
  const h3 = document.querySelector('[data-case="pattern"] h3');
  if (h1 && h2 && h3) {
    const s1 = parseFloat(getComputedStyle(h1).fontSize);
    const s2 = parseFloat(getComputedStyle(h2).fontSize);
    const s3 = parseFloat(getComputedStyle(h3).fontSize);
    assert(
      "heading ramp 16/17/16-base steps",
      s1 > s2 && s2 >= s3,
      `${s1}/${s2}/${s3}`,
    );
  }

  // 13. no horizontal overflow anywhere (CJK break-words + scroll containers)
  const overflow = [
    ...document.querySelectorAll(".markdown-body, [data-case]"),
  ].filter((el) => el.scrollWidth > el.clientWidth + 1);
  assert(
    "no horizontal overflow",
    overflow.length === 0,
    overflow.map((e) => e.className).join(","),
  );

  return out;
});

console.log("--- desktop 760px ---");
console.log(results.join("\n"));
let failed = results.some((r) => r.startsWith("FAIL"));

// Mobile round: 375px chat bubble + CoT panel
const mobile = await browser.newPage({ viewport: { width: 375, height: 900 } });
await mobile.goto("http://localhost:4178/");
await mobile.waitForTimeout(1200);
const mres = await mobile.evaluate(() => {
  const out = [];
  const assert = (name, ok, detail) =>
    out.push(`${ok ? "PASS" : "FAIL"} ${name}${ok ? "" : " — " + detail}`);
  const body = document.querySelector('[data-case="cot"] .markdown-body');
  const st = body ? getComputedStyle(body) : null;
  assert("mobile body 13px", st && st.fontSize === "13px", st && st.fontSize);
  const chat = document.querySelector('[data-case="chat"]');
  assert(
    "mobile chat bubble no overflow",
    chat && chat.scrollWidth <= chat.clientWidth + 1,
    chat ? `${chat.scrollWidth} vs ${chat.clientWidth}` : "no chat",
  );
  const tblWrap = document.querySelector('[data-case="cot"] .overflow-x-auto');
  assert(
    "table wrapper scrolls internally",
    tblWrap && tblWrap.scrollWidth >= tblWrap.clientWidth,
    "no wrapper",
  );
  return out;
});
console.log("--- mobile 375px ---");
console.log(mres.join("\n"));
failed = failed || mres.some((r) => r.startsWith("FAIL"));

await page.screenshot({ path: "shot-desktop.png", fullPage: true });
await mobile.screenshot({ path: "shot-mobile.png", fullPage: true });
await browser.close();
process.exit(failed ? 1 : 0);
