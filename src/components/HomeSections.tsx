import React, { useState } from 'react';
import {
  ArrowRight,
  Eye,
  MessageSquare,
  Bookmark,
  Ship,
  Building2,
  Database,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ExternalLink,
  BookOpen,
  Image as ImageIcon,
  Compass,
} from 'lucide-react';
import { ResearchReport, Expedition, PolarFact, ClaimVerification, ViewMode } from '../types';
import { RESEARCH_REPORTS, EXPEDITIONS, POLAR_FACTS, CLAIMS } from '../data/mockData';
import { Holographic3DCube } from './3d/Holographic3DCube';

interface HomeSectionsProps {
  reports?: ResearchReport[];
  expeditions?: Expedition[];
  facts?: PolarFact[];
  claims?: ClaimVerification[];
  onNavigate: (view: ViewMode, id?: string) => void;
  onOpenAIQuery?: (query: string) => void;
  onAskAI?: (query: string) => void;
}

export const HomeSections: React.FC<HomeSectionsProps> = ({
  reports = RESEARCH_REPORTS,
  expeditions = EXPEDITIONS,
  facts = POLAR_FACTS,
  claims = CLAIMS,
  onNavigate,
  onOpenAIQuery,
  onAskAI,
}) => {
  const [factIndex, setFactIndex] = useState(0);
  const [claimIndex, setClaimIndex] = useState(0);
  const [expeditionIndex, setExpeditionIndex] = useState(0);

  const safeReports = reports || [];
  const safeExpeditions = expeditions || [];
  const safeFacts = facts || [];
  const safeClaims = claims || [];

  const currentFact = safeFacts.length > 0 ? safeFacts[factIndex % safeFacts.length] : null;
  const currentClaim = safeClaims.length > 0 ? safeClaims[claimIndex % safeClaims.length] : null;
  const currentExpedition = safeExpeditions.length > 0 ? safeExpeditions[expeditionIndex % safeExpeditions.length] : null;

  return (
    <div
      id="home-content-sections"
      className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* ====================================================
          TOP PORTAL DIRECTORY: SPREAD ALL WEBPAGES WITH ZERO OVERLAP
      ==================================================== */}
      <section id="polar-webpages-spread-section" className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2 font-['Outfit']">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>Polar Scientific Portals & Webpages</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore India's open polar repositories, visual media archives, expeditions, and climate datasets.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-300/80 self-start sm:self-auto px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60">
            6 Specialized Portals
          </span>
        </div>

        {/* 6 Broad Spaced Portal Cards (Zero Overlap, Extra Space) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Card 1: Scientific Datasets */}
          <div
            id="portal-card-datasets"
            onClick={() => onNavigate('datasets')}
            className="group flex flex-col justify-between p-4 rounded-2xl bg-black/90 hover:bg-white/10 border border-white/15 hover:border-white/50 transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 flex items-center justify-center -ml-2 -mt-2 group-hover:scale-110 transition-transform">
                <Holographic3DCube
                  icon={Database}
                  size={32}
                  color="#38bdf8"
                  enableDrag={false}
                  autoRotateSpeed={10}
                />
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40 text-[9px] font-mono font-bold text-cyan-300">WEBPAGE</span>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Open Data</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-200 mt-1 font-['Outfit']">
                Datasets
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                40+ years of ice cores, ocean salinity, and atmospheric weather records.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-300 font-medium">
              <span>85+ Repositories</span>
              <span className="text-[10px] text-slate-500">Access →</span>
            </div>
          </div>

          {/* Card 2: Media & Visuals */}
          <div
            id="portal-card-media"
            onClick={() => onNavigate('media')}
            className="group flex flex-col justify-between p-4 rounded-2xl bg-black/90 hover:bg-white/10 border border-white/15 hover:border-white/50 transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 flex items-center justify-center -ml-2 -mt-2 group-hover:scale-110 transition-transform">
                <Holographic3DCube
                  icon={ImageIcon}
                  size={32}
                  color="#38bdf8"
                  enableDrag={false}
                  autoRotateSpeed={9}
                />
              </div>
              <ArrowRight className="w-4 h-4 text-sky-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded bg-sky-950/80 border border-sky-500/40 text-[9px] font-mono font-bold text-sky-300">WEBPAGE</span>
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">Visuals</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-200 mt-1 font-['Outfit']">
                Media Archive
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Documentary footage, satellite composites, and polar expedition photos.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-sky-300 font-medium">
              <span>12,000+ Items</span>
              <span className="text-[10px] text-slate-500">Browse →</span>
            </div>
          </div>

          {/* Card 3: Research & Publications */}
          <div
            id="portal-card-research"
            onClick={() => onNavigate('reports')}
            className="group flex flex-col justify-between p-4 rounded-2xl bg-black/90 hover:bg-white/10 border border-white/15 hover:border-white/50 transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 flex items-center justify-center -ml-2 -mt-2 group-hover:scale-110 transition-transform">
                <Holographic3DCube
                  icon={BookOpen}
                  size={32}
                  color="#34d399"
                  enableDrag={false}
                  autoRotateSpeed={11}
                />
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-mono font-bold text-emerald-300">WEBPAGE</span>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Literature</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-200 mt-1 font-['Outfit']">
                Research
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Studies on accelerated glacier melting, krill ecosystems, and ozone.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-emerald-300 font-medium">
              <span>540+ Papers</span>
              <span className="text-[10px] text-slate-500">Read →</span>
            </div>
          </div>

          {/* Card 4: Polar Expeditions */}
          <div
            id="portal-card-expeditions"
            onClick={() => onNavigate('expeditions')}
            className="group flex flex-col justify-between p-4 rounded-2xl bg-black/90 hover:bg-white/10 border border-white/15 hover:border-white/50 transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 flex items-center justify-center -ml-2 -mt-2 group-hover:scale-110 transition-transform">
                <Holographic3DCube
                  icon={Ship}
                  size={32}
                  color="#fbbf24"
                  enableDrag={false}
                  autoRotateSpeed={12}
                />
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-[9px] font-mono font-bold text-amber-300">WEBPAGE</span>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Missions</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-200 mt-1 font-['Outfit']">
                Expeditions
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                44 Indian expeditions, Dakshin Gangotri, Maitri, Bharati, and Himadri.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-amber-300 font-medium">
              <span>44+ Voyages</span>
              <span className="text-[10px] text-slate-500">Track →</span>
            </div>
          </div>

          {/* Card 5: Polar AI - HIGHLIGHTED */}
          <div
            id="portal-card-ai"
            onClick={() => onNavigate('ai')}
            className="group flex flex-col justify-between p-4 rounded-2xl bg-black/95 hover:bg-white/10 border-2 border-white/30 hover:border-white/60 transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 flex items-center justify-center -ml-2 -mt-2 group-hover:scale-110 transition-transform">
                <Holographic3DCube
                  icon={Sparkles}
                  size={34}
                  color="#22d3ee"
                  enableDrag={false}
                  autoRotateSpeed={8}
                />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black font-mono tracking-tight shadow-md flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>POLAR AI</span>
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-200 text-[9px] font-mono font-bold">WEBPAGE</span>
                <span className="text-[11px] font-black text-cyan-300 uppercase tracking-wider">AI Assistant</span>
              </div>
              <h3 className="text-base font-extrabold text-cyan-100 group-hover:text-white mt-1 font-['Outfit']">
                Polar AI
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Interactive queries grounded in peer-reviewed polar scientific literature.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-cyan-800/80 flex items-center justify-between text-[11px] text-cyan-300 font-bold">
              <span>Interactive Chat</span>
              <span className="text-[10px] text-cyan-400 font-mono">Launch →</span>
            </div>
          </div>

          {/* Card 6: Evidence & Fact-Checks - HIGHLIGHTED */}
          <div
            id="portal-card-claims"
            onClick={() => onNavigate('claims')}
            className="group flex flex-col justify-between p-4 rounded-2xl bg-black/95 hover:bg-white/10 border-2 border-white/30 hover:border-white/60 transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 flex items-center justify-center -ml-2 -mt-2 group-hover:scale-110 transition-transform">
                <Holographic3DCube
                  icon={CheckCircle2}
                  size={34}
                  color="#34d399"
                  enableDrag={false}
                  autoRotateSpeed={10}
                />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black font-mono tracking-tight shadow-md flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>EVIDENCE</span>
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded bg-emerald-400/20 text-emerald-200 text-[9px] font-mono font-bold">WEBPAGE</span>
                <span className="text-[11px] font-black text-emerald-300 uppercase tracking-wider">Fact-Checks</span>
              </div>
              <h3 className="text-base font-extrabold text-emerald-100 group-hover:text-white mt-1 font-['Outfit']">
                Evidence & Claims
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Evidence-based audits debunking common misconceptions about polar ice.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-[11px] text-emerald-300 font-bold">
              <span>Verified Audits</span>
              <span className="text-[10px] text-emerald-400 font-mono">Explore →</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ====================================================
            LEFT 8-9 COLUMNS: TRENDING RESEARCH & EXPEDITIONS & LEARNING
        ==================================================== */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-10">
          {/* 1. TRENDING RESEARCH SECTION */}
          <section id="trending-research-section">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2 font-['Outfit']">
                <span>Trending Research</span>
              </h2>
              <button
                id="trending-research-view-all"
                onClick={() => onNavigate('reports')}
                className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 group cursor-pointer transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 4 Cards Grid Matching Screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {safeReports.slice(0, 4).map((report) => (
                <div
                  key={report.id}
                  id={`research-card-${report.id}`}
                  onClick={() => onNavigate('report-detail', report.id)}
                  className="group flex flex-col justify-between bg-black/90 hover:bg-white/10 border border-white/15 hover:border-white/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  {/* Card Thumbnail */}
                  <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category Pill */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-cyan-950/80 backdrop-blur-md border border-cyan-600/40 text-cyan-200">
                        {report.researchArea}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors line-clamp-2 leading-snug font-['Outfit']">
                      {report.title}
                    </h3>

                    {/* Stats Metrics (Views, Comments, Citations, Date) */}
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

                    {/* Footer Action Tag (Expedition / Station / Dataset) */}
                    <div className="flex items-center justify-between pt-1 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                      <div className="flex items-center gap-1.5">
                        {report.footerLinkType === 'expedition' && <Ship className="w-3.5 h-3.5" />}
                        {report.footerLinkType === 'station' && <Building2 className="w-3.5 h-3.5" />}
                        {report.footerLinkType === 'dataset' && <Database className="w-3.5 h-3.5" />}
                        <span>{report.footerLinkLabel}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. SUB-ROW: FEATURED EXPEDITIONS & LEARN POLAR SCIENCE */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Featured Expeditions Carousel */}
            <div id="featured-expeditions-box" className="md:col-span-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-['Outfit']">
                  <span>Featured Expeditions</span>
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onNavigate('expeditions')}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setExpeditionIndex(
                          (expeditionIndex - 1 + Math.max(1, safeExpeditions.length)) %
                            Math.max(1, safeExpeditions.length)
                        )
                      }
                      className="w-7 h-7 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setExpeditionIndex(
                          (expeditionIndex + 1) % Math.max(1, safeExpeditions.length)
                        )
                      }
                      className="w-7 h-7 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expedition Cards Carousel */}
              <div className="grid grid-cols-3 gap-2.5">
                {safeExpeditions.map((exp, idx) => {
                  const isCurrent =
                    safeExpeditions.length > 0 &&
                    idx === expeditionIndex % safeExpeditions.length;
                  return (
                    <div
                      key={exp.id}
                      onClick={() => onNavigate('expedition-detail', exp.id)}
                      className={`relative rounded-xl overflow-hidden h-28 cursor-pointer border transition-all ${
                        isCurrent
                          ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-lg'
                          : 'border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={exp.imageUrl}
                        alt={exp.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-2">
                        <span className="text-[10px] font-bold text-white line-clamp-1">
                          {exp.code}
                        </span>
                        <span className="text-[9px] text-cyan-300 line-clamp-1">{exp.year}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Learn Polar Science (3 Interactive Category Cards) */}
            <div id="learn-polar-science-box" className="md:col-span-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-['Outfit']">
                  <span>Learn Polar Science</span>
                </h3>
                <button
                  onClick={() => onNavigate('learning')}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Card 1: Polar Science Basics */}
                <div
                  onClick={() => onNavigate('learning-detail', 'learn-1')}
                  className="group relative rounded-xl overflow-hidden h-28 bg-black border border-white/15 hover:border-white/50 p-2.5 flex flex-col justify-between cursor-pointer transition-all hover:bg-white/10"
                >
                  <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <span className="text-[11px] font-bold line-clamp-2 leading-tight">
                      Polar Science Basics
                    </span>
                    <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>
                </div>

                {/* Card 2: Climate Change */}
                <div
                  onClick={() => onNavigate('learning-detail', 'learn-2')}
                  className="group relative rounded-xl overflow-hidden h-28 bg-black border border-white/15 hover:border-white/50 p-2.5 flex flex-col justify-between cursor-pointer transition-all hover:bg-white/10"
                >
                  <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <span className="text-[11px] font-bold line-clamp-2 leading-tight">
                      Climate Change
                    </span>
                    <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>
                </div>

                {/* Card 3: Glaciers & Ice */}
                <div
                  onClick={() => onNavigate('learning-detail', 'learn-3')}
                  className="group relative rounded-xl overflow-hidden h-28 bg-black border border-white/15 hover:border-white/50 p-2.5 flex flex-col justify-between cursor-pointer transition-all hover:bg-white/10"
                >
                  <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <span className="text-[11px] font-bold line-clamp-2 leading-tight">
                      Glaciers & Ice
                    </span>
                    <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
            RIGHT 3-4 COLUMNS: POLAR FACTS & POPULAR MYTH CHECKS
        ==================================================== */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          {/* 1. POLAR FACTS WIDGET (Matching screenshot glowing cube card) */}
          <div
            id="home-polar-facts-widget"
            className="bg-black/90 border border-white/15 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit']">
                <span>Polar Facts</span>
              </h3>
              <button
                onClick={() => onNavigate('facts')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Glowing 3D Cube Icon + Fact Statement */}
            <div className="flex items-start gap-4">
              {/* Glowing Cube Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600/40 to-sky-400/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.3)] flex-shrink-0">
                <div className="w-6 h-6 border-2 border-cyan-300 transform rotate-45 rounded-sm flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-xs" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-slate-100 leading-snug">
                  {currentFact?.statement || 'Antarctica holds about 70% of the world’s freshwater.'}
                </p>

                {/* Status Badge: Verified */}
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/80 border border-emerald-500/50 text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions and Slider Dots */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <button
                onClick={() => onNavigate('facts')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Slider Dots */}
              <div className="flex items-center gap-1.5">
                {safeFacts.slice(0, 3).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFactIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      factIndex % 3 === idx ? 'w-5 bg-cyan-400' : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 2. POPULAR MYTH CHECKS WIDGET (Matching screenshot amber badge card) */}
          <div
            id="home-popular-myths-widget"
            className="bg-black/90 border border-white/15 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit']">
                <span>Popular Myth Checks</span>
              </h3>
              <button
                onClick={() => onNavigate('claims')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Glowing Red/Amber Shield Icon + Claim */}
            <div className="flex items-start gap-4">
              {/* Glowing Amber Shield Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600/30 to-red-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)] flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-amber-400" />
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-xs text-slate-400 font-medium">Claim:</div>
                <p className="text-sm font-semibold text-slate-100 leading-snug">
                  "{currentClaim?.claimText || 'Antarctica is getting warmer everywhere.'}"
                </p>

                {/* Status Badge */}
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/80 border border-amber-500/50 text-amber-300">
                    <span>
                      {currentClaim?.status === 'PARTIALLY_SUPPORTED'
                        ? 'Partially Supported'
                        : currentClaim?.status === 'VERIFIED'
                        ? 'Verified'
                        : currentClaim?.status === 'CONTRADICTED'
                        ? 'Contradicted (Myth)'
                        : 'Unverified'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions and Slider Dots */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <button
                onClick={() => onNavigate('claim-detail', currentClaim?.id)}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Audit & Evidence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Slider Dots */}
              <div className="flex items-center gap-1.5">
                {safeClaims.slice(0, 3).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setClaimIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      claimIndex % 3 === idx
                        ? 'w-5 bg-amber-400'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
