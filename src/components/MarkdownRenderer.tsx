import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlockRenderer } from './CodeBlockRenderer';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose dark:prose-invert max-w-none prose-slate text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');
            const codeString = String(children).replace(/\n$/, '');

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/20 font-mono text-xs"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlockRenderer
                language={match ? match[1] : 'text'}
                code={codeString}
              />
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-3 pl-4 border-l-4 border-cyan-500/60 bg-cyan-500/10 dark:bg-cyan-500/10 py-2 pr-3 rounded-r-lg italic text-slate-700 dark:text-slate-200">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto rounded-xl border border-white/20 dark:border-white/10 glass-panel">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="px-4 py-2.5 bg-white/20 dark:bg-slate-800/60 font-semibold text-slate-800 dark:text-slate-100">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-2 border-t border-white/10 text-slate-700 dark:text-slate-300">
                {children}
              </td>
            );
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>;
          },
          h1({ children }) {
            return <h1 className="text-xl font-bold mt-4 mb-2 text-gradient-iridescent">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg font-semibold mt-3 mb-2 text-cyan-600 dark:text-cyan-300">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-base font-medium mt-2 mb-1 text-slate-800 dark:text-slate-200">{children}</h3>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
