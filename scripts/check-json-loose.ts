// jsonLoose 回归断言：严格 JSON 直通；实测 LLM 缺陷类（未转义引号/全角结构符/尾逗号）
// 机器修复后可解析；真截断仍应抛错，交给上层模型修复链路。
import assert from "node:assert/strict";
import { parseJsonLoose, repairModelJson } from "../jsonLoose";

// 1. 正常 JSON 与既有宽松行为（围栏/散文包裹）零改动
assert.deepEqual(parseJsonLoose('{"a":1}'), { a: 1 });
assert.deepEqual(parseJsonLoose('```json\n{"a":1}\n```'), { a: 1 });
assert.deepEqual(parseJsonLoose('好的，结果如下：{"a":1} 以上'), { a: 1 });

// 2. 位置 23 类缺陷：字符串内未转义双引号
const unescaped = '{"stem": "本题考查"增长率"的计算", "category": "data"}';
assert.equal(parseJsonLoose(unescaped).stem, '本题考查"增长率"的计算');

// 3. 已合法转义的引号不被二次破坏
assert.deepEqual(parseJsonLoose('{"a":"say \\"hi\\""}'), { a: 'say "hi"' });

// 4. 全角结构符
assert.deepEqual(parseJsonLoose('{"a"："x"，"b"：1}'), { a: "x", b: 1 });
assert.deepEqual(parseJsonLoose("{“a”: “x”}"), { a: "x" });

// 5. 尾逗号
assert.deepEqual(parseJsonLoose('{"a":[1,2,],}'), { a: [1, 2] });

// 6. 空串/空值边界：紧跟 } 的合法空串仍正确终止
assert.deepEqual(parseJsonLoose('{"a":""}'), { a: "" });

// 7. 真截断（无闭合）：修复后仍不可解析 → 抛错，走上层模型修复
assert.throws(() => parseJsonLoose('{"a": "unclosed'));

// 8. repairModelJson 可单独复用
assert.equal(repairModelJson('{"a": "x"，}'), '{"a": "x"}');

console.log("check-json-loose: all assertions passed");
