import React from 'react';
import { RoadmapResponse } from '../types/chat';
import { Compass, Calendar, CheckSquare, Rocket, X } from 'lucide-react';

interface SkillRoadmapCardProps {
  roadmap: RoadmapResponse;
  onClose?: () => void;
}

export const SkillRoadmapCard: React.FC<SkillRoadmapCardProps> = ({ roadmap, onClose }) => {
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

      <div className="flex items-center gap-2 mb-2">
        <Compass className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Career Roadmap: <span className="text-gradient-iridescent">{roadmap.targetRole}</span>
        </h3>
      </div>

      {roadmap.currentSkillGap && roadmap.currentSkillGap.length > 0 && (
        <div className="mb-6 p-3 bg-indigo-500/10 border border-indigo-400/20 rounded-xl text-xs">
          <span className="font-semibold text-indigo-300">Identified Skill Gap: </span>
          <span className="text-slate-300">{roadmap.currentSkillGap.join(' • ')}</span>
        </div>
      )}

      {/* Timeline Steps */}
      <div className="relative space-y-6 before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-indigo-500 before:to-fuchsia-500">
        {roadmap.roadmap.map((step, idx) => (
          <div key={idx} className="relative flex items-start gap-4 pl-8">
            {/* Dot Node */}
            <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 shadow-glass-glow" />

            {/* Card Content */}
            <div className="flex-1 p-4 bg-white/20 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-white/15 dark:border-white/10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                <h4 className="font-bold text-sm text-cyan-300">{step.phaseTitle}</h4>
                <div className="flex items-center gap-1 text-xs text-slate-400 bg-white/10 px-2.5 py-0.5 rounded-full">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  <span>{step.duration}</span>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                  Topics & Modules to Master
                </h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-300 pl-4 list-disc">
                  {step.topicsToMaster.map((topic, tIdx) => (
                    <li key={tIdx}>{topic}</li>
                  ))}
                </ul>
              </div>

              {step.recommendedProjects && step.recommendedProjects.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                    <Rocket className="w-3.5 h-3.5 text-fuchsia-400" />
                    Recommended Capstone Projects
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {step.recommendedProjects.map((proj, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-2.5 py-1 text-xs bg-fuchsia-500/15 border border-fuchsia-400/30 text-fuchsia-300 rounded-lg"
                      >
                        {proj}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
