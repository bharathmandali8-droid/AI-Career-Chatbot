import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Bot, User } from 'lucide-react';
import { ChatMessage } from '../types/chat';

interface MessageBubbleProps {
  message: ChatMessage | { role: 'user' | 'model'; message: string };
  isStreaming?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isStreaming = false }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar Icon */}
      <div
        className={`flex items-center justify-center w-9 h-9 rounded-xl backdrop-blur-md shrink-0 shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/30 text-white'
            : 'bg-white/20 dark:bg-slate-800/80 border border-cyan-400/30 text-cyan-400'
        }`}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Bubble Container */}
      <div
        className={`max-w-[85%] sm:max-w-[78%] px-5 py-4 transition-all duration-300 ${
          isUser
            ? 'bg-gradient-to-r from-indigo-500/80 to-purple-600/80 backdrop-blur-md text-white shadow-lg shadow-indigo-500/20 rounded-2xl rounded-tr-none border border-white/30'
            : 'bg-white/50 dark:bg-slate-900/50 backdrop-blur-md text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-none border border-white/20 dark:border-white/10 shadow-glass-card'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.message}</p>
        ) : (
          <div className="relative">
            <MarkdownRenderer content={message.message} />
            {isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
