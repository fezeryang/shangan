import React, { useState, useMemo } from "react";
import type { Question, StudyStats, UserAnswerRecord } from "../types";
import { allQuestions, categoryMeta } from "../data/allQuestions";
import { QuestionCard } from "./QuestionCard";
import {
  BookOpen,
  Search,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Shapes,
  BarChart3,
  SlidersHorizontal,
} from "lucide-react";
import { DrawablyButton, DrawablyInput, DrawablySelect } from "drawably/react";

interface PracticeModeProps {
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
  answeredMap: Record<string, string>;
  onResetAnswer?: (qId: string) => void;
  initialCategory?: "all" | "verbal" | "data" | "graphic";
  initialSubCategory?: string;
  stats: StudyStats;
  answerRecords: UserAnswerRecord[];
  onNavigateToSubCategory?: (category: string, subCategory: string) => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  onOpenAI,
  onRecordAnswer,
  onAddMistake,
  favorites,
  onToggleFavorite,
  notes,
  onSaveNote,
  answeredMap,
  onResetAnswer,
  initialCategory = "all",
  initialSubCategory = "all",
  stats,
  answerRecords,
  onNavigateToSubCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "verbal" | "data" | "graphic"
  >(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<string>(initialSubCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | "all">(
    "all",
  );
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "unanswered" | "answered" | "favorite"
  >("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [instantSubmitMode, setInstantSubmitMode] = useState<boolean>(false);

  React.useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialSubCategory) setSelectedSubCategory(initialSubCategory);
  }, [initialCategory, initialSubCategory]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"single" | "list">("single");

  // Compute Sub-categories
  const availableSubCategories = useMemo(() => {
    let pool = allQuestions;
    if (selectedCategory !== "all") {
      pool = pool.filter((q) => q.category === selectedCategory);
    }
    const subs = Array.from(new Set(pool.map((q) => q.subCategory)));
    return subs;
  }, [selectedCategory]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      // Category filter
      if (selectedCategory !== "all" && q.category !== selectedCategory)
        return false;
      // Sub-category filter
      if (
        selectedSubCategory !== "all" &&
        q.subCategory !== selectedSubCategory
      )
        return false;
      // Difficulty filter
      if (selectedDifficulty !== "all") {
        const star =
          q.difficulty === "hard" ? 5 : q.difficulty === "medium" ? 4 : 3;
        if (star !== selectedDifficulty) return false;
      }
      // Status filter
      if (selectedStatus === "unanswered" && answeredMap[q.id]) return false;
      if (selectedStatus === "answered" && !answeredMap[q.id]) return false;
      if (selectedStatus === "favorite" && !favorites.includes(q.id))
        return false;
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inStem = q.stem.toLowerCase().includes(query);
        const inSub = q.subCategory.toLowerCase().includes(query);
        const inExpl = q.explanation.toLowerCase().includes(query);
        if (!inStem && !inSub && !inExpl) return false;
      }
      return true;
    });
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedDifficulty,
    selectedStatus,
    searchQuery,
    answeredMap,
    favorites,
  ]);

  // Ensure currentIndex is in bounds
  const safeIndex = Math.min(
    currentIndex,
    Math.max(0, filteredQuestions.length - 1),
  );
  const currentQ = filteredQuestions[safeIndex];

  const handleSelectOption = (
    question: Question,
    optionKey: string,
    timeSpentSec = 30,
  ) => {
    const isCorrect = optionKey === question.correctAnswer;
    onRecordAnswer({
      questionId: question.id,
      userAnswer: optionKey,
      isCorrect,
      timeSpentSec,
      answeredAt: new Date().toISOString(),
    });
    if (!isCorrect) {
      onAddMistake(question.id);
    }
  };

  const handleRandomQuestion = () => {
    if (filteredQuestions.length > 1) {
      let rand = Math.floor(Math.random() * filteredQuestions.length);
      if (rand === safeIndex) rand = (rand + 1) % filteredQuestions.length;
      setCurrentIndex(rand);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Category Selection Cards：手绘选科卡，选中=涂鸦填充 */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <DrawablyButton
          variant={selectedCategory === "all" ? "scribble" : "outline"}
          onClick={() => {
            setSelectedCategory("all");
            setSelectedSubCategory("all");
            setCurrentIndex(0);
          }}
          className="!block w-full text-left !p-4"
        >
          <span className="block w-full">
            <span className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider">全部题库</span>
              <BookOpen className="w-4 h-4 opacity-80" />
            </span>
            <span className="block text-xl font-extrabold mt-2 font-display">
              {allQuestions.length} 题
            </span>
            <span className="block text-[11px] opacity-75 mt-0.5">
              全科综合全真模拟覆盖
            </span>
          </span>
        </DrawablyButton>

        {Object.entries(categoryMeta).map(([catKey, meta]) => {
          const Icon =
            catKey === "verbal"
              ? BookOpen
              : catKey === "data"
                ? BarChart3
                : Shapes;
          return (
            <DrawablyButton
              key={catKey}
              variant={selectedCategory === catKey ? "scribble" : "outline"}
              onClick={() => {
                setSelectedCategory(catKey as any);
                setSelectedSubCategory("all");
                setCurrentIndex(0);
              }}
              className="!block w-full text-left !p-4"
            >
              <span className="block w-full">
                <span className="flex items-center justify-between">
                  <span className="text-xs font-bold">{meta.shortName}</span>
                  <Icon className="w-4 h-4 opacity-80" />
                </span>
                <span className="block text-xl font-extrabold mt-2 font-display">
                  {meta.count} 题
                </span>
                <span className="block text-[11px] opacity-80 mt-0.5 line-clamp-1">
                  {meta.name}
                </span>
              </span>
            </DrawablyButton>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#fdfbf7] rounded-2xl p-4 border border-[#e3d9c4] shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Subcategory Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[#8c7e6d] font-medium shrink-0">
              细分考点:
            </span>
            <button
              onClick={() => {
                setSelectedSubCategory("all");
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedSubCategory === "all"
                  ? "bg-[#fef7ea] text-[#854d0e] font-bold border border-[#ebdcb9]"
                  : "bg-[#f5eee3] text-[#6e6153] hover:bg-[#ede3d3]"
              }`}
            >
              全部细分
            </button>
            {availableSubCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => {
                  setSelectedSubCategory(sub);
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedSubCategory === sub
                    ? "bg-[#fef7ea] text-[#854d0e] font-bold border border-[#ebdcb9]"
                    : "bg-[#f5eee3] text-[#6e6153] hover:bg-[#ede3d3]"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* View Mode Toggle, Mode Switch & Random */}
          <div className="flex items-center gap-2">
            <DrawablyButton
              onClick={handleRandomQuestion}
              className="!px-3 !py-1.5 text-xs font-semibold"
              title="随机抽一道练习"
            >
              <span className="flex items-center gap-1">
                <Shuffle className="w-3.5 h-3.5" />
                <span>随机抽题</span>
              </span>
            </DrawablyButton>

            <div className="bg-[#f3ece0] p-0.5 rounded-lg flex text-xs">
              <button
                onClick={() => setViewMode("single")}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  viewMode === "single"
                    ? "bg-[#fffdfa] text-[#26201a] font-bold shadow-2xs"
                    : "text-[#786c5e]"
                }`}
              >
                逐题精练
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  viewMode === "list"
                    ? "bg-[#fffdfa] text-[#26201a] font-bold shadow-2xs"
                    : "text-[#786c5e]"
                }`}
              >
                全卷列表
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Filter & Search Row */}
        <div className="pt-2 border-t border-[#ede4d2] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <DrawablySelect
              value={selectedStatus}
              onChange={(e: any) => setSelectedStatus(e.target.value)}
              className="!px-2.5 !py-1 text-xs bg-[var(--card)] text-[color:var(--ink)]"
            >
              <option value="all">所有做题状态</option>
              <option value="unanswered">仅看未做题</option>
              <option value="answered">仅看已做题</option>
              <option value="favorite">仅看我的收藏</option>
            </DrawablySelect>

            {/* Difficulty Filter */}
            <DrawablySelect
              value={selectedDifficulty}
              onChange={(e: any) =>
                setSelectedDifficulty(
                  e.target.value === "all" ? "all" : Number(e.target.value),
                )
              }
              className="!px-2.5 !py-1 text-xs bg-[var(--card)] text-[color:var(--ink)]"
            >
              <option value="all">全部难度星级</option>
              <option value="3">★★★ 基础入门</option>
              <option value="4">★★★★ 进阶提升</option>
              <option value="5">★★★★★ 压轴难题</option>
            </DrawablySelect>

            {/* Submit Mode Toggle */}
            <DrawablyButton
              variant={instantSubmitMode ? "scribble" : "outline"}
              onClick={() => setInstantSubmitMode(!instantSubmitMode)}
              className="!px-2.5 !py-1 text-xs font-medium"
              title={
                instantSubmitMode
                  ? "当前模式：点击选项即时判定"
                  : "当前模式：选择选项后需点击确认提交"
              }
            >
              <span className="flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                <span>
                  {instantSubmitMode ? "模式：即选即判" : "模式：确认后核对"}
                </span>
              </span>
            </DrawablyButton>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-[#968877] absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
            <DrawablyInput
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索题干关键词、题型..."
              className="w-full !pl-8 !pr-3 !py-1 text-xs bg-[var(--card)] text-[color:var(--ink)]"
            />
          </div>
        </div>
      </div>

      {/* Main Practice Content */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-[#fdfbf7] rounded-2xl p-12 text-center border border-[#e3d9c4] space-y-2">
          <BookOpen className="w-8 h-8 text-[#ded2bd] mx-auto" />
          <h3 className="font-bold text-[#26201a] text-sm sm:text-base">
            没有找到符合条件的题目
          </h3>
          <p className="text-xs text-[#786c5e]">
            试着调整一下分类、难度或清除搜索词
          </p>
        </div>
      ) : viewMode === "single" && currentQ ? (
        /* SINGLE QUESTION MODE */
        <div className="space-y-4">
          <QuestionCard
            question={currentQ}
            selectedOption={answeredMap[currentQ.id]}
            onSelectOption={(key, timeSpentSec) =>
              handleSelectOption(currentQ, key, timeSpentSec)
            }
            isAnswered={!!answeredMap[currentQ.id]}
            onResetAnswer={onResetAnswer}
            onOpenAI={(tab) => onOpenAI(tab, currentQ)}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favorites.includes(currentQ.id)}
            userNote={notes[currentQ.id]}
            onSaveNote={onSaveNote}
            instantSubmitMode={instantSubmitMode}
            questionIndex={safeIndex}
            totalQuestions={filteredQuestions.length}
            stats={stats}
            answerRecords={answerRecords}
            onNavigateToSubCategory={onNavigateToSubCategory}
          />

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <DrawablyButton
              tone="neutral"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={safeIndex === 0}
              className="!px-4 !py-2 text-xs font-semibold"
            >
              <span className="flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" />
                <span>上一题</span>
              </span>
            </DrawablyButton>

            <div className="text-xs text-[color:var(--ink-soft)] font-medium font-display">
              <span>
                {safeIndex + 1} / {filteredQuestions.length}
              </span>
            </div>

            <DrawablyButton
              variant="solid"
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(filteredQuestions.length - 1, prev + 1),
                )
              }
              disabled={safeIndex === filteredQuestions.length - 1}
              className="!px-4 !py-2 text-xs font-bold"
            >
              <span className="flex items-center gap-1.5">
                <span>下一题</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </DrawablyButton>
          </div>
        </div>
      ) : (
        /* LIST MODE */
        <div className="space-y-6">
          {filteredQuestions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              selectedOption={answeredMap[q.id]}
              onSelectOption={(key, timeSpentSec) =>
                handleSelectOption(q, key, timeSpentSec)
              }
              isAnswered={!!answeredMap[q.id]}
              onResetAnswer={onResetAnswer}
              onOpenAI={(tab) => onOpenAI(tab, q)}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.includes(q.id)}
              userNote={notes[q.id]}
              onSaveNote={onSaveNote}
              instantSubmitMode={instantSubmitMode}
              questionIndex={idx}
              totalQuestions={filteredQuestions.length}
              stats={stats}
              answerRecords={answerRecords}
              onNavigateToSubCategory={onNavigateToSubCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
};
