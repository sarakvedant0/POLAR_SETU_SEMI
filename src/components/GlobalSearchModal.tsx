import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  FileText,
  Ship,
  Database,
  User,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import {
  RESEARCH_REPORTS,
  EXPEDITIONS,
  DATASETS,
  SCIENTISTS,
  CLAIMS,
  POLAR_FACTS,
} from '../data/mockData';
import { ViewMode } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewMode, id?: string) => void;
  initialQuery?: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredResearch = RESEARCH_REPORTS.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.abstract.toLowerCase().includes(q) ||
      r.researchArea.toLowerCase().includes(q)
  );

  const filteredExpeditions = EXPEDITIONS.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.code.toLowerCase().includes(q) ||
      e.region.toLowerCase().includes(q)
  );

  const filteredDatasets = DATASETS.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.parameter.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
  );

  const filteredScientists = SCIENTISTS.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.bio.toLowerCase().includes(q) ||
      s.specialization.some((sp) => sp.toLowerCase().includes(q))
  );

  const filteredClaims = CLAIMS.filter(
    (c) => c.claimText.toLowerCase().includes(q) || c.explanation.toLowerCase().includes(q)
  );

  const filteredFacts = POLAR_FACTS.filter(
    (f) => f.statement.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
  );

  const handleSelect = (view: ViewMode, id?: string) => {
    onNavigate(view, id);
    onClose();
  };

  return (
    <div
      id="global-search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#030814]/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        id="global-search-dialog"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-[#08172c] border border-cyan-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-slate-200"
      >
        {/* Top Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-cyan-900/60 bg-[#0a1c36]">
          <Search className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search research, reports, expeditions, scientists, datasets, facts and claims..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-md bg-slate-800/60"
          >
            ESC
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-cyan-950 bg-[#061224] overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'research', label: `Research (${filteredResearch.length})` },
            { id: 'expeditions', label: `Expeditions (${filteredExpeditions.length})` },
            { id: 'datasets', label: `Datasets (${filteredDatasets.length})` },
            { id: 'claims', label: `Claims (${filteredClaims.length})` },
            { id: 'scientists', label: `Scientists (${filteredScientists.length})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                activeFilter === f.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Research Results */}
          {(activeFilter === 'all' || activeFilter === 'research') &&
            filteredResearch.length > 0 && (
              <div>
                <div className="text-xs font-bold text-cyan-400 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Research & Publications</span>
                </div>
                <div className="space-y-1.5">
                  {filteredResearch.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => handleSelect('report-detail', r.id)}
                      className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between group transition-all"
                    >
                      <div className="pr-3">
                        <div className="text-xs font-semibold text-white group-hover:text-cyan-200">
                          {r.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {r.researchArea} • {r.date} • {r.institution}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Expeditions Results */}
          {(activeFilter === 'all' || activeFilter === 'expeditions') &&
            filteredExpeditions.length > 0 && (
              <div>
                <div className="text-xs font-bold text-cyan-400 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                  <Ship className="w-3.5 h-3.5" />
                  <span>Polar Expeditions</span>
                </div>
                <div className="space-y-1.5">
                  {filteredExpeditions.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => handleSelect('expedition-detail', e.id)}
                      className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between group transition-all"
                    >
                      <div className="pr-3">
                        <div className="text-xs font-semibold text-white group-hover:text-cyan-200">
                          {e.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {e.year} • Vessel: {e.vessel}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Datasets Results */}
          {(activeFilter === 'all' || activeFilter === 'datasets') && filteredDatasets.length > 0 && (
            <div>
              <div className="text-xs font-bold text-cyan-400 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>Cryospheric Datasets</span>
              </div>
              <div className="space-y-1.5">
                {filteredDatasets.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelect('dataset-detail', d.id)}
                    className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between group transition-all"
                  >
                    <div className="pr-3">
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-200">
                        {d.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {d.parameter} • {d.timeframe} • {d.format}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Claims Results */}
          {(activeFilter === 'all' || activeFilter === 'claims') && filteredClaims.length > 0 && (
            <div>
              <div className="text-xs font-bold text-amber-400 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Claims & Verification Checks</span>
              </div>
              <div className="space-y-1.5">
                {filteredClaims.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect('claim-detail', c.id)}
                    className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between group transition-all"
                  >
                    <div className="pr-3">
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-200">
                        "{c.claimText}"
                      </div>
                      <div className="text-[11px] text-amber-300 mt-0.5 font-medium">
                        Status: {c.status} • {c.category}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {filteredResearch.length === 0 &&
            filteredExpeditions.length === 0 &&
            filteredDatasets.length === 0 &&
            filteredClaims.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                <p className="text-sm">No polar science results found for "{query}".</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching for "Antarctica", "Ice Core", "Maitri", "Melt", or "Penguins".
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
