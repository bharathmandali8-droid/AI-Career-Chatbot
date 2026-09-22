import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { FileText, Briefcase, Check, X, Sparkles } from 'lucide-react';

export const ContextModal: React.FC = () => {
  const {
    resumeText,
    setResumeText,
    jobDescription,
    setJobDescription,
    targetRole,
    setTargetRole,
    isContextModalOpen,
    setIsContextModalOpen,
  } = useChat();

  const [localResume, setLocalResume] = useState(resumeText);
  const [localJd, setLocalJd] = useState(jobDescription);
  const [localRole, setLocalRole] = useState(targetRole);

  if (!isContextModalOpen) return null;

  const handleSave = () => {
    setResumeText(localResume);
    setJobDescription(localJd);
    setTargetRole(localRole);
    setIsContextModalOpen(false);
  };

  const handleClear = () => {
    setLocalResume('');
    setLocalJd('');
    setLocalRole('');
    setResumeText('');
    setJobDescription('');
    setTargetRole('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl p-6 rounded-3xl bg-white/30 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/30 dark:border-white/15 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Career Context Drawer
              </h3>
              <p className="text-xs text-slate-400">
                Paste your Resume & Target JD for real-time grounded AI coaching
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsContextModalOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              Target Role & Level
            </label>
            <input
              type="text"
              value={localRole}
              onChange={e => setLocalRole(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer / AI Tech Lead"
              className="w-full glass-input px-3.5 py-2 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Resume Text
            </label>
            <textarea
              rows={4}
              value={localResume}
              onChange={e => setLocalResume(e.target.value)}
              placeholder="Paste your raw resume text or key bullet points here..."
              className="w-full glass-input px-3.5 py-2 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              Target Job Description (JD)
            </label>
            <textarea
              rows={4}
              value={localJd}
              onChange={e => setLocalJd(e.target.value)}
              placeholder="Paste target job description and requirements here..."
              className="w-full glass-input px-3.5 py-2 rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
          >
            Clear Context
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsContextModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-xs rounded-xl shadow-glass-glow transition-all duration-200"
            >
              <Check className="w-4 h-4" />
              Save & Attach Context
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
