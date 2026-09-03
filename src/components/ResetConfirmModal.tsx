import React from "react";
import { RotateCcw, AlertTriangle, X } from "lucide-react";
import { DrawablyButton } from "drawably/react";

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  answeredCount: number;
  mistakeCount: number;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "重置所有练习记录与学情",
  description = "此操作将清空全站题库作答历史、错题集、收藏题单与各模块统计数据，重置后无法撤销。",
  answeredCount,
  mistakeCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-[#fdfbf7] rounded-3xl border border-[#e3d9c4] max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center text-[#b91c1c] shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#26201a] text-lg font-display">
                {title}
              </h3>
              <p className="text-xs text-[#786c5e] mt-0.5">
                请再次确认是否重置练习数据
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8c7e6d] hover:text-[#26201a] hover:bg-[#f3ebd9] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning & Data Snapshot Box */}
        <div className="p-4 bg-[#fbf5eb] rounded-2xl border border-[#ebdcb9] space-y-2 text-xs">
          <p className="text-[#5c4e3f] leading-relaxed">{description}</p>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#ded3bd] text-center">
            <div className="bg-[#fffdfa] p-2 rounded-xl border border-[#ded3bd]">
              <span className="text-[#8c7e6d] text-[11px]">当前已刷题数</span>
              <div className="font-bold font-display text-[#26201a] text-lg mt-0.5">
                {answeredCount} 题
              </div>
            </div>
            <div className="bg-[#fffdfa] p-2 rounded-xl border border-[#ded3bd]">
              <span className="text-[#8c7e6d] text-[11px]">收录错题数</span>
              <div className="font-bold font-display text-[#b91c1c] text-lg mt-0.5">
                {mistakeCount} 题
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <DrawablyButton
            tone="neutral"
            onClick={onClose}
            className="!px-4 !py-2.5 text-xs font-semibold"
          >
            取消
          </DrawablyButton>
          <DrawablyButton
            tone="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="!px-5 !py-2.5 text-xs font-semibold"
          >
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4" />
              <span>确认立即重置</span>
            </span>
          </DrawablyButton>
        </div>
      </div>
    </div>
  );
};
