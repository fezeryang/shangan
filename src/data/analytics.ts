import type { AnswerAttempt, Question, UserAnswerRecord } from "../types";
import { allQuestions } from "./allQuestions";

export type QuestionIndex = Map<string, Question>;

export function buildQuestionIndex(
  bank: Question[] = allQuestions,
): QuestionIndex {
  return new Map(bank.map((q) => [q.id, q]));
}

export interface SubCategoryStat {
  sub: string;
  bankTotal: number;
  total: number;
  correct: number;
  acc: number;
  /** 仅统计有计时（timeSpentSec > 0）的作答；模考未逐题计时记 0，不冒充真实用时 */
  avgSec: number;
}

/** 三板块通用的分考点统计：题库全量考点 × 每题最新一次作答（点击行跳专项练习） */
export function subCategoryStats(
  category: Question["category"],
  records: UserAnswerRecord[],
  index: QuestionIndex,
): SubCategoryStat[] {
  const bySub = new Map<string, { bank: number; recs: UserAnswerRecord[] }>();
  for (const q of index.values()) {
    if (q.category !== category) continue;
    const bucket = bySub.get(q.subCategory) || { bank: 0, recs: [] };
    bucket.bank += 1;
    bySub.set(q.subCategory, bucket);
  }
  for (const r of records) {
    const q = index.get(r.questionId);
    if (q && q.category === category) bySub.get(q.subCategory)?.recs.push(r);
  }
  return Array.from(bySub.entries())
    .map(([sub, { bank, recs }]) => {
      const correct = recs.filter((r) => r.isCorrect).length;
      const timed = recs.filter((r) => r.timeSpentSec > 0);
      return {
        sub,
        bankTotal: bank,
        total: recs.length,
        correct,
        acc: recs.length > 0 ? Math.round((correct / recs.length) * 100) : 0,
        avgSec:
          timed.length > 0
            ? Math.round(
                timed.reduce((s, r) => s + r.timeSpentSec, 0) / timed.length,
              )
            : 0,
      };
    })
    .sort((a, b) => b.bankTotal - a.bankTotal);
}

/** 全量 attempts → 每题最新一次作答（新→旧）。全站统计口径的统一入口 */
export function latestRecords(attempts: AnswerAttempt[]): UserAnswerRecord[] {
  const latest = new Map<string, UserAnswerRecord>();
  for (const a of attempts) latest.set(a.questionId, a);
  return Array.from(latest.values()).sort((x, y) =>
    x.answeredAt < y.answeredAt ? 1 : -1,
  );
}

export interface TrendWindow {
  count: number;
  correct: number;
  acc: number;
}

/** 近 N 天 vs 之前的真实趋势（attempts 驱动）；窗口内无作答返回 null */
export function recentTrend(
  attempts: AnswerAttempt[],
  days = 7,
  now = Date.now(),
): { recent: TrendWindow | null; before: TrendWindow | null } {
  const cutoff = now - days * 86400000;
  const win = (list: AnswerAttempt[]): TrendWindow | null => {
    if (list.length === 0) return null;
    const correct = list.filter((a) => a.isCorrect).length;
    return {
      count: list.length,
      correct,
      acc: Math.round((correct / list.length) * 100),
    };
  };
  const t = (a: AnswerAttempt) => new Date(a.answeredAt).getTime();
  return {
    recent: win(attempts.filter((a) => t(a) >= cutoff)),
    before: win(attempts.filter((a) => t(a) < cutoff)),
  };
}

export interface RhythmHourStat {
  hour: number;
  total: number;
  acc: number;
}

export interface RhythmWeekdayStat {
  day: number; // 0=周日 … 6=周六
  total: number;
}

/** 学习节律（全量 attempts）：24 小时作答分布 + 星期分布；无效时间戳跳过 */
export function studyRhythm(attempts: AnswerAttempt[]): {
  hours: RhythmHourStat[];
  weekdays: RhythmWeekdayStat[];
} {
  const hourMap = new Map<number, { total: number; correct: number }>();
  const dayMap = new Map<number, number>();
  for (const a of attempts) {
    try {
      const dt = new Date(a.answeredAt);
      if (Number.isNaN(dt.getTime())) continue;
      const h = dt.getHours();
      const bucket = hourMap.get(h) || { total: 0, correct: 0 };
      bucket.total += 1;
      if (a.isCorrect) bucket.correct += 1;
      hourMap.set(h, bucket);
      dayMap.set(dt.getDay(), (dayMap.get(dt.getDay()) || 0) + 1);
    } catch {
      // 无效时间戳跳过
    }
  }
  return {
    hours: Array.from(hourMap.entries())
      .sort(([x], [y]) => x - y)
      .map(([hour, b]) => ({
        hour,
        total: b.total,
        acc: Math.round((b.correct / b.total) * 100),
      })),
    weekdays: Array.from(dayMap.entries())
      .sort(([x], [y]) => x - y)
      .map(([day, total]) => ({ day, total })),
  };
}
