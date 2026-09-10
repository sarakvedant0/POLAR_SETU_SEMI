import React, { useState, useEffect } from 'react';
import {
  FileText,
  Filter,
  Eye,
  MessageSquare,
  Bookmark,
  ArrowRight,
  Search,
  Sparkles,
  Ship,
  Building2,
  Database,
  Plus,
  ShieldAlert,
} from 'lucide-react';
import { polarDataService } from '../services/dataService';
import { ResearchReport, ViewMode } from '../types';

interface ReportsViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onNavigate }) => {
  const [reports, setReports] = useState<ResearchReport[]>(polarDataService.getReports());
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = polarDataService.subscribe(() => {
      setReports(polarDataService.getReports());
    });
    return unsub;
  }, []);

  const areas = [
    'All',
    'Climate Science',
    'Marine Biology',
    'Ecology',
    'Earth Science',
  ];

  const regions = ['All', 'Antarctica', 'Arctic', 'Southern Ocean'];

  const filtered = reports.filter((r) => {
    const matchArea = selectedArea === 'All' || r.researchArea === selectedArea;
    const matchRegion = selectedRegion === 'All' || r.region === selectedRegion;
    const matchQuery =
      searchQuery === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchArea && matchRegion && matchQuery;
  });

  return (
    <div id="reports-view-container" className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Peer-Reviewed Science Stories</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Trending Scientific Reports
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Read comprehensive scientific narratives synthesized from Indian Antarctic & Arctic expeditions with AI summaries and verifiable evidence chains.
          </p>
        </div>

        {/* Search & Admin Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/60 text-xs font-bold text-cyan-300 shadow-md transition-all cursor-pointer whitespace-nowrap"
            title="Open Editorial Console to publish or edit scientific reports"
          >
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Admin Editorial</span>
          </button>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter research stories..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08172c] border border-cyan-900 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold mr-1">Research Area:</span>
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedArea === area
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Region:</span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#08172c] border border-cyan-900 text-xs text-slate-200 focus:outline-none"
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((report) => (
          <div
            key={report.id}
            id={`report-card-${report.id}`}
            onClick={() => onNavigate('report-detail', report.id)}
            className="group flex flex-col justify-between bg-[#08172c]/90 hover:bg-[#0d2547] border border-cyan-900/60 hover:border-cyan-400/80 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/60 cursor-pointer"
          >
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img
                src={report.imageUrl}
                alt={report.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-950/85 backdrop-blur-md border border-cyan-600/40 text-cyan-200">
                  {report.researchArea}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/85 backdrop-blur-md border border-slate-700 text-slate-300">
                  {report.region}
                </span>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors line-clamp-2 leading-snug font-['Outfit']">
                  {report.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {report.abstract}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 border-t border-slate-800/80 pt-3">
                <div className="text-slate-300 font-medium line-clamp-1">
                  {report.authors.join(', ')}
                </div>
                <div className="text-slate-500 line-clamp-1">{report.institution}</div>
              </div>

              {/* Real Live Metrics Bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-slate-400" title="Live Views">
                    <Eye className="w-3 h-3 text-cyan-400" />
                    <span className="font-mono">{report.views || '0'}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-400" title="Peer Comments">
                    <MessageSquare className="w-3 h-3 text-cyan-400" />
                    <span className="font-mono">{report.comments || 0}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-400" title="Bookmarks / Citations">
                    <Bookmark className="w-3 h-3 text-cyan-400" />
                    <span className="font-mono">{report.citations || 0}</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">{report.date}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 border-t border-slate-800/80 pt-3">
                <div className="flex items-center gap-1.5">
                  {report.footerLinkType === 'expedition' && <Ship className="w-3.5 h-3.5" />}
                  {report.footerLinkType === 'station' && <Building2 className="w-3.5 h-3.5" />}
                  {report.footerLinkType === 'dataset' && <Database className="w-3.5 h-3.5" />}
                  <span>{report.expedition}</span>
                </div>
                <div className="flex items-center gap-1 text-cyan-300">
                  <span>Read Story</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
