// drawably 原生挂载器的 React hook（Underline/Highlight/Circle 等无官方 React 包装）
import { useEffect, useRef } from "react";
import type { Sketch } from "drawably";

/** 把任意 drawably 挂载器接到 ref 元素上，卸载/依赖变化时销毁重绘 */
export function useSketch<T extends HTMLElement>(
  attach: (el: HTMLElement) => Sketch,
  deps: readonly unknown[],
) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!ref.current) return;
    const sketch = attach(ref.current);
    return () => sketch.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
