import React from 'react';
import { Sparkles, FileSearch, HelpCircle, Compass, Code, DollarSign } from 'lucide-react';

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

const SUGGESTIONS = [
  {
    icon: FileSearch,
    label: 'ATS Resume Audit',
    query: 'Analyze my uploaded resume against the target job description. Give me a match percentage and specific bullet point rewrites.',
  },
  {
    icon: HelpCircle,
    label: 'Technical Interview Prep',
    query: 'Generate 3 hard technical interview questions tailored to my job description along with ideal STAR-method answers.',
  },
  {
    icon: Compass,
    label: 'Skill Gap & Roadmap',
    query: 'Generate a step-by-step 12-week technical skill acquisition roadmap to transition into a Senior Lead role.',
  },
  {
    icon: Code,
    label: 'Portfolio Enhancements',
    query: 'Suggest 2 industry-grade high-impact software engineering portfolio projects tailored to target senior role expectations.',
  },
  {
    icon: DollarSign,
    label: 'Salary & Negotiation',
    query: 'Provide a cold outreach message script and salary negotiation counter-offer template for tech roles.',
  },
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelectQuestion }) => {
  return (
    <div className="my-6">
      <div className="flex items-center gap-2 mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>Suggested AI Prompts & Career Tools</span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectQuestion(item.query)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-white/20 dark:bg-slate-800/40 hover:bg-white/35 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 backdrop-blur-md border border-white/25 dark:border-white/10 rounded-full shadow-sm hover:shadow-glass-glow hover:border-cyan-400/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Icon className="w-3.5 h-3.5 text-cyan-400" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
