import React from 'react';
import { CopyButton } from './CopyButton';
import { Terminal } from 'lucide-react';

interface CodeBlockRendererProps {
  language?: string;
  code: string;
}

export const CodeBlockRenderer: React.FC<CodeBlockRendererProps> = ({ language = 'code', code }) => {
  return (
    <div className="my-4 rounded-xl overflow-hidden bg-slate-950/85 backdrop-blur-xl border border-white/15 dark:border-white/10 shadow-2xl">
      {/* Code Frame Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 dark:bg-slate-900/60 border-b border-white/10 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono font-medium text-cyan-300 uppercase tracking-wider">{language}</span>
        </div>
        <CopyButton text={code} />
      </div>

      {/* Code Frame Body */}
      <div className="p-4 overflow-x-auto text-sm font-mono text-cyan-100 leading-relaxed">
        <pre className="whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
