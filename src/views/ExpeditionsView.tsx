import React, { useState } from 'react';
import { Ship, Calendar, MapPin, User, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { EXPEDITIONS } from '../data/mockData';
import { ViewMode } from '../types';

interface ExpeditionsViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const ExpeditionsView: React.FC<ExpeditionsViewProps> = ({ onNavigate }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [search, setSearch] = useState('');

  const regions = ['All', 'Antarctica', 'Arctic', 'Southern Ocean'];

  const filtered = EXPEDITIONS.filter((e) => {
    const matchRegion =
      selectedRegion === 'All' ||
      e.region.toLowerCase().includes(selectedRegion.toLowerCase());
    const matchSearch =
      search === '' ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.vessel.toLowerCase().includes(search.toLowerCase()) ||
      e.leader.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchSearch;
  });

  return (
    <div id="expeditions-view-container" className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 mb-2">
            <Ship className="w-3.5 h-3.5" />
            <span>44+ Historic & Modern Missions</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            India’s Polar Expeditions
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            From the historic 1981 voyage to ongoing missions across the Arctic, Antarctic, and Southern Ocean by the Ministry of Earth Sciences.
          </p>
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedRegion === r
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Expeditions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((exp) => (
          <div
            key={exp.id}
            id={`expedition-card-${exp.id}`}
            onClick={() => onNavigate('expedition-detail', exp.id)}
            className="group flex flex-col justify-between bg-[#08172c]/90 hover:bg-[#0d2547] border border-cyan-900/60 hover:border-cyan-400/80 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/60 cursor-pointer"
          >
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img
                src={exp.imageUrl}
                alt={exp.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-950/85 backdrop-blur-md border border-cyan-600/40 text-cyan-200">
                  {exp.code}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/85 backdrop-blur-md border border-emerald-600/40 text-emerald-300">
                  {exp.status}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 text-xs font-bold text-white bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg">
                {exp.year}
              </div>
            </div>

            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors font-['Outfit']">
                  {exp.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {exp.description}
                </p>
              </div>

              <div className="text-xs text-slate-300 space-y-1.5 border-t border-slate-800/80 pt-3">
                <div className="flex items-center gap-2">
                  <Ship className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="text-slate-400">Vessel:</span>
                  <span className="font-semibold text-white">{exp.vessel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="text-slate-400">Leader:</span>
                  <span className="font-semibold text-white">{exp.leader}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="text-slate-400">Region:</span>
                  <span className="font-semibold text-slate-200 line-clamp-1">{exp.region}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 border-t border-slate-800/80 pt-3">
                <span>View Expedition Log</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
