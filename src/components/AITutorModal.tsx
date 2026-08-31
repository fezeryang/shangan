import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  Sparkles,
  Bot,
  Layers,
  Repeat,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  Lightbulb,
} from 'lucide-react';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  selectedOption?: string;
  defaultTab?: 'explain' | 'graphic' | 'variant' | 'chat';
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  question,
  selectedOption,
  defaultTab = 'explain',
}) => {
  const [activeTab, setActiveTab] = useState<'explain' | 'graphic' | 'variant' | 'chat'>(defaultTab);

  // Explain State
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExplain, setLoadingExplain] = useState(false);

  // Graphic Pattern State
  const [graphicAnalysis, setGraphicAnalysis] = useState<string | null>(null);
  const [loadingGraphic, setLoadingGraphic] = useState(false);

  // Variant Question State
  const [variantQuestion, setVariantQuestion] = useState<any | null>(null);
  const [loadingVariant, setLoadingVariant] = useState(false);
  const [variantSelected, setVariantSelected] = useState<string | null>(null);
  const [showVariantAnswer, setShowVariantAnswer] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([
    {
      role: 'model',
      content: '你好！我是你的 AI 测评备考专属导师。无论你在做题中有任何疑问、图推规律看不懂、还是计算步骤卡壳，都可以随时向我提问！',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  // Reset or fetch when question changes
  useEffect(() => {
    if (question && isOpen) {
      if (activeTab === 'explain' && !explanation) {
        fetchExplanation();
      } else if (activeTab === 'graphic' && !graphicAnalysis && question.category === 'graphic') {
        fetchGraphicPattern();
      }
    }
  }, [question, isOpen, activeTab]);

  const fetchExplanation = async () => {
    if (!question) return;
    setLoadingExplain(true);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          selectedOption,
        }),
      });
      const data = await res.json();
      if (data.explanation) {
        setExplanation(data.explanation);
      } else {
        setExplanation('未能生成解析，请重试');
      }
    } catch (e: any) {
      setExplanation(`请求失败: ${e.message}`);
    } finally {
      setLoadingExplain(false);
    }
  };

  const fetchGraphicPattern = async () => {
    if (!question) return;
    setLoadingGraphic(true);
    try {
      const res = await fetch('/api/ai/graphic-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          patternType: question.patternRule,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setGraphicAnalysis(data.analysis);
      } else {
        setGraphicAnalysis('未能生成图推规律透析');
      }
    } catch (e: any) {
      setGraphicAnalysis(`请求失败: ${e.message}`);
    } finally {
      setLoadingGraphic(false);
    }
  };

  const generateVariant = async () => {
    if (!question) return;
    setLoadingVariant(true);
    setVariantSelected(null);
    setShowVariantAnswer(false);
    try {
      const res = await fetch('/api/ai/generate-variant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalQuestion: question }),
      });
      const data = await res.json();
      if (data.variant) {
        setVariantQuestion(data.variant);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoadingVariant(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || loadingChat) return;

    const userMsg = { role: 'user' as const, content: chatInput.trim() };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput('');
    setLoadingChat(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          currentQuestionContext: question,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setChatMessages([...newMessages, { role: 'model', content: data.reply }]);
      }
    } catch (e: any) {
      setChatMessages([
        ...newMessages,
        { role: 'model', content: `回复失败: ${e.message}` },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#26201a]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#fdfbf7] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-[#e3d9c4] overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#2c241d] px-5 py-4 text-[#faf6ee] flex items-center justify-between border-b border-[#4a3e31]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#b45309]/30 border border-[#b45309]/50 rounded-lg text-[#fed7aa]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold flex items-center gap-1.5 font-display text-white">
                <span>AI 智能思维导学助手</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#b45309]/40 text-[#fed7aa] font-mono">Gemini 3.7 Flash</span>
              </h3>
              <p className="text-xs text-[#ded3be] line-clamp-1">
                {question ? `${question.categoryName} · ${question.subCategory} 深度精讲` : '全天候备考智能答疑'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-lg text-[#ded3be] hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e8ded0] bg-[#f8f3e8] px-4 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setActiveTab('explain');
              if (!explanation) fetchExplanation();
            }}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'explain'
                ? 'border-[#b45309] text-[#b45309] bg-[#fdfbf7]'
                : 'border-transparent text-[#6e6153] hover:text-[#26201a]'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>AI 思维链拆解 (CoT)</span>
          </button>

          {question?.category === 'graphic' && (
            <button
              onClick={() => {
                setActiveTab('graphic');
                if (!graphicAnalysis) fetchGraphicPattern();
              }}
              className={`flex items-center gap-1.5 py-3 px-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === 'graphic'
                  ? 'border-[#b45309] text-[#b45309] bg-[#fdfbf7]'
                  : 'border-transparent text-[#6e6153] hover:text-[#26201a]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>图推视觉规律透析</span>
            </button>
          )}

          <button
            onClick={() => {
              setActiveTab('variant');
              if (!variantQuestion) generateVariant();
            }}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'variant'
                ? 'border-[#b45309] text-[#b45309] bg-[#fdfbf7]'
                : 'border-transparent text-[#6e6153] hover:text-[#26201a]'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>举一反三变式训练</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-[#b45309] text-[#b45309] bg-[#fdfbf7]'
                : 'border-transparent text-[#6e6153] hover:text-[#26201a]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>自由智能追问 ({chatMessages.length - 1})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 text-[#26201a] text-xs sm:text-sm leading-relaxed space-y-4">
          {/* TAB 1: AI EXPLAIN */}
          {activeTab === 'explain' && (
            <div>
              {loadingExplain ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-[#786c5e]">
                  <Loader2 className="w-8 h-8 animate-spin text-[#b45309]" />
                  <p className="text-xs font-medium">AI 名师正在梳理考点、逻辑链条与易错选项排雷...</p>
                </div>
              ) : explanation ? (
                <div className="space-y-3">
                  <div className="p-3 bg-[#fef7ea] rounded-xl border border-[#ebdcb9] flex items-center justify-between">
                    <span className="text-xs text-[#854d0e] font-medium">
                      当前题解：正确答案为 <strong className="text-[#14532d] text-sm font-bold">{question?.correctAnswer}</strong>
                      {selectedOption && `（你的选择：${selectedOption}）`}
                    </span>
                    <button
                      onClick={fetchExplanation}
                      className="text-xs text-[#b45309] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Sparkles className="w-3 h-3" /> 重新分析
                    </button>
                  </div>
                  <div className="bg-[#f8f3e8] p-4 rounded-xl border border-[#e3d8c2]">
                    <MarkdownRenderer content={explanation} />
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 2: GRAPHIC PATTERN */}
          {activeTab === 'graphic' && (
            <div>
              {loadingGraphic ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-[#786c5e]">
                  <Loader2 className="w-8 h-8 animate-spin text-[#b45309]" />
                  <p className="text-xs font-medium">正在解析空间几何维度与视觉规律法则...</p>
                </div>
              ) : graphicAnalysis ? (
                <div className="space-y-3">
                  <div className="p-3 bg-[#fef7ea] rounded-xl border border-[#ebdcb9] text-[#78350f] text-xs font-medium">
                    🎨 复杂图推规律维度：{question?.patternDimension || '综合几何规律'}
                  </div>
                  <div className="bg-[#f8f3e8] p-4 rounded-xl border border-[#e3d8c2]">
                    <MarkdownRenderer content={graphicAnalysis} />
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 3: VARIANT PRACTICE */}
          {activeTab === 'variant' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e8ded0]">
                <span className="text-xs font-bold text-[#4a3e31]">
                  🎯 智能同构题型强化（考查相同核心逻辑）
                </span>
                <button
                  onClick={generateVariant}
                  disabled={loadingVariant}
                  className="px-2.5 py-1 bg-[#fef7ea] hover:bg-[#faeed6] text-[#854d0e] border border-[#ebdcb9] rounded-md text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Repeat className="w-3 h-3 text-[#b45309]" />
                  <span>换一道新变式</span>
                </button>
              </div>

              {loadingVariant ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-[#786c5e]">
                  <Loader2 className="w-8 h-8 animate-spin text-[#b45309]" />
                  <p className="text-xs font-medium">AI 正在根据母题难度生成全新变式题目与干扰项...</p>
                </div>
              ) : variantQuestion ? (
                <div className="space-y-4 p-4 bg-[#f8f3e8] rounded-xl border border-[#e3d8c2]">
                  <div className="text-xs text-[#854d0e] font-semibold">
                    【变式强化题】· {variantQuestion.subCategory}
                  </div>
                  <p className="font-medium text-[#26201a] text-sm">{variantQuestion.stem}</p>

                  <div className="space-y-2">
                    {variantQuestion.options?.map((opt: any) => {
                      const isSelected = variantSelected === opt.key;
                      const isCorrect = variantQuestion.correctAnswer === opt.key;

                      let btnStyle = 'bg-[#fffdfa] border-[#ded3bd] hover:border-[#b45309] text-[#26201a]';
                      if (showVariantAnswer) {
                        if (isCorrect) {
                          btnStyle = 'bg-[#edf7ee] border-[#4e9658] text-[#14532d] font-semibold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-[#fef2f0] border-[#c2410c] text-[#991b1b]';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-[#fef7eb] border-[#b45309] text-[#26201a] font-semibold ring-1 ring-[#b45309]';
                      }

                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            if (!showVariantAnswer) {
                              setVariantSelected(opt.key);
                              setShowVariantAnswer(true);
                            }
                          }}
                          className={`w-full text-left p-3 rounded-lg border flex items-start gap-2.5 text-xs transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full bg-[#f3ead7] flex items-center justify-center font-bold text-[#4a3e31] shrink-0">
                            {opt.key}
                          </span>
                          <span className="flex-1">{opt.content}</span>
                          {showVariantAnswer && isCorrect && (
                            <CheckCircle className="w-4 h-4 text-[#15803d] shrink-0" />
                          )}
                          {showVariantAnswer && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-[#b91c1c] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showVariantAnswer && (
                    <div className="p-3.5 bg-[#fffdfa] rounded-lg border border-[#ded3bd] space-y-2 text-xs animate-in fade-in">
                      <div className="font-semibold text-[#26201a] flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-[#15803d]" />
                        <span>正确答案：{variantQuestion.correctAnswer}</span>
                      </div>
                      <MarkdownRenderer content={variantQuestion.explanation || ''} />
                      {variantQuestion.skillTip && (
                        <div className="text-[11px] bg-[#fff8eb] text-[#78350f] p-2.5 rounded-lg border border-[#ebdcb9] mt-2">
                          💡 <strong>核心技能点拨：</strong>{variantQuestion.skillTip}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 4: CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-96">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'model' && (
                      <div className="w-7 h-7 rounded-full bg-[#b45309] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#b45309] text-white rounded-br-xs font-normal'
                          : 'bg-[#f8f3e8] text-[#26201a] border border-[#e3d8c2] rounded-bl-xs'
                      }`}
                    >
                      {msg.role === 'model' ? (
                        <MarkdownRenderer content={msg.content} />
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>
                  </div>
                ))}
                {loadingChat && (
                  <div className="flex items-center gap-2 text-[#786c5e] text-xs py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#b45309]" />
                    <span>AI 导师思考中...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChat} className="mt-3 pt-3 border-t border-[#e8ded0] flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="针对本题提问，如：“为什么不选B选项？”、“图推还有哪些旋转技巧？”"
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-[#fffdfa] border border-[#ded3bd] rounded-xl focus:outline-[#b45309] text-[#26201a]"
                />
                <button
                  type="submit"
                  disabled={loadingChat || !chatInput.trim()}
                  className="px-4 py-2 bg-[#b45309] hover:bg-[#9a3412] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>发送</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
