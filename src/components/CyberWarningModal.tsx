import React from 'react';
import { ShieldAlert, AlertTriangle, X, CheckCircle, Lock } from 'lucide-react';
import { CyberCheckResult } from '../services/cyberSafetyService';

interface CyberWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CyberCheckResult | null;
  strikesCount?: number;
}

export const CyberWarningModal: React.FC<CyberWarningModalProps> = ({
  isOpen,
  onClose,
  result,
  strikesCount = 1,
}) => {
  if (!isOpen || !result) return null;

  return (
    <div
      id="cyber-warning-modal-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="cyber-warning-modal-card"
        className="relative w-full max-w-lg rounded-3xl bg-[#0b1329] border-2 border-rose-500/70 shadow-2xl shadow-rose-950/70 p-6 sm:p-7 space-y-5 overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Icon */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/90 border border-rose-500/50 flex items-center justify-center text-rose-400 flex-shrink-0 shadow-lg shadow-rose-950/50">
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-900/60 text-rose-300 border border-rose-500/50">
                  {result.severity || 'SECURITY'} VIOLATION
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {result.ruleTriggered || 'POLARSETU-CYBER-SEC'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white font-['Outfit'] mt-1">
                Content Discarded by Safety Filter
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close warning"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reason Banner */}
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{result.reason || 'Unusual or Prohibited Activity Detected'}</span>
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed">
            {result.details ||
              'Your submission contained prohibited terms, abusive language, or unusual cyber patterns that violate NCPOR scientific safety regulations.'}
          </p>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Platform Cyber Monitoring Status</span>
            </span>
            <span className="text-rose-400 font-mono font-bold">
              Strike {strikesCount} / 3
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">
            To protect researchers and scientific discourse, all uploads are inspected by automated cyber scanners. Continued violations may result in temporary account restrictions.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            id="acknowledge-warning-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs tracking-wide shadow-lg shadow-rose-950/60 transition-all cursor-pointer"
          >
            I Understand — Return to Page
          </button>
        </div>
      </div>
    </div>
  );
};
