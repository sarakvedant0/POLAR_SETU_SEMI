import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  XCircle,
  HelpCircle,
  Bell,
  Check,
  Calendar,
  UserCheck,
  FileText,
  Clock,
  Share2,
} from 'lucide-react';
import { polarDataService } from '../services/dataService';
import { ClaimStatus, ViewMode } from '../types';

interface ClaimDetailViewProps {
  claimId?: string;
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const ClaimDetailView: React.FC<ClaimDetailViewProps> = ({ claimId, onNavigate }) => {
  const claims = polarDataService.getClaims();
  const claim = claims.find((c) => c.id === claimId) || claims[0];

  const [isWatching, setIsWatching] = useState(false);
  const [watchCount, setWatchCount] = useState(claim.watchCount);

  const toggleWatch = () => {
    if (isWatching) {
      setIsWatching(false);
      setWatchCount(watchCount - 1);
    } else {
      setIsWatching(true);
      setWatchCount(watchCount + 1);
    }
  };

  const getStatusBadge = (status: ClaimStatus | string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-500 text-emerald-300">
            <ShieldCheck className="w-4 h-4" />
            <span>VERIFIED BY SCIENTIFIC CONSENSUS</span>
          </span>
        );
      case 'PARTIALLY_SUPPORTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950 border border-amber-500 text-amber-300">
            <AlertCircle className="w-4 h-4" />
            <span>PARTIALLY SUPPORTED (REGIONAL VARIATION)</span>
          </span>
        );
      case 'CONTRADICTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950 border border-rose-500 text-rose-300">
            <XCircle className="w-4 h-4" />
            <span>CONTRADICTED BY EMPIRICAL DATA (MYTH)</span>
          </span>
        );
      case 'UNVERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300">
            <HelpCircle className="w-4 h-4" />
            <span>UNVERIFIED (AWAITING NEW EXPEDITION DATA)</span>
          </span>
        );
    }
  };

  return (
    <div id="claim-detail-view" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('claims')}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Claims</span>
      </button>

      {/* Claim Title Banner */}
      <div className="p-8 rounded-3xl bg-[#08182f] border border-cyan-800/80 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {getStatusBadge(claim.status)}

          {/* Evidence Watch Button */}
          <button
            id="claim-watch-evidence-btn"
            onClick={toggleWatch}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              isWatching
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                : 'bg-[#091f3d] hover:bg-[#0e2a52] text-cyan-300 border-cyan-700/60'
            }`}
          >
            {isWatching ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            <span>{isWatching ? 'Watching for New Evidence' : 'Watch This Claim'}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-950/60 text-[10px]">
              {watchCount}
            </span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-['Outfit']">
          "{claim.claimText}"
        </h1>

        <p className="text-slate-200 text-sm leading-relaxed">{claim.explanation}</p>

        {/* Auditor & Confidence Score Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Audited by:</span>
            <span className="text-white font-semibold">{claim.reviewer}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Review Date: {claim.reviewDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">Confidence Index: {claim.confidenceScore}%</span>
          </div>
        </div>
      </div>

      {/* Section: Scientific Audit History Timeline */}
      <div className="p-6 rounded-2xl bg-[#08172c] border border-slate-800 space-y-4 shadow-lg">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider font-['Outfit']">
            Scientific Audit & Evolution History
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Status history is permanent and auditable. Scientific claims are dynamically updated as new peer-reviewed datasets and expedition reports emerge.
        </p>

        <div className="relative border-l border-cyan-800/60 ml-3 space-y-6 pt-2">
          {(claim?.scientificHistory || []).map((h, i) => (
            <div key={i} className="relative pl-6">
              <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-cyan-300 font-mono">{h.year}</span>
                <span className="text-xs font-bold text-white">{h.stage}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {h.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{h.notes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Grounding Evidence Records */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white font-['Outfit']">
          Observed Evidence & Measurements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(claim?.evidenceList || []).map((ev, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#08172c] border border-cyan-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {ev.type}
                </span>
                <span className="text-[10px] text-slate-400">{ev.date}</span>
              </div>
              <div className="text-sm font-bold text-white">{ev.title}</div>
              <div className="text-xs text-slate-300 font-mono pt-2 border-t border-slate-800">
                Source Repository: {ev.source}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Supporting vs Conflicting Research */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#08172c] border border-emerald-900/40 space-y-3">
          <h3 className="font-bold text-white text-base font-['Outfit'] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Supporting Scientific Literature</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {(claim?.supportingResearch || []).map((res, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>{res}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-[#08172c] border border-amber-900/40 space-y-3">
          <h3 className="font-bold text-white text-base font-['Outfit'] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Conflicting Literature or Nuance</span>
          </h3>
          {(claim?.conflictingResearch || []).length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-300">
              {(claim?.conflictingResearch || []).map((res, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span>{res}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No significant conflicting evidence was identified in the available peer-reviewed repository.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
