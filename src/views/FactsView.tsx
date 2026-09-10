import React, { useState } from 'react';
import { CheckCircle2, Share2, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { POLAR_FACTS } from '../data/mockData';
import { ViewMode } from '../types';

interface FactsViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const FactsView: React.FC<FactsViewProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Freshwater', 'Climate', 'Ice', 'India & Polar Research'];

  const filtered = POLAR_FACTS.filter(
    (f) => selectedCategory === 'All' || f.category === selectedCategory
  );

  const handleShare = (f: any) => {
    navigator.clipboard?.writeText?.(`POLARSETU Fact: ${f.statement} (Source: ${f.source})`);
    setCopiedId(f.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div id="facts-view-container" className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Verified Polar Science Insights</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
          Polar Facts: Did You Know?
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-xl">
          Bite-sized, empirically verified polar science discoveries from Indian Antarctic & Arctic expeditions designed for public understanding.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === c
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Facts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((fact) => (
          <div
            key={fact.id}
            className="p-6 rounded-3xl bg-[#08172c]/90 border border-cyan-900/60 hover:border-cyan-400/80 transition-all duration-300 flex flex-col justify-between gap-5 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {fact.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 border border-emerald-500/60 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-white leading-snug font-['Outfit']">
                "{fact.statement}"
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">{fact.explanation}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-400 font-mono text-[11px]">
                Source: <span className="text-slate-200">{fact.source}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(fact)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                >
                  <Share2 className="w-3 h-3" />
                  <span>{copiedId === fact.id ? 'Copied!' : 'Share'}</span>
                </button>

                <button
                  onClick={() => onNavigate('quiz')}
                  className="px-3 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold"
                >
                  <span>Test on Quiz</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
