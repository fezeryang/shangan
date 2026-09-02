import type React from "react";
import { useState, useEffect, useRef } from "react";
import type { Question, StudyStats, UserAnswerRecord } from "../types";
import { allQuestions } from "../data/allQuestions";
import { QuestionCard } from "./QuestionCard";
import {
  Timer,
  CheckCircle2,
  Award,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  BookMarked,
  Clock,
} from "lucide-react";

interface ExamModeProps {
  onOpenAI: (
    tab: "explain" | "graphic" | "variant" | "chat",
    q?: Question,
  ) => void;
  onRecordAnswer: (record: UserAnswerRecord) => void;
  onAddMistake: (qId: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  notes: Record<string, string>;
  onSaveNote: (id: string, note: string) => void;
  stats: StudyStats;
  answerRecords: UserAnswerRecord[];
}

export const ExamMode: React.FC<ExamModeProps> = ({
  onOpenAI,
  onRecordAnswer,
  onAddMistake,
  favorites,
  onToggleFavorite,
  notes,
  onSaveNote,
  stats,
  answerRecords,
}) => {
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [examLength, setExamLength] = useState<number>(10);
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "verbal" | "data" | "graphic"
  >("all");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedQuestions, setMarkedQuestions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 min default
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>(
    {},
  );

  const timerRef = useRef<any>(null);
  // 计时器与作答状态用 ref 同步，避免倒计时到点触发时拿到旧闭包（真实用时不能丢）
  const answersRef = useRef(answers);
  const questionTimesRef = useRef(questionTimes);
  const totalTimeSpentRef = useRef(totalTimeSpent);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    questionTimesRef.current = questionTimes;
  }, [questionTimes]);

  useEffect(() => {
    totalTimeSpentRef.current = totalTimeSpent;
  }, [totalTimeSpent]);

  // Start Exam Setup
  const handleStartExam = () => {
    let pool = [...allQuestions];
    if (selectedCategory !== "all") {
      pool = pool.filter((q) => q.category === selectedCategory);
    }
    // Shuffle pool
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(examLength, shuffled.length));

    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers({});
    setMarkedQuestions([]);
    setQuestionTimes({});
    const allocatedTime = selected.length * 60; // 60s per question
    setTimeLeft(allocatedTime);
    setTotalTimeSpent(0);
    setExamStarted(true);
    setExamFinished(false);
  };

  // Timer Tick
  useEffect(() => {
    if (examStarted && !examFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
        setTotalTimeSpent((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [examStarted, examFinished]);

  // Finish Exam
  const handleFinishExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setExamFinished(true);

    const finalAnswers = answersRef.current;
    const finalQuestionTimes = questionTimesRef.current;

    // Record each answer into global stats
    questions.forEach((q) => {
      const userAns = finalAnswers[q.id];
      if (userAns) {
        const isCorrect = userAns === q.correctAnswer;
        onRecordAnswer({
          questionId: q.id,
          userAnswer: userAns,
          isCorrect,
          // 未逐题计时的题记 0，不冒充真实用时（学情看板均时只统计 >0 的作答）
          timeSpentSec: finalQuestionTimes[q.id] || 0,
          answeredAt: new Date().toISOString(),
        });
        if (!isCorrect) {
          onAddMistake(q.id);
        }
      }
    });
  };

  const currentQ = questions[currentIndex];

  // Calculate Exam Stats
  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctAnswer,
  ).length;
  const score =
    questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;

  // Format time
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Category breakdown for Score Report
  const categoryStats = ["verbal", "data", "graphic"].map((cat) => {
    const catQs = questions.filter((q) => q.category === cat);
    const catCorrect = catQs.filter(
      (q) => answers[q.id] === q.correctAnswer,
    ).length;
    const catName =
      cat === "verbal" ? "言语理解" : cat === "data" ? "资料分析" : "图形推理";
    return {
      category: catName,
      total: catQs.length,
      correct: catCorrect,
      accuracy:
        catQs.length > 0 ? Math.round((catCorrect / catQs.length) * 100) : 0,
    };
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 1. SETUP VIEW */}
      {!examStarted && (
        <div className="bg-[#fdfbf7] rounded-2xl p-6 sm:p-8 border border-[#e3d9c4] shadow-sm space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <div className="w-12 h-12 bg-[#fef7ea] text-[#b45309] rounded-2xl mx-auto flex items-center justify-center border border-[#ebdcb9] shadow-xs">
              <Timer className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#26201a]">
              全真限时模拟考场
            </h2>
            <p className="text-xs sm:text-sm text-[#786c5e]">
              严格按照真实上岸测评考试时间与难度出题，独立完成所有作答，交卷后即出成绩报告与详细题解。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {/* Exam Length */}
            <div className="p-4 bg-[#f8f3e8] rounded-xl border border-[#e3d8c2] space-y-2">
              <label className="block text-xs font-semibold text-[#4a3e31]">
                题量选择：
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((len) => (
                  <button
                    key={len}
                    onClick={() => setExamLength(len)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      examLength === len
                        ? "bg-[#b45309] text-white shadow-xs"
                        : "bg-[#fffdfa] border border-[#ded3be] text-[#4a3e31] hover:bg-[#f3ead7]"
                    }`}
                  >
                    {len} 题 ({len}分钟)
                  </button>
                ))}
              </div>
            </div>

            {/* Category Range */}
            <div className="p-4 bg-[#f8f3e8] rounded-xl border border-[#e3d8c2] space-y-2">
              <label className="block text-xs font-semibold text-[#4a3e31]">
                科目范围：
              </label>
              <select
                value={selectedCategory}
                onChange={(e: any) => setSelectedCategory(e.target.value)}
                className="w-full p-2 bg-[#fffdfa] border border-[#ded3be] rounded-lg text-xs font-medium text-[#26201a]"
              >
                <option value="all">全科综合模拟 (言语+资料+图推)</option>
                <option value="graphic">专项模考：图形推理空间思维</option>
                <option value="data">专项模考：资料分析与速算</option>
                <option value="verbal">专项模考：言语理解与推理</option>
              </select>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleStartExam}
              className="px-8 py-3.5 bg-gradient-to-r from-[#b45309] to-[#c2410c] hover:from-[#9a3412] hover:to-[#a13208] text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
            >
              <Timer className="w-5 h-5" />
              <span>进入考场并开始倒计时</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. RUNNING EXAM VIEW */}
      {examStarted && !examFinished && currentQ && (
        <div className="space-y-4">
          {/* Exam Status Bar */}
          <div className="bg-[#2c241d] text-[#faf6ee] rounded-xl px-4 py-3 flex items-center justify-between shadow-md border border-[#4a3e31]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#b45309]/30 text-[#fed7aa] border border-[#b45309]/40">
                考试进行中
              </span>
              <span className="text-xs text-[#ded3be]">
                进度: <strong>{currentIndex + 1}</strong> / {questions.length}{" "}
                (已答 {answeredCount} 题)
              </span>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2">
              <Clock
                className={`w-4 h-4 ${timeLeft < 120 ? "text-[#f87171] animate-pulse" : "text-[#fbbf24]"}`}
              />
              <span
                className={`font-mono text-base font-bold ${timeLeft < 120 ? "text-[#f87171] animate-pulse" : "text-[#fef08a]"}`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `确定要交卷吗？还有 ${questions.length - answeredCount} 道题未作答。`,
                  )
                ) {
                  handleFinishExam();
                }
              }}
              className="px-3.5 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              提交试卷
            </button>
          </div>

          {/* Quick Question Number Matrix */}
          <div className="bg-[#fdfbf7] p-3 rounded-xl border border-[#e3d9c4] flex flex-wrap gap-1.5 items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {questions.map((q, i) => {
                const isCurrent = currentIndex === i;
                const isAnswered = !!answers[q.id];
                const isMarked = markedQuestions.includes(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
                      isCurrent
                        ? "bg-[#b45309] text-white ring-2 ring-[#b45309]/40"
                        : isAnswered
                          ? "bg-[#fef7ea] text-[#854d0e] border border-[#ebdcb9]"
                          : "bg-[#f5ede0] text-[#5c4e3f] hover:bg-[#ede1ce]"
                    }`}
                  >
                    {i + 1}
                    {isMarked && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#c2410c] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setMarkedQuestions((prev) =>
                  prev.includes(currentQ.id)
                    ? prev.filter((id) => id !== currentQ.id)
                    : [...prev, currentQ.id],
                );
              }}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                markedQuestions.includes(currentQ.id)
                  ? "bg-[#fef7ea] text-[#b45309] border-[#e8ce8a] font-bold"
                  : "bg-[#f8f3e8] text-[#6e6153] border-[#ded3be] hover:bg-[#f3ead7]"
              }`}
            >
              {markedQuestions.includes(currentQ.id)
                ? "★ 已标记存疑"
                : "☆ 标记存疑"}
            </button>
          </div>

          {/* Current Question Card (in exam, selecting is draft, no answers shown until test finished) */}
          <QuestionCard
            question={currentQ}
            selectedOption={answers[currentQ.id]}
            onSelectOption={(key, timeSpentSec) => {
              setAnswers((prev) => ({ ...prev, [currentQ.id]: key }));
              if (timeSpentSec) {
                setQuestionTimes((prev) => ({
                  ...prev,
                  [currentQ.id]: timeSpentSec,
                }));
              }
            }}
            isAnswered={false}
            onOpenAI={(tab) => onOpenAI(tab, currentQ)}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favorites.includes(currentQ.id)}
            userNote={notes[currentQ.id]}
            onSaveNote={onSaveNote}
            instantSubmitMode={true}
            questionIndex={currentIndex}
            totalQuestions={questions.length}
            stats={stats}
            answerRecords={answerRecords}
          />

          {/* Bottom Nav Prev / Next */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-[#fdfbf7] border border-[#e3d9c4] rounded-xl text-xs font-semibold text-[#4a3e31] hover:bg-[#f6eee0] disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>上一题</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
                }
                className="px-5 py-2 bg-[#b45309] hover:bg-[#9a3412] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>下一题</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishExam}
                className="px-5 py-2 bg-[#15803d] hover:bg-[#166534] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>完成答题并交卷</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. EXAM SCORE REPORT & REVIEW */}
      {examFinished && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Report Card */}
          <div className="bg-[#fdfbf7] rounded-2xl p-6 sm:p-8 border border-[#e3d9c4] shadow-md">
            <div className="text-center pb-6 border-b border-[#e8ded0]">
              <div className="inline-flex p-3 rounded-full bg-[#edf7ee] text-[#15803d] mb-2 border border-[#86efac]">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#26201a] font-display">
                模考成绩评估报告
              </h2>
              <p className="text-xs text-[#786c5e] mt-1">
                耗时 {Math.floor(totalTimeSpent / 60)} 分 {totalTimeSpent % 60}{" "}
                秒 · 共 {questions.length} 题
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 text-center">
              <div className="p-4 bg-[#fcf8ee] rounded-xl border border-[#ebdcb9]">
                <span className="text-xs text-[#786c5e] font-medium">
                  总得分
                </span>
                <div className="text-3xl font-extrabold text-[#b45309] mt-1 font-display">
                  {score}
                </div>
                <span className="text-[10px] text-[#854d0e] font-medium">
                  满分 100 分
                </span>
              </div>

              <div className="p-4 bg-[#edf7ee] rounded-xl border border-[#bbf7d0]">
                <span className="text-xs text-[#786c5e] font-medium">
                  答对题数
                </span>
                <div className="text-3xl font-extrabold text-[#15803d] mt-1 font-display">
                  {correctCount} / {questions.length}
                </div>
                <span className="text-[10px] text-[#166534] font-medium">
                  正确率 {score}%
                </span>
              </div>

              <div className="p-4 bg-[#fef2f2] rounded-xl border border-[#fecaca]">
                <span className="text-xs text-[#786c5e] font-medium">
                  错题数
                </span>
                <div className="text-3xl font-extrabold text-[#b91c1c] mt-1 font-display">
                  {questions.length - correctCount}
                </div>
                <span className="text-[10px] text-[#991b1b] font-medium">
                  已自动归档入错题本
                </span>
              </div>

              <div className="p-4 bg-[#f8f3e8] rounded-xl border border-[#ded3bd]">
                <span className="text-xs text-[#786c5e] font-medium">
                  平均用时
                </span>
                <div className="text-3xl font-extrabold text-[#5c4e3f] mt-1 font-display">
                  {Math.round(totalTimeSpent / (questions.length || 1))}s
                </div>
                <span className="text-[10px] text-[#786c5e] font-medium">
                  每题推荐 ≤ 50s
                </span>
              </div>
            </div>

            {/* Category Performance Bar */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-[#26201a]">
                各模块得分率透析：
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {categoryStats.map((cs) => (
                  <div
                    key={cs.category}
                    className="p-3 bg-[#f8f3e8] rounded-xl border border-[#e3d8c2]"
                  >
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>{cs.category}</span>
                      <span className="text-[#b45309]">
                        {cs.correct}/{cs.total} ({cs.accuracy}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#ded3be] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#b45309] h-full rounded-full transition-all"
                        style={{ width: `${cs.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-[#e8ded0] flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setExamStarted(false)}
                className="px-6 py-2.5 bg-[#b45309] hover:bg-[#9a3412] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>开启下一轮模考</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#26201a] text-base flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-[#b45309]" />
              <span>全卷题目逐题复盘与题解</span>
            </h3>

            {questions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                selectedOption={answers[q.id]}
                onSelectOption={() => {}}
                isAnswered={true}
                onOpenAI={(tab) => onOpenAI(tab, q)}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.includes(q.id)}
                userNote={notes[q.id]}
                onSaveNote={onSaveNote}
                showExplanationDirectly={true}
                questionIndex={idx}
                totalQuestions={questions.length}
                stats={stats}
                answerRecords={answerRecords}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
