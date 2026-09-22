import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-white/40 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl rounded-tl-none border border-white/20 dark:border-white/10 shadow-glass-card w-fit my-2">
      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-bounce" />
    </div>
  );
};
