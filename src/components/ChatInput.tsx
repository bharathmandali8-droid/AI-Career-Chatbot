import React, { useState, KeyboardEvent } from 'react';
import { Send, Square, FileText, Sparkles } from 'lucide-react';
import { useChat } from '../context/ChatContext';

interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
  onStop: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isStreaming, onStop }) => {
  const [input, setInput] = useState('');
  const { resumeText, jobDescription, setIsContextModalOpen } = useChat();

  const hasContext = Boolean(resumeText || jobDescription);

  const handleSubmit = () => {
    if (!input.trim() || isStreaming) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-2">
      <div className="flex items-center gap-2 p-2 bg-white/30 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/30 dark:border-white/15 shadow-glass-input rounded-2xl focus-within:ring-2 focus-within:ring-cyan-400/50 focus-within:border-cyan-400/50 transition-all duration-300">
        {/* Context Modal Drawer Trigger */}
        <button
          type="button"
          onClick={() => setIsContextModalOpen(true)}
          className={`relative p-2.5 rounded-xl backdrop-blur-md transition-all duration-200 ${
            hasContext
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 shadow-sm'
              : 'bg-white/10 dark:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-white/10'
          }`}
          title="Attach / Edit Resume & Job Description Context"
        >
          <FileText className="w-5 h-5" />
          {hasContext && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-slate-950 animate-pulse" />
          )}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            hasContext
              ? 'Ask AI Career Assistant (Resume & JD context active)...'
              : 'Ask AI Career Assistant or click paper icon to attach Resume/JD...'
          }
          className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
        />

        {/* Submit or Stop Button */}
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-500/80 hover:bg-rose-600/90 text-white font-medium text-xs rounded-xl backdrop-blur-md border border-rose-400/30 shadow-md transition-all duration-200"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Stop</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="flex items-center justify-center p-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Subtle indicator bar */}
      <div className="flex items-center justify-between px-3 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Powered by Gemini 2.5 Flash Streaming Engine
        </span>
        <span>Press Enter to send</span>
      </div>
    </div>
  );
};
