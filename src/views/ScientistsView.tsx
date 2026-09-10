import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Award,
  BookOpen,
  Mail,
  Search,
  ExternalLink,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { SCIENTISTS } from '../data/mockData';
import { Scientist, ViewMode } from '../types';

interface ScientistsViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const ScientistsView: React.FC<ScientistsViewProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');

  const filtered = SCIENTISTS.filter(
    (s) =>
      search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.institution.toLowerCase().includes(search.toLowerCase()) ||
      s.specialization.some((sp) => sp.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div id="scientists-view-container" className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Official Scientific Roster</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Indian Polar Scientists & Expedition Leaders
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Directory of lead investigators, glaciologists, atmospheric physicists, and marine biologists representing India across polar missions.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search researchers by name or field..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08172c] border border-cyan-900 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Scientists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((scientist) => (
          <div
            key={scientist.id}
            className="p-6 rounded-3xl bg-[#08172c]/90 border border-cyan-900/60 hover:border-cyan-400/80 transition-all duration-300 flex flex-col justify-between gap-5 shadow-xl group"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={scientist.avatar}
                  alt={scientist.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400/60 group-hover:border-cyan-300 transition-all shadow-md"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-white font-['Outfit']">
                      {scientist.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xs text-cyan-300 font-medium">{scientist.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {scientist.institution}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {scientist.bio}
              </p>

              {/* Specializations */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {(scientist.specialization || []).map((spec, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#051122] text-slate-300 border border-slate-800"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics and Publications */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{scientist.publicationsCount} Publications</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                  <span>
                    {Array.isArray(scientist.expeditions)
                      ? scientist.expeditions.length
                      : (scientist.expeditionsCount || scientist.expeditions || 0)}{' '}
                    Expeditions
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('reports')}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-cyan-950 text-cyan-300 hover:text-cyan-200 border border-slate-800 hover:border-cyan-700/60 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Authored Research</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
