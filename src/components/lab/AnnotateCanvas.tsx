// 真题标注工具箱（plan 2.3，D9）：点数计数器（多命名计数）+ 圈选画笔 + 撤销/清空。
// 绝对定位 SVG 覆盖层挂在题面图之上，pointer events 移动端可用；会话内存态不持久化。
import type React from "react";
import { useRef, useState } from "react";
import {
  CircleDot,
  Circle,
  Undo2,
  Trash2,
  Pencil,
  PencilOff,
} from "lucide-react";

type Mark =
  | { type: "dot"; counter: string; x: number; y: number; seq: number }
  | { type: "ellipse"; x: number; y: number; rx: number; ry: number };

const COUNTERS = ["点", "线", "面", "角"] as const;
const COUNTER_COLORS: Record<string, string> = {
  点: "#b45309",
  线: "#1d4ed8",
  面: "#047857",
  角: "#b91c1c",
};

export const AnnotateCanvas: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [enabled, setEnabled] = useState(false);
  const [tool, setTool] = useState<"dot" | "ellipse">("dot");
  const [counter, setCounter] = useState<string>("点");
  const [marks, setMarks] = useState<Mark[]>([]);
  const [drawing, setDrawing] = useState<Mark | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);

  const counterCounts = (name: string) =>
    marks.filter((m) => m.type === "dot" && m.counter === name).length;

  /** 相对坐标（百分比），resize 后标注不漂移 */
  const pointOf = (e: React.PointerEvent): { x: number; y: number } => {
    const rect = containerRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!enabled || (tool !== "dot" && tool !== "ellipse")) return;
    const p = pointOf(e);
    if (tool === "dot") {
      setMarks((prev) => [
        ...prev,
        { type: "dot", counter, ...p, seq: counterCounts(counter) + 1 },
      ]);
    } else {
      drawingRef.current = true;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      setDrawing({ type: "ellipse", x: p.x, y: p.y, rx: 0, ry: 0 });
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawingRef.current || !drawing) return;
    const p = pointOf(e);
    setDrawing(
      (prev) =>
        prev && {
          ...prev,
          rx: Math.abs(p.x - prev.x),
          ry: Math.abs(p.y - prev.y),
          x: (p.x + prev.x) / 2,
          y: (p.y + prev.y) / 2,
        },
    );
  };

  const onPointerUp = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    setDrawing((draft) => {
      // 过小（误触）的圈选不落盘
      if (draft && draft.type === "ellipse" && draft.rx > 2 && draft.ry > 2) {
        setMarks((prev) => [...prev, draft]);
      }
      return null;
    });
  };

  return (
    <div className="space-y-2">
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => setEnabled((v) => !v)}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
            enabled
              ? "bg-[#b45309] text-white"
              : "bg-[#f6efe2] hover:bg-[#ede3d3] text-[#4a3e31]"
          }`}
        >
          {enabled ? (
            <PencilOff className="w-3.5 h-3.5" />
          ) : (
            <Pencil className="w-3.5 h-3.5" />
          )}
          {enabled ? "关闭标注" : "标注题面"}
        </button>
        {enabled && (
          <>
            <div className="flex items-center gap-1 bg-[#f6efe2] p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setTool("dot")}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer flex items-center gap-1 transition-colors ${
                  tool === "dot"
                    ? "bg-[#fffdfa] text-[#854d0e] font-bold shadow-2xs"
                    : "text-[#786c5e]"
                }`}
              >
                <CircleDot className="w-3.5 h-3.5" /> 点数计数
              </button>
              <button
                type="button"
                onClick={() => setTool("ellipse")}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer flex items-center gap-1 transition-colors ${
                  tool === "ellipse"
                    ? "bg-[#fffdfa] text-[#854d0e] font-bold shadow-2xs"
                    : "text-[#786c5e]"
                }`}
              >
                <Circle className="w-3.5 h-3.5" /> 圈选画笔
              </button>
            </div>
            {tool === "dot" &&
              COUNTERS.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCounter(name)}
                  className={`px-2 py-1 rounded-md font-semibold cursor-pointer border transition-colors ${
                    counter === name
                      ? "text-white border-transparent"
                      : "bg-[#fcf8ef] border-[#ded3bd] text-[#4a3e31]"
                  }`}
                  style={
                    counter === name
                      ? { background: COUNTER_COLORS[name] }
                      : undefined
                  }
                >
                  {name}·{counterCounts(name)}
                </button>
              ))}
            <button
              type="button"
              onClick={() => setMarks((prev) => prev.slice(0, -1))}
              disabled={!marks.length}
              className="px-2.5 py-1 rounded-md bg-[#f6efe2] hover:bg-[#ede3d3] disabled:opacity-40 text-[#4a3e31] font-medium cursor-pointer flex items-center gap-1 transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" /> 撤销
            </button>
            <button
              type="button"
              onClick={() => setMarks([])}
              disabled={!marks.length}
              className="px-2.5 py-1 rounded-md bg-[#fef2f0] hover:bg-[#fee2e2] disabled:opacity-40 text-[#991b1b] font-medium cursor-pointer flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> 清空
            </button>
          </>
        )}
      </div>

      {/* 题面图 + SVG 覆盖层 */}
      <div
        ref={containerRef}
        className="relative select-none"
        style={{ touchAction: enabled ? "none" : undefined }}
      >
        {children}
        {enabled && (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            style={{
              pointerEvents: "auto",
              cursor: tool === "dot" ? "crosshair" : "cell",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {marks.map((m, i) =>
              m.type === "dot" ? (
                <g key={i}>
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={1.6}
                    fill={COUNTER_COLORS[m.counter]}
                    fillOpacity={0.85}
                    stroke="#fff"
                    strokeWidth={0.3}
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={m.x + 2}
                    y={m.y - 1.5}
                    fontSize={3.4}
                    fontWeight={700}
                    fill={COUNTER_COLORS[m.counter]}
                    style={{ paintOrder: "stroke" }}
                    stroke="#fff"
                    strokeWidth={0.6}
                  >
                    {m.seq}
                  </text>
                </g>
              ) : (
                <ellipse
                  key={i}
                  cx={m.x}
                  cy={m.y}
                  rx={m.rx}
                  ry={m.ry}
                  fill="none"
                  stroke="#b45309"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  vectorEffect="non-scaling-stroke"
                />
              ),
            )}
            {drawing?.type === "ellipse" && (
              <ellipse
                cx={drawing.x}
                cy={drawing.y}
                rx={drawing.rx}
                ry={drawing.ry}
                fill="none"
                stroke="#d97706"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
        )}
      </div>
    </div>
  );
};
