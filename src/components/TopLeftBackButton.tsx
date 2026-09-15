import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { ViewMode } from '../types';

interface TopLeftBackButtonProps {
  onBack: () => void;
  currentView: ViewMode;
  targetLabel?: string;
  className?: string;
}

export const TopLeftBackButton: React.FC<TopLeftBackButtonProps> = ({
  onBack,
  currentView,
  targetLabel,
  className = '',
}) => {
  if (currentView === 'home') {
    return null;
  }

  return (
    <div
      id="top-left-back-button-container"
      className={`inline-flex items-center gap-2 mb-4 sm:mb-6 ${className}`}
    >
      <button
        id="global-top-left-back-btn"
        onClick={onBack}
        aria-label="Go back to previous page"
        className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#08172c]/90 hover:bg-cyan-950/90 text-cyan-300 hover:text-white border border-cyan-800/60 hover:border-cyan-400/80 shadow-lg shadow-cyan-950/40 backdrop-blur-md text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-cyan-400" />
        <span>{targetLabel || 'Back'}</span>
        <span className="text-[10px] text-slate-400 border-l border-slate-700/80 pl-2 ml-0.5 flex items-center gap-1 group-hover:text-cyan-200">
          <Home className="w-3 h-3" />
        </span>
      </button>
    </div>
  );
};
