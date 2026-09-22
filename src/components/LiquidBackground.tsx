import React from 'react';

export const LiquidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Deep Canvas Gradient */}
      <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950 transition-colors duration-500" />

      {/* Atmospheric Ambient Orb 1 - Cyan / Indigo */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/30 dark:bg-cyan-500/25 blur-3xl animate-liquid-blob" />

      {/* Atmospheric Ambient Orb 2 - Fuchsia / Purple */}
      <div className="absolute top-1/3 -right-20 w-[30rem] h-[30rem] rounded-full bg-fuchsia-500/25 dark:bg-fuchsia-600/20 blur-3xl animate-liquid-blob-delayed" />

      {/* Atmospheric Ambient Orb 3 - Indigo / Radiant Sky Blue */}
      <div className="absolute -bottom-32 left-1/3 w-[32rem] h-[32rem] rounded-full bg-indigo-500/30 dark:bg-indigo-600/25 blur-3xl animate-liquid-blob" />

      {/* Subtle Mesh Highlight Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
};
