import React from 'react';
import {
  ArrowLeft,
  Ship,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  FileText,
  Database,
  ArrowRight,
} from 'lucide-react';
import { EXPEDITIONS, RESEARCH_REPORTS, DATASETS } from '../data/mockData';
import { ViewMode } from '../types';

interface ExpeditionDetailViewProps {
  expeditionId?: string;
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const ExpeditionDetailView: React.FC<ExpeditionDetailViewProps> = ({
  expeditionId,
  onNavigate,
}) => {
  const expedition = EXPEDITIONS.find((e) => e.id === expeditionId) || EXPEDITIONS[0];

  const relatedReports = RESEARCH_REPORTS.filter((r) =>
    (expedition?.relatedResearchIds || []).includes(r.id)
  );
  const relatedDatasets = DATASETS.filter((d) =>
    (expedition?.relatedDatasetIds || []).includes(d.id)
  );

  return (
    <div id="expedition-detail-view" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('expeditions')}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Expeditions</span>
      </button>

      {/* Hero Header */}
      <div className="space-y-4 border-b border-cyan-950 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60">
            {expedition.code}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
            {expedition.status}
          </span>
          <span className="text-xs text-slate-400">{expedition.year}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
          {expedition.name}
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {expedition.description}
        </p>
      </div>

      {/* Image & Quick Logistics Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-2xl overflow-hidden h-72 border border-cyan-900/60 shadow-xl">
          <img src={expedition.imageUrl} alt={expedition.name} className="w-full h-full object-cover" />
        </div>

        <div className="p-5 rounded-2xl bg-[#08172c] border border-cyan-900/60 space-y-3.5 text-xs text-slate-300">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider font-['Outfit']">
            Mission Telemetry
          </h3>

          <div>
            <span className="text-slate-500 font-medium">Expedition Vessel</span>
            <div className="font-bold text-white mt-0.5">{expedition.vessel}</div>
          </div>

          <div>
            <span className="text-slate-500 font-medium">Scientific Leader</span>
            <div className="font-bold text-white mt-0.5">{expedition.leader}</div>
          </div>

          <div>
            <span className="text-slate-500 font-medium">Coordinating Agency</span>
            <div className="font-bold text-white mt-0.5">{expedition.institution}</div>
          </div>

          <div>
            <span className="text-slate-500 font-medium">Stations & Bases</span>
            <div className="font-bold text-cyan-300 mt-0.5">{expedition.stations.join(' • ')}</div>
          </div>

          <div>
            <span className="text-slate-500 font-medium">Coordinates</span>
            <div className="font-mono text-cyan-400 mt-0.5">{expedition.coordinates}</div>
          </div>
        </div>
      </div>

      {/* Objectives & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#08172c] border border-cyan-900/60 space-y-3">
          <h3 className="font-bold text-white text-base font-['Outfit']">Core Mission Objectives</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {(expedition?.objectives || []).map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-[#08172c] border border-emerald-900/40 space-y-3">
          <h3 className="font-bold text-white text-base font-['Outfit']">Key Achievements</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {(expedition?.achievements || []).map((ach, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Expedition Chronological Timeline */}
      <div className="p-6 rounded-2xl bg-[#08172c] border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base font-['Outfit']">Expedition Voyage Timeline</h3>
        <div className="relative border-l border-cyan-800/60 ml-3 space-y-6 py-2">
          {(expedition?.timeline || []).map((step, idx) => (
            <div key={idx} className="relative pl-6">
              <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
              <div className="text-xs font-bold text-cyan-300">{step.date}</div>
              <div className="text-xs text-slate-200 mt-0.5">{step.event}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Research & Datasets */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-base font-['Outfit']">
          Derived Publications & Open Datasets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedReports.map((r) => (
            <div
              key={r.id}
              onClick={() => onNavigate('report-detail', r.id)}
              className="p-4 rounded-xl bg-[#08172c] hover:bg-cyan-950/60 border border-cyan-900 hover:border-cyan-400 cursor-pointer flex items-center justify-between transition-all group"
            >
              <div>
                <div className="text-[10px] font-bold text-cyan-400 uppercase">Research Paper</div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-200 mt-1">
                  {r.title}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
            </div>
          ))}

          {relatedDatasets.map((d) => (
            <div
              key={d.id}
              onClick={() => onNavigate('dataset-detail', d.id)}
              className="p-4 rounded-xl bg-[#08172c] hover:bg-cyan-950/60 border border-cyan-900 hover:border-cyan-400 cursor-pointer flex items-center justify-between transition-all group"
            >
              <div>
                <div className="text-[10px] font-bold text-cyan-400 uppercase">Scientific Dataset</div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-200 mt-1">
                  {d.title}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
