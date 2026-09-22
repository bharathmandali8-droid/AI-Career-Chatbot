import React, { useState } from 'react';
import { useChatHistory } from '../hooks/useChatHistory';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { NewChatButton } from './NewChatButton';
import {
  MessageSquare,
  Search,
  Trash2,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  Compass,
  FileText,
  ChevronLeft,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const ChatHistorySidebar: React.FC = () => {
  const { sessions, loadSession, createNewSession, deleteSession } = useChatHistory();
  const {
    currentSession,
    resumeText,
    jobDescription,
    setAtsAudit,
    setRoadmap,
    isSidebarOpen,
    setIsSidebarOpen,
    setIsContextModalOpen,
  } = useChat();

  const { theme, toggleTheme } = useTheme();
  const { user, signOut, getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [isRoadmapping, setIsRoadmapping] = useState(false);

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateAudit = async () => {
    if (!resumeText || !jobDescription) {
      setIsContextModalOpen(true);
      return;
    }
    setIsAuditing(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/chat/ats-audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
          'x-guest-mode': token === 'demo-token-guest' ? 'true' : 'false',
        },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      if (res.ok) {
        const auditData = await res.json();
        setAtsAudit(auditData);
      }
    } catch (err) {
      console.error('Audit Error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    setIsRoadmapping(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/chat/roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
          'x-guest-mode': token === 'demo-token-guest' ? 'true' : 'false',
        },
        body: JSON.stringify({
          currentSkills: resumeText || 'React, TypeScript, Node.js, REST APIs',
          targetRole: 'Senior AI Full-Stack Engineer',
        }),
      });
      if (res.ok) {
        const roadmapData = await res.json();
        setRoadmap(roadmapData);
      }
    } catch (err) {
      console.error('Roadmap Error:', err);
    } finally {
      setIsRoadmapping(false);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 w-80 bg-white/20 dark:bg-slate-900/60 backdrop-blur-2xl border-r border-white/20 dark:border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              AI
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Career Assistant
              </h2>
              <span className="text-[10px] text-cyan-400 font-mono">v2.5 Enterprise</span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 lg:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <NewChatButton onClick={createNewSession} />
      </div>

      {/* Structured Tool Actions */}
      <div className="px-4 py-3 border-b border-white/10 space-y-2">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Structured Tools
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleGenerateAudit}
            disabled={isAuditing}
            className="flex items-center justify-center gap-1.5 p-2 bg-white/10 dark:bg-slate-800/40 hover:bg-white/20 text-xs font-medium text-slate-700 dark:text-slate-200 rounded-xl border border-white/15 backdrop-blur-sm transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAuditing ? 'Auditing...' : 'ATS Audit'}</span>
          </button>

          <button
            onClick={handleGenerateRoadmap}
            disabled={isRoadmapping}
            className="flex items-center justify-center gap-1.5 p-2 bg-white/10 dark:bg-slate-800/40 hover:bg-white/20 text-xs font-medium text-slate-700 dark:text-slate-200 rounded-xl border border-white/15 backdrop-blur-sm transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isRoadmapping ? 'Building...' : 'Roadmap'}</span>
          </button>
        </div>
      </div>

      {/* Session Search */}
      <div className="p-3 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search sessions..."
            className="w-full glass-input pl-9 pr-3 py-1.5 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredSessions.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400 italic">
            No active sessions found
          </div>
        ) : (
          filteredSessions.map(session => {
            const isActive = currentSession?.id === session.id;
            return (
              <div
                key={session.id}
                className={`group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'bg-white/25 dark:bg-slate-800/80 text-cyan-300 font-medium border border-cyan-400/30 shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white/15 dark:hover:bg-slate-800/40 border border-transparent'
                }`}
                onClick={() => loadSession(session.id)}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">{session.title}</span>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity"
                  title="Delete Session"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer User Info & Theme */}
      <div className="p-4 border-t border-white/10 space-y-3 bg-white/5 dark:bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold text-xs border border-cyan-400/30">
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <span className="text-xs text-slate-300 truncate font-medium">
              {user?.email || 'Guest User'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-all"
              title="Toggle Spatial Glass Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            <button
              onClick={signOut}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
