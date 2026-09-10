import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  ArrowRight,
  Search,
  Bell,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { CLAIMS } from '../data/mockData';
import { ClaimStatus, ClaimVerification, ViewMode } from '../types';

interface ClaimsViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const ClaimsView: React.FC<ClaimsViewProps> = ({ onNavigate }) => {
  const [activeStatus, setActiveStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const statuses = [
    { id: 'ALL', label: 'All Claims' },
    { id: 'VERIFIED', label: 'Verified', color: 'emerald' },
    { id: 'PARTIALLY_SUPPORTED', label: 'Partially Supported', color: 'amber' },
    { id: 'CONTRADICTED', label: 'Contradicted (Myths)', color: 'rose' },
    { id: 'UNVERIFIED', label: 'Unverified', color: 'slate' },
  ];

  const filtered = CLAIMS.filter((c) => {
    const matchStatus = activeStatus === 'ALL' || c.status === activeStatus;
    const matchSearch =
      search === '' ||
      c.claimText.toLowerCase().includes(search.toLowerCase()) ||
      c.explanation.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: ClaimStatus | string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 border border-emerald-500/60 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified</span>
          </span>
        );
      case 'PARTIALLY_SUPPORTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 border border-amber-500/60 text-amber-300">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Partially Supported</span>
          </span>
        );
      case 'CONTRADICTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/80 border border-rose-500/60 text-rose-300">
            <XCircle className="w-3.5 h-3.5" />
            <span>Contradicted (Myth)</span>
          </span>
        );
      case 'UNVERIFIED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Unverified</span>
          </span>
        );
    }
  };

  return (
    <div id="claims-view-container" className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 border border-amber-700/50 text-amber-300 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Rigorous Scientific Fact-Checking</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Polar Myths & Scientific Claim Verification
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Audit public and media assertions against peer-reviewed literature, satellite telemetry, and expedition field observations. Note: Unverified does not mean false.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search claims or myths..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08172c] border border-cyan-900 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {statuses.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveStatus(s.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeStatus === s.id
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Claims List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((claim) => (
          <div
            key={claim.id}
            id={`claim-card-${claim.id}`}
            onClick={() => onNavigate('claim-detail', claim.id)}
            className="p-6 rounded-2xl bg-[#08172c]/90 hover:bg-[#0c2242] border border-cyan-900/60 hover:border-cyan-400/80 transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer group shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {claim.category}
                </span>
                {getStatusBadge(claim.status)}
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors font-['Outfit']">
                "{claim.claimText}"
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {claim.explanation}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Bell className="w-3.5 h-3.5" />
                <span>{claim.watchCount} Watching for New Evidence</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-300 group-hover:translate-x-1 transition-transform">
                <span>Audit & History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
