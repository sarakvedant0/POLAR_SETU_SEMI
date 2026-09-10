import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { AIVerificationSummary } from '../types';

interface AIVerificationCardProps {
  summary: AIVerificationSummary;
  compact?: boolean;
}

export const AIVerificationCard: React.FC<AIVerificationCardProps> = ({ summary, compact = false }) => {
  const [expanded, setExpanded] = useState(!compact);

  const getStatusBadge = () => {
    switch (summary.batchStatus) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 shadow-sm shadow-emerald-950">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI BATCH: VERIFIED</span>
          </span>
        );
      case 'PARTIALLY_VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/90 text-amber-300 border border-amber-500/60 shadow-sm shadow-amber-950">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>AI BATCH: PARTIALLY VERIFIED</span>
          </span>
        );
      case 'UNVERIFIED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-500/60 shadow-sm shadow-rose-950">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>AI BATCH: UNVERIFIED</span>
          </span>
        );
    }
  };

  return (
    <div
      id="ai-cross-verification-card"
      className="rounded-2xl bg-[#061426]/90 border border-cyan-500/30 overflow-hidden shadow-xl"
    >
      {/* Top Banner */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900/40 border-b border-cyan-900/50">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-600/50 flex items-center justify-center text-cyan-300">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-['Outfit']">
                Multi-Model AI Consensus Audit
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {summary.consensusScore}% Match
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Google Gemini • Claude • GPT-4o • DeepSeek</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <button
            onClick={() => setExpanded(!expanded)}
            aria-label="Toggle model breakdown"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Summary Body */}
      <div className="p-4 sm:p-5 space-y-4">
        <p className="text-xs text-slate-300 leading-relaxed bg-[#040e1b] p-3 rounded-xl border border-cyan-950">
          {summary.summary}
        </p>

        {/* Model-by-Model Breakdown */}
        {expanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {summary.modelAudits.map((audit) => {
              const isHigh = audit.confidenceScore >= 80;
              const isMed = audit.confidenceScore >= 50 && audit.confidenceScore < 80;
              return (
                <div
                  key={audit.model}
                  className="p-3 rounded-xl bg-[#040e1b]/80 border border-slate-800/80 space-y-2 hover:border-cyan-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{audit.model}</span>
                    </span>
                    <span
                      className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                        isHigh
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/40'
                          : isMed
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-700/40'
                          : 'bg-rose-950/60 text-rose-300 border border-rose-700/40'
                      }`}
                    >
                      {audit.confidenceScore}% • {audit.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-normal">
                    {audit.reasoning}
                  </p>

                  {audit.citations && audit.citations.length > 0 && (
                    <div className="text-[10px] text-cyan-400/90 pt-1 border-t border-slate-800 flex flex-wrap gap-2">
                      <span className="text-slate-500">Grounded in:</span>
                      {audit.citations.map((c, i) => (
                        <span key={i} className="underline decoration-dotted underline-offset-2">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-cyan-950">
          <span>Cross-Verification Engine v2.4 (NCPOR Grounding)</span>
          <span>Verified: {summary.verifiedAt}</span>
        </div>
      </div>
    </div>
  );
};
