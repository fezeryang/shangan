import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * 暖色纸张世界（与全局 #fdfbf7/#f8f3e8/#b45309 主题一致）的 Markdown 渲染。
 * AI 输出以「有序列表 + 加粗 emoji 小标题」为主结构，列表标记与加粗高亮承担主要层级。
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  return (
    <div
      className={`markdown-body text-[13px] sm:text-[15px] leading-relaxed text-[#3b3227] break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base sm:text-lg font-bold text-[#26201a] mt-6 mb-2.5 pb-1.5 border-b border-[#e3d8c2]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-[15px] sm:text-[17px] font-bold text-[#26201a] mt-5 mb-2 flex items-center gap-2 before:content-[''] before:w-[3px] before:h-[1em] before:rounded-full before:bg-[#b45309]/80 before:shrink-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm sm:text-base font-bold text-[#2c241d] mt-3.5 mb-1.5">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-[13px] sm:text-[15px] font-semibold text-[#2c241d] mt-3 mb-1">{children}</h4>
          ),
          p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc pl-5 my-2.5 space-y-1 marker:text-[#b45309]/80 marker:font-bold">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 my-2.5 space-y-1.5 marker:text-[#b45309] marker:font-bold">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-bold text-[#26201a] bg-[#fbd98d]/70 -mx-0.5 px-1 py-px rounded-[4px]">
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="not-italic font-medium text-[#92400e]">{children}</em>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-[#b45309] font-medium underline decoration-[#b45309]/40 underline-offset-2 hover:decoration-[#b45309]"
            >
              {children}
            </a>
          ),
          del: ({ children }) => <del className="line-through text-[#8c7e6d]">{children}</del>,
          input: ({ type }) =>
            type === 'checkbox' ? (
              <input type="checkbox" className="accent-[#b45309] mr-1.5 translate-y-px" readOnly />
            ) : null,
          code: ({ className, children }) => {
            if (className?.includes('language-')) {
              return <code className="font-mono text-[12px] leading-relaxed">{children}</code>;
            }
            return (
              <code className="bg-[#f0e4c8] text-[#6b430e] border border-[#ddc9a0] rounded-md px-1.5 py-px font-mono text-[0.82em] font-medium">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-[#2c241d] text-[#f0e8d8] rounded-xl border border-[#4a3e31]/50 p-3.5 my-3 overflow-x-auto">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="bg-[#faf1da] border border-[#e6d6ac] rounded-lg px-3.5 py-2.5 my-3 text-[#5c5142]">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3.5 rounded-xl border border-[#ded3bd] bg-white shadow-xs">
              <table className="min-w-full border-collapse text-left text-[12px] sm:text-[13px]">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead>{children}</thead>,
          th: ({ children }) => (
            <th className="bg-[#f6efe2] px-3 py-2 text-left font-bold text-[#4a3e31] border-b border-[#ded3bd] whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="px-3 py-2 border-t border-[#efe6d4]">{children}</td>,
          hr: () => <hr className="my-5 border-0 border-t border-dashed border-[#ddcfb2]" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
