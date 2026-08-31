import React, { useState } from 'react';
import { GraphicStemElement, OptionItem } from '../types';
import { Layers, ZoomIn, ArrowRight, Grid3X3 } from 'lucide-react';

interface GraphicViewerProps {
  elements?: GraphicStemElement[];
  options?: OptionItem[];
  selectedOption?: string;
  onSelectOption?: (key: string) => void;
  showAnswerState?: boolean;
  correctAnswer?: string;
  patternRule?: string;
  graphicType?: string;
}

export const GraphicViewer: React.FC<GraphicViewerProps> = ({
  elements = [],
  options = [],
  selectedOption,
  onSelectOption,
  showAnswerState = false,
  correctAnswer,
  patternRule,
  graphicType,
}) => {
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  // Check if it's a 3x3 matrix question (9 elements or graphicType === 'matrix3x3')
  const isMatrix3x3 = graphicType === 'matrix3x3' || (elements.length === 9 && elements.some(e => e.label?.startsWith('R')));

  return (
    <div className="my-4 bg-[#f8f3e8] border border-[#e3d8c2] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Visual Header / Sub-toolbar */}
      <div className="flex items-center justify-between text-xs text-[#786c5e] pb-2.5 border-b border-[#e5dac6]">
        <div className="flex items-center gap-2 font-semibold text-[#3b3127]">
          {isMatrix3x3 ? (
            <Grid3X3 className="w-4 h-4 text-[#b45309]" />
          ) : (
            <Layers className="w-4 h-4 text-[#b45309]" />
          )}
          <span>{isMatrix3x3 ? '九宫格图形推理题面' : '图形题面与演变序列'}</span>
          <span className="text-[11px] text-[#8c7e6d] font-normal hidden sm:inline">
            (共 {elements.length} 个图形单元，点击可局部放大)
          </span>
        </div>

        {/* Pattern rule summary shown when answer is revealed */}
        {showAnswerState && patternRule && (
          <div className="text-[11px] bg-[#fcf5e6] text-[#854d0e] px-2.5 py-0.5 rounded-lg border border-[#ebdcb9] font-medium animate-in fade-in">
            规律透析：{patternRule.split('：')[0] || '图形规律'}
          </div>
        )}
      </div>

      {/* 1. NINE-GRID (3x3) MATRIX VIEW */}
      {isMatrix3x3 && elements.length === 9 ? (
        <div className="flex flex-col items-center justify-center my-2">
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 p-3 bg-[#f3ecdf] rounded-2xl border border-[#decfa8] shadow-inner max-w-sm w-full">
            {elements.map((elem, idx) => {
              const isQuestionMark = elem.label === '？' || elem.label === '?' || elem.description?.includes('待确定') || elem.description?.includes('待选');
              return (
                <div
                  key={elem.id || idx}
                  onClick={() => elem.svgCode && setZoomIndex(idx)}
                  className={`relative aspect-square bg-[#fffdfa] rounded-xl border-2 p-1 flex flex-col items-center justify-center transition-all shadow-2xs group cursor-pointer ${
                    isQuestionMark
                      ? 'border-[#b45309] bg-[#fef7eb] ring-2 ring-[#b45309]/30'
                      : 'border-[#ded2bd] hover:border-[#b45309] hover:shadow-xs'
                  }`}
                >
                  {elem.svgCode ? (
                    <div
                      className="w-full h-full flex items-center justify-center p-0.5"
                      dangerouslySetInnerHTML={{ __html: elem.svgCode }}
                    />
                  ) : (
                    <div className="text-[#968877] text-xs font-mono">{elem.description || '图形'}</div>
                  )}

                  <span className="absolute bottom-1 right-1 text-[9px] px-1 bg-[#ede4d3]/90 rounded text-[#786c5e] font-mono">
                    {elem.label || `${idx + 1}`}
                  </span>

                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#26201a]/80 text-white rounded p-0.5">
                    <ZoomIn className="w-2.5 h-2.5" />
                  </div>
                </div>
              );
            })}
          </div>
          <span className="text-[11px] text-[#8c7e6d] mt-2 font-medium">九宫格空间矩阵 (横向/纵向/对角线综合规律)</span>
        </div>
      ) : (
        /* 2. STANDARD LINEAR / ANALOGY / SERIES GRAPHIC SEQUENCE */
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 my-2">
          {elements.map((elem, idx) => {
            const isQuestionMark =
              elem.label === '？' ||
              elem.label === '?' ||
              elem.description?.includes('待确定') ||
              elem.description?.includes('待选');
            const isLast = idx === elements.length - 1;

            return (
              <React.Fragment key={elem.id || idx}>
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => elem.svgCode && setZoomIndex(idx)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 bg-[#fffdfa] rounded-xl border-2 p-1.5 flex items-center justify-center transition-all shadow-2xs group cursor-pointer ${
                      isQuestionMark
                        ? 'border-[#b45309] bg-[#fef7eb] ring-2 ring-[#b45309]/30'
                        : 'border-[#ded2bd] hover:border-[#b45309] hover:shadow-xs'
                    }`}
                  >
                    {elem.svgCode ? (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: elem.svgCode }}
                      />
                    ) : elem.gridCells ? (
                      <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
                        {elem.gridCells.map((cell, cIdx) => (
                          <div
                            key={cIdx}
                            className={`rounded ${cell === '1' || cell === 'black' ? 'bg-[#1e1915]' : 'bg-white border border-[#ded2bd]'}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-[#968877] text-xs text-center">{elem.description || '图形'}</div>
                    )}

                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#26201a]/80 text-white rounded p-0.5">
                      <ZoomIn className="w-3 h-3" />
                    </div>
                  </div>
                  <span
                    className={`text-[11px] mt-1.5 font-medium ${
                      isQuestionMark ? 'text-[#b45309] font-bold' : 'text-[#786c5e]'
                    }`}
                  >
                    {elem.label || `图 ${idx + 1}`}
                  </span>
                </div>

                {/* Arrow between sequential elements (except before ? or at end) */}
                {!isLast && elements.length <= 6 && elem.label !== '＝' && elem.label !== '＋' && (
                  <div className="text-[#c7b9a3] hidden sm:flex items-center self-center -mt-4">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Graphic Option Cards */}
      {options.some((o) => o.graphicSvg) && (
        <div className="mt-4 pt-4 border-t border-[#e5dac6]">
          <div className="text-xs font-semibold text-[#4a3e31] mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span>选择答案图形：</span>
              <span className="text-[#786c5e] font-normal">(点击对应选项或下方字母)</span>
            </div>
            {showAnswerState && (
              <span className="text-[11px] text-[#15803d] font-bold">
                正确答案: {correctAnswer}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {options.map((opt) => {
              const isSelected = selectedOption === opt.key;
              const isCorrect = correctAnswer === opt.key;
              let borderStyle =
                'border-[#ded4bf] bg-[#faf6ed] hover:border-[#b45309] hover:bg-[#f6eee0] text-[#26201a]';

              if (showAnswerState) {
                if (isCorrect) {
                  borderStyle = 'border-[#4e9658] bg-[#edf7ee] ring-2 ring-[#4e9658] text-[#14532d] font-semibold';
                } else if (isSelected && !isCorrect) {
                  borderStyle = 'border-[#c2410c] bg-[#fef2f0] ring-2 ring-[#c2410c] text-[#991b1b]';
                } else {
                  borderStyle = 'border-[#e8dece] opacity-50 bg-[#fdfbf7] text-[#968877]';
                }
              } else if (isSelected) {
                borderStyle = 'border-[#b45309] bg-[#fef7eb] ring-2 ring-[#b45309]/50 shadow-xs font-semibold';
              }

              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onSelectOption && onSelectOption(opt.key)}
                  className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all cursor-pointer text-left shadow-2xs ${borderStyle}`}
                >
                  <div className="w-full flex items-center justify-between mb-1.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        showAnswerState && isCorrect
                          ? 'bg-[#15803d] text-white'
                          : showAnswerState && isSelected && !isCorrect
                          ? 'bg-[#c2410c] text-white'
                          : isSelected
                          ? 'bg-[#b45309] text-white'
                          : 'bg-[#ede5d4] text-[#4a3e31]'
                      }`}
                    >
                      {opt.key}
                    </span>
                    {showAnswerState && isCorrect && (
                      <span className="text-[10px] bg-[#dcfce7] text-[#15803d] font-bold px-1.5 py-0.5 rounded">
                        正确答案
                      </span>
                    )}
                  </div>

                  {opt.graphicSvg ? (
                    <div
                      className="w-18 h-18 sm:w-20 sm:h-20 p-1 flex items-center justify-center bg-[#fffdfa] rounded-xl border border-[#e8decc] my-1"
                      dangerouslySetInnerHTML={{ __html: opt.graphicSvg }}
                    />
                  ) : (
                    <div className="text-xs text-[#26201a] py-4 text-center">{opt.content}</div>
                  )}

                  <span className="text-[11px] text-[#786c5e] mt-1.5 text-center line-clamp-1">
                    {opt.content}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {zoomIndex !== null && elements[zoomIndex] && (
        <div
          className="fixed inset-0 z-50 bg-[#26201a]/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setZoomIndex(null)}
        >
          <div
            className="bg-[#fdfbf7] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#e3d9c4] animate-in fade-in zoom-in duration-150 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#e7ddca]">
              <span className="font-bold text-[#26201a] text-sm">
                高精度细节查看 · {elements[zoomIndex].label || `图 ${zoomIndex + 1}`}
              </span>
              <button
                onClick={() => setZoomIndex(null)}
                className="text-[#786c5e] hover:text-[#26201a] text-sm font-semibold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="w-60 h-60 mx-auto bg-[#fffdfa] rounded-2xl p-4 border border-[#ded3be] flex items-center justify-center shadow-inner">
              {elements[zoomIndex].svgCode && (
                <div
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: elements[zoomIndex].svgCode }}
                />
              )}
            </div>
            {elements[zoomIndex].description && (
              <p className="text-xs text-[#6e6153] text-center bg-[#f7f2e7] p-2.5 rounded-xl border border-[#e5dac6]">
                特征描述: {elements[zoomIndex].description}
              </p>
            )}
            <button
              onClick={() => setZoomIndex(null)}
              className="w-full py-2.5 bg-[#b45309] hover:bg-[#9a3412] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
            >
              关闭预览
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

