import React, { useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useChatStream } from '../hooks/useChatStream';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { SuggestedQuestions } from './SuggestedQuestions';
import { ChatInput } from './ChatInput';
import { AtsScoreWidget } from './AtsScoreWidget';
import { SkillRoadmapCard } from './SkillRoadmapCard';
import { Menu, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

export const ChatWindow: React.FC = () => {
  const {
    messages,
    resumeText,
    jobDescription,
    targetRole,
    atsAudit,
    setAtsAudit,
    roadmap,
    setRoadmap,
    isSidebarOpen,
    setIsSidebarOpen,
    setIsContextModalOpen,
  } = useChat();

  const { isStreaming, streamingText, error, sendMessage, stopStreaming } = useChatStream();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, atsAudit, roadmap]);

  return (
    <div
      className={`flex-1 flex flex-col h-screen transition-all duration-300 ${
        isSidebarOpen ? 'lg:pl-80' : 'pl-0'
      }`}
    >
      {/* Top Floating Glass Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border-b border-white/15 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 backdrop-blur-md transition-all"
              title="Open Chat Sessions Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>AI Career Assistant & ATS Coach</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h1>
            <p className="text-xs text-slate-400">
              {targetRole ? `Targeting: ${targetRole}` : 'Grounded in Google Gemini 2.5 Flash'}
            </p>
          </div>
        </div>

        {/* Context Status Badge */}
        <button
          onClick={() => setIsContextModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/15 dark:bg-slate-800/40 hover:bg-white/25 backdrop-blur-md border border-white/20 dark:border-white/10 text-xs text-slate-200 transition-all"
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline font-medium">
            {resumeText || jobDescription ? 'Context Attached' : 'Attach Resume / JD'}
          </span>
          {resumeText || jobDescription ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : null}
        </button>
      </header>

      {/* Main Chat Scroll Container */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-4">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Screen if No Messages */}
          {messages.length === 0 && !isStreaming && (
            <div className="text-center py-12 px-6 rounded-3xl bg-white/20 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-glass-card my-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 text-white mb-4 shadow-glass-glow">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-gradient-iridescent mb-2">
                AI Career Studio
              </h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
                Receive real-time ATS optimization, technical interview coaching, STAR method bullet rewrites, and dynamic skill roadmaps via Gemini 2.5 Flash.
              </p>
              <SuggestedQuestions onSelectQuestion={sendMessage} />
            </div>
          )}

          {/* Messages Feed */}
          {messages.map((msg, idx) => (
            <MessageBubble key={msg.id || idx} message={msg} />
          ))}

          {/* Active Streaming Assistant Response */}
          {isStreaming && streamingText && (
            <MessageBubble
              message={{ role: 'model', message: streamingText }}
              isStreaming={true}
            />
          )}

          {/* Bouncing Dots Indicator */}
          {isStreaming && !streamingText && <TypingIndicator />}

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs my-3 backdrop-blur-md">
              ⚠️ {error}
            </div>
          )}

          {/* ATS Score Diagnostic Card */}
          {atsAudit && (
            <AtsScoreWidget audit={atsAudit} onClose={() => setAtsAudit(null)} />
          )}

          {/* Skill Roadmap Card */}
          {roadmap && (
            <SkillRoadmapCard roadmap={roadmap} onClose={() => setRoadmap(null)} />
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Floating Bottom Input Bar */}
      <footer className="p-4 bg-transparent backdrop-blur-sm">
        <ChatInput onSend={sendMessage} isStreaming={isStreaming} onStop={stopStreaming} />
      </footer>
    </div>
  );
};
