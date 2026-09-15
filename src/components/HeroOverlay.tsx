import React, { useState } from 'react';
import {
  Compass,
  FileText,
  Building2,
  Database,
  Ship,
  Sparkles,
  Image as ImageIcon,
  ArrowRight,
  MessageSquare,
  Search,
  CloudSun,
  Mountain,
} from 'lucide-react';
import { ScientificNode, ViewMode } from '../types';
import { SCIENTIFIC_NODES } from '../data/mockData';

interface HeroOverlayProps {
  nodes?: ScientificNode[];
  onNavigate: (view: ViewMode) => void;
  onNodeSelect?: (node: ScientificNode) => void;
  onSearchSubmit: (query: string) => void;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({
  nodes = SCIENTIFIC_NODES,
  onNavigate,
  onNodeSelect,
  onSearchSubmit,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
    }
  };

  const popularSearches = [
    'Climate Change',
    'Antarctica',
    'Indian Expeditions',
    'Ice Cores',
    'Penguins',
    'Arctic',
  ];

  // Map node types to icons
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'research':
        return FileText;
      case 'station':
        return Building2;
      case 'dataset':
        return Database;
      case 'expedition':
        return Ship;
      case 'ai':
        return Sparkles;
      case 'media':
        return ImageIcon;
      default:
        return Sparkles;
    }
  };

  return (
    <div
      id="hero-overlay-wrapper"
      className="relative z-10 w-full min-h-[620px] lg:min-h-[740px] flex flex-col justify-between p-4 sm:p-8 lg:p-12 pointer-events-none select-none"
    >
      {/* 1. TOP-LEFT HERO HEADLINE & CTAs */}
      <div className="max-w-2xl pointer-events-auto mt-2 sm:mt-4">
        <h1
          id="hero-main-title"
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] font-['Outfit']"
        >
          Discover India’s <br />
          <span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]">
            Polar Science
          </span>
        </h1>
        <p
          id="hero-subtitle"
          className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl"
        >
          Explore India's polar expeditions, scientific research, datasets, discoveries, facts, media and stories from the Arctic and Antarctic.
        </p>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center gap-3.5">
          <button
            id="hero-explore-btn"
            onClick={() => onNavigate('explore')}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <span>Explore Polar Science</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            id="hero-ask-ai-btn"
            onClick={() => onNavigate('ai')}
            className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#0b1b33]/80 hover:bg-[#102747]/90 border border-cyan-500/30 text-cyan-200 font-semibold text-sm backdrop-blur-md hover:border-cyan-400/60 shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Ask Polar AI</span>
          </button>
        </div>

        {/* Clear, Non-Overlapping Quick Portals Bar with Extra Space */}
        <div
          id="hero-webpages-quick-spread"
          className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3"
        >
          <button
            onClick={() => onNavigate('datasets')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06152b]/85 hover:bg-[#0c2447] border border-cyan-800/70 hover:border-cyan-400 text-xs font-semibold text-cyan-200 shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scientific Datasets</span>
          </button>

          <button
            onClick={() => onNavigate('media')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06152b]/85 hover:bg-[#0c2447] border border-cyan-800/70 hover:border-cyan-400 text-xs font-semibold text-cyan-200 shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>Media & Visuals</span>
          </button>

          <button
            onClick={() => onNavigate('research')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06152b]/85 hover:bg-[#0c2447] border border-cyan-800/70 hover:border-cyan-400 text-xs font-semibold text-slate-300 hover:text-cyan-200 shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Research & Publications</span>
          </button>

          <button
            onClick={() => onNavigate('expeditions')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06152b]/85 hover:bg-[#0c2447] border border-cyan-800/70 hover:border-cyan-400 text-xs font-semibold text-slate-300 hover:text-cyan-200 shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <Ship className="w-3.5 h-3.5 text-amber-400" />
            <span>Polar Expeditions</span>
          </button>
        </div>
      </div>

      {/* 2. BOTTOM CONTROL BAR: COORDINATES, SEARCH BAR & WEATHER */}
      <div className="w-full mt-auto pt-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Bottom Left: Coordinates & Compass */}
        <div
          id="hero-coordinates-widget"
          className="pointer-events-auto flex items-center gap-3 text-slate-300 self-start lg:self-auto"
        >
          <div className="w-10 h-10 rounded-full bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shadow-md">
            <Compass className="w-5 h-5 animate-[spin_60s_linear_infinite]" />
          </div>
          <div className="text-left">
            <div className="text-xs font-mono font-medium tracking-wider text-cyan-300">
              71.7069° S, 11.3387° E
            </div>
            <div className="text-xs text-slate-400 font-semibold">
              Antarctica (Maitri Base)
            </div>
          </div>
        </div>

        {/* Center: Floating Search Bar & Popular Pills */}
        <div
          id="hero-search-container"
          className="w-full max-w-2xl pointer-events-auto flex flex-col items-center"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="w-full relative flex items-center group"
          >
            <div className="absolute left-4.5 text-cyan-400 pointer-events-none">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="hero-main-search-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search research, reports, expeditions, scientists, datasets, facts and media..."
              className="w-full pl-12 pr-12 py-3.5 rounded-full bg-[#08172c]/90 backdrop-blur-xl border border-cyan-800/60 text-white placeholder-slate-400 text-xs sm:text-sm font-normal focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-2xl transition-all"
            />
            <button
              id="hero-search-submit-btn"
              type="submit"
              className="absolute right-3 w-8 h-8 rounded-full bg-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center transition-all cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular Search Badges */}
          <div
            id="hero-popular-searches"
            className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400"
          >
            <span className="text-slate-400/90 font-medium">Popular searches:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchInput(term);
                  onSearchSubmit(term);
                }}
                className="px-2.5 py-0.5 rounded-full bg-slate-900/60 hover:bg-cyan-950/80 border border-slate-700/60 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-200 transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Right: Polar Weather Widget */}
        <div
          id="hero-weather-widget"
          className="pointer-events-auto self-end lg:self-auto flex items-center gap-3 px-4 py-2 rounded-full bg-[#08172c]/85 border border-cyan-900/70 backdrop-blur-md text-slate-200 shadow-lg"
        >
          <CloudSun className="w-5 h-5 text-sky-300" />
          <div className="flex flex-col text-right sm:text-left">
            <span className="text-xs font-bold text-white font-mono">-18°C</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
              Partly Cloudy
            </span>
          </div>
          <div className="w-6 h-6 rounded-md bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400 ml-1">
            <Mountain className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
