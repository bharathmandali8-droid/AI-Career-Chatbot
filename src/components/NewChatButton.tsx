import React from 'react';
import { Plus } from 'lucide-react';

interface NewChatButtonProps {
  onClick: () => void;
}

export const NewChatButton: React.FC<NewChatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500/90 via-indigo-500/90 to-fuchsia-500/90 hover:brightness-110 text-white font-medium text-sm rounded-2xl backdrop-blur-lg shadow-glass-glow border border-white/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <Plus className="w-4 h-4" />
      <span>New Career Session</span>
    </button>
  );
};
