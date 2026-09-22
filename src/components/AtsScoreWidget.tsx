import React from 'react';
import { AtsAuditResponse } from '../types/chat';
import { ShieldCheck, AlertCircle, CheckCircle2, RefreshCw, X } from 'lucide-react';

interface AtsScoreWidgetProps {
  audit: AtsAuditResponse;
  onClose?: () => void;
}

export const AtsScoreWidget: React.FC<AtsScoreWidgetProps> = ({ audit, onClose }) => {
  const scoreColor =
    audit.matchScore >= 80
      ? 'from-emerald-400 to-cyan-400 text-emerald-400'
      : audit.matchScore >= 60
      ? 'from-amber-400 to-indigo-400 text-amber-400'
      : 'from-rose-400 to-fuchsia-400 text-rose-400';

  return (
    <div className="relative my-6 p-6 rounded-3xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-glass-card">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-slate-200 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">ATS Match & Audit Diagnostic</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Dial Gauge */}
        <div className="flex flex-col items-center justify-center p-6 bg-white/20 dark:bg-slate-800/40 rounded-2xl border border-white/15 backdrop-blur-md">
          <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-700/30"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${audit.matchScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${scoreColor}`}>
                {audit.matchScore}%
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Match Score</span>
            </div>
          </div>
        </div>

        {/* Audit Details */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Key Matched Strengths
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {audit.keyStrengths.map((str, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-medium bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 rounded-lg backdrop-blur-sm"
                >
                  {str}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              Missing Keywords & Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {audit.missingKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-medium bg-rose-500/15 border border-rose-400/30 text-rose-300 rounded-lg backdrop-blur-sm"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Rewrites */}
      {audit.suggestedRewrites && audit.suggestedRewrites.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            High-Impact Bullet Point Rewrites
          </h4>
          <div className="space-y-3">
            {audit.suggestedRewrites.map((rw, idx) => (
              <div
                key={idx}
                className="p-3 bg-white/10 dark:bg-slate-800/40 rounded-xl border border-white/10 text-xs space-y-1.5"
              >
                <p className="text-slate-400 line-through">Original: {rw.original}</p>
                <p className="text-cyan-300 font-medium">✨ ATS Recommended: {rw.improved}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
