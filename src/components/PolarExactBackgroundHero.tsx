import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText,
  Ship,
  Database,
  Camera,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Users,
  Search,
  ArrowRight,
  Wind,
  Thermometer,
  ShieldCheck,
} from 'lucide-react';
import { ViewMode } from '../types';

interface PolarExactBackgroundHeroProps {
  onNavigate: (view: ViewMode, id?: string) => void;
  onSearchSubmit: (query: string) => void;
}

interface ExactNodeHotspot {
  id: string;
  name: string;
  view: ViewMode;
  // Exact coordinates relative to the 1633 x 963 original image
  badgeX: number; // percentage from left (0 - 100)
  badgeY: number; // percentage from top (0 - 100)
  badgeW: number; // width in percent of image
  badgeH: number; // height in percent of image
  cubeX: number;  // center of 3D cube
  cubeY: number;
  cubeSize: number; // percentage of image width
  icon: any;
  color: string;
  badgeLabel: string;
  category: string;
  stat: string;
  summary: string;
}

// Exactly measured from public/bg3.png (1633 x 963 px)
const EXACT_HOTSPOTS: ExactNodeHotspot[] = [
  {
    id: 'research',
    name: 'Research & Publications',
    badgeLabel: 'Research & Publications',
    view: 'reports',
    badgeX: 16.23,
    badgeY: 20.04,
    badgeW: 10.5,
    badgeH: 4.8,
    cubeX: 14.70,
    cubeY: 26.79,
    cubeSize: 5.6,
    icon: FileText,
    color: '#38bdf8',
    category: 'Scientific Literature',
    stat: '540+ Peer-Reviewed Papers',
    summary: 'Explore 4 decades of glaciology, atmospheric physics, and ozone depletion studies.',
  },
  {
    id: 'expeditions',
    name: 'Polar Expeditions',
    badgeLabel: 'Expeditions',
    view: 'expeditions',
    badgeX: 41.76,
    badgeY: 19.63,
    badgeW: 10.0,
    badgeH: 4.8,
    cubeX: 41.95,
    cubeY: 28.25,
    cubeSize: 5.6,
    icon: Ship,
    color: '#38bdf8',
    category: 'Field Missions',
    stat: '44+ Indian Voyages',
    summary: 'Track scientific convoys across Dakshin Gangotri, Maitri, Bharati, and Himadri stations.',
  },
  {
    id: 'datasets',
    name: 'Scientific Datasets',
    badgeLabel: 'Datasets',
    view: 'datasets',
    badgeX: 69.69,
    badgeY: 26.38,
    badgeW: 9.0,
    badgeH: 4.8,
    cubeX: 68.46,
    cubeY: 32.19,
    cubeSize: 5.6,
    icon: Database,
    color: '#38bdf8',
    category: 'Open Climate Data',
    stat: '85+ Live Repositories',
    summary: 'Download ice core drill depths, CTD salinity arrays, and atmospheric weather records.',
  },
  {
    id: 'scientists',
    name: 'Polar Scientists',
    badgeLabel: 'Scientists',
    view: 'scientists',
    badgeX: 8.33,
    badgeY: 45.07,
    badgeW: 8.5,
    badgeH: 4.8,
    cubeX: 12.19,
    cubeY: 52.54,
    cubeSize: 5.6,
    icon: Users,
    color: '#38bdf8',
    category: 'Research Personnel',
    stat: '1,200+ Researchers',
    summary: 'Profiles of expedition leaders, winter-over scientists, glaciologists, and meteorologists.',
  },
  {
    id: 'ai',
    name: 'Ask Polar AI',
    badgeLabel: 'Polar AI',
    view: 'ai',
    badgeX: 51.13,
    badgeY: 43.72,
    badgeW: 9.0,
    badgeH: 4.8,
    cubeX: 51.26,
    cubeY: 51.19,
    cubeSize: 5.8,
    icon: Sparkles,
    color: '#22d3ee',
    category: 'Scientific AI Layer',
    stat: 'Grounded in NCPOR Literature',
    summary: 'Ask complex polar questions, synthesize expedition logs, and query ice shelf dynamics.',
  },
  {
    id: 'media',
    name: 'Media & Visuals',
    badgeLabel: 'Media & Visuals',
    view: 'media',
    badgeX: 90.39,
    badgeY: 37.18,
    badgeW: 10.5,
    badgeH: 4.8,
    cubeX: 88.85,
    cubeY: 45.17,
    cubeSize: 5.6,
    icon: Camera,
    color: '#38bdf8',
    category: 'Visual Archive',
    stat: '12,000+ High-Res Assets',
    summary: 'Documentary footage, satellite composites, drone aerials, and polar wildlife telemetry.',
  },
  {
    id: 'claims',
    name: 'Polar Evidence & Fact Check',
    badgeLabel: 'Evidence',
    view: 'claims',
    badgeX: 33.01,
    badgeY: 66.25,
    badgeW: 9.0,
    badgeH: 4.8,
    cubeX: 32.82,
    cubeY: 73.21,
    cubeSize: 5.6,
    icon: ShieldCheck,
    color: '#38bdf8',
    category: 'Scientific Fact-Checking',
    stat: 'Peer-Reviewed Audits',
    summary: 'Evidence-based debunking of common misconceptions surrounding polar ice and melting.',
  },
  {
    id: 'learning',
    name: 'Polar Learning Hub',
    badgeLabel: 'Learning Hub',
    view: 'learning',
    badgeX: 59.15,
    badgeY: 75.80,
    badgeW: 9.5,
    badgeH: 4.8,
    cubeX: 58.11,
    cubeY: 83.59,
    cubeSize: 5.6,
    icon: GraduationCap,
    color: '#38bdf8',
    category: 'Education & Quizzes',
    stat: 'Modules & Certifications',
    summary: 'Curricula for students, interactive polar survival simulations, and field science exams.',
  },
  {
    id: 'voices',
    name: 'Polar Voices',
    badgeLabel: 'Polar Voices',
    view: 'voices',
    badgeX: 81.69,
    badgeY: 58.88,
    badgeW: 9.5,
    badgeH: 4.8,
    cubeX: 81.38,
    cubeY: 66.56,
    cubeSize: 5.6,
    icon: Users,
    color: '#38bdf8',
    category: 'Community & Field Logs',
    stat: 'Live Polar Community',
    summary: 'Stories, blogs, and journals shared directly by scientists during long Antarctic winters.',
  },
];

export const PolarExactBackgroundHero: React.FC<PolarExactBackgroundHeroProps> = ({
  onNavigate,
  onSearchSubmit,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<ExactNodeHotspot | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [imageSrc, setImageSrc] = useState<string>('/bg3.png');
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgBox, setImgBox] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>({ left: 0, top: 0, width: 0, height: 0 });

  // Compute exact rendered image dimensions for object-cover object-center
  const updateBounds = useCallback(() => {
    if (!containerRef.current) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    if (!cw || !ch) return;

    // public/bg3.png is 1633 x 963 px
    const imgAspect = 1633 / 963;
    const containerAspect = cw / ch;

    let width = 0;
    let height = 0;
    let left = 0;
    let top = 0;

    if (containerAspect >= imgAspect) {
      // Container is wider than the image aspect ratio
      width = cw;
      height = cw / imgAspect;
      left = 0;
      top = (ch - height) / 2;
    } else {
      // Container is taller than the image aspect ratio
      height = ch;
      width = ch * imgAspect;
      top = 0;
      left = (cw - width) / 2;
    }

    setImgBox({ left, top, width, height });
  }, []);

  useEffect(() => {
    updateBounds();
    window.addEventListener('resize', updateBounds);
    const observer = new ResizeObserver(updateBounds);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      window.removeEventListener('resize', updateBounds);
      observer.disconnect();
    };
  }, [updateBounds]);

  // Check if user previously saved image to localStorage
  useEffect(() => {
    try {
      const cached = localStorage.getItem('polar_hero_bg_data');
      if (cached) {
        setImageSrc(cached);
        setImageLoaded(true);
      }
    } catch {
      // ignore storage error
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
    }
  };

  return (
    <div id="polar-exact-background-hero-section" className="w-full bg-[#030915] flex flex-col select-none">
      {/* =========================================================
          1. DEDICATED PANORAMIC CANVAS (bg3.png + 9 NODES)
          Unobstructed viewport: Learning Hub is 100% visible & accessible
      ========================================================= */}
      <div
        id="polar-exact-background-hero"
        ref={containerRef}
        className="relative w-full h-[540px] sm:h-[620px] md:h-[700px] lg:h-[780px] xl:h-[840px] bg-[#030915] overflow-hidden flex flex-col justify-between"
      >
      {/* =========================================================
          1. EXACT BACKGROUND IMAGE LAYER
      ========================================================= */}
      <div className="absolute inset-0 w-full h-full">
        {/* The Exact Background image (bg3.png) */}
        <img
          src={imageSrc}
          alt="Antarctic Polar Science Landscape"
          onLoad={() => {
            setImageLoaded(true);
            updateBounds();
          }}
          className="w-full h-full object-cover object-center pointer-events-none transition-opacity duration-700"
          style={{
            filter: 'contrast(1.04) saturate(1.03)',
          }}
        />

        {/* Ambient atmospheric backdrop if image is loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#020b18] via-[#051a36] to-[#010814]" />
        )}

        {/* Subtle Vignette and Cinematic Tone Mapping */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030814] via-transparent to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#020713]/40 pointer-events-none" />
      </div>

      {/* =========================================================
          2. TOP BAR & HUD OVERLAY
      ========================================================= */}
      <div className="relative z-20 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex items-center justify-between gap-4 pointer-events-auto">
        {/* Left: Polar Observatory Telemetry Badge */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#051329]/80 backdrop-blur-md border border-cyan-700/50 shadow-lg text-[11px] sm:text-xs text-cyan-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-white">LIVE POLAR TELEMETRY</span>
          <span className="hidden sm:inline text-cyan-400/60">•</span>
          <span className="hidden sm:inline text-slate-300 font-mono">70°45'57"S, 11°44'09"E</span>
        </div>

        {/* Right: Station Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#051329]/80 backdrop-blur-md border border-cyan-800/60 text-[11px] text-cyan-300 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="font-semibold">NCPOR Polar Network Active</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. ACCURATELY BOUNDED HOTSPOT LAYER (100% PINNED TO bg3.png)
      ========================================================= */}
      {imgBox.width > 0 && (
        <div
          className="absolute pointer-events-none z-30"
          style={{
            left: `${imgBox.left}px`,
            top: `${imgBox.top}px`,
            width: `${imgBox.width}px`,
            height: `${imgBox.height}px`,
          }}
        >
          {EXACT_HOTSPOTS.map((hotspot) => {
            const isHovered = activeHotspot?.id === hotspot.id;
            const Icon = hotspot.icon;

            return (
              <React.Fragment key={hotspot.id}>
                {/* A. Hitbox for Pill Badge (the rectangular capsule in bg3.png) */}
                <div
                  id={`hotspot-badge-${hotspot.id}`}
                  onClick={() => onNavigate(hotspot.view)}
                  onMouseEnter={() => setActiveHotspot(hotspot)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  style={{
                    left: `${hotspot.badgeX}%`,
                    top: `${hotspot.badgeY}%`,
                    width: `${hotspot.badgeW}%`,
                    height: `${hotspot.badgeH}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute rounded-full cursor-pointer pointer-events-auto group"
                  title={`Open ${hotspot.name}`}
                >
                  {/* Subtle active highlight over pill badge */}
                  <div
                    className={`w-full h-full rounded-full transition-all duration-250 ${
                      isHovered
                        ? 'ring-2 ring-cyan-300/90 bg-cyan-400/20 shadow-[0_0_24px_rgba(34,211,238,0.7)]'
                        : 'group-hover:ring-1 group-hover:ring-cyan-400/40 group-hover:bg-cyan-500/10'
                    }`}
                  />
                </div>

                {/* B. Hitbox & Glowing Reticle for 3D Holographic Cube in bg3.png */}
                <div
                  id={`hotspot-cube-${hotspot.id}`}
                  onClick={() => onNavigate(hotspot.view)}
                  onMouseEnter={() => setActiveHotspot(hotspot)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  style={{
                    left: `${hotspot.cubeX}%`,
                    top: `${hotspot.cubeY}%`,
                    width: `${hotspot.cubeSize}%`,
                    aspectRatio: '1 / 1',
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute rounded-full cursor-pointer pointer-events-auto flex items-center justify-center group"
                  title={`Open ${hotspot.name}`}
                >
                  {/* Primary Holographic Reticle Ring locked to cube */}
                  <div
                    className={`absolute inset-0 rounded-full border-2 transition-all duration-300 pointer-events-none ${
                      isHovered
                        ? 'border-cyan-300 scale-110 shadow-[0_0_35px_rgba(34,211,238,0.9)] bg-cyan-400/20'
                        : 'border-cyan-400/30 group-hover:border-cyan-400/70 scale-95 opacity-60 group-hover:opacity-100'
                    }`}
                  />

                  {/* Concentric expanding pulse ring */}
                  <div
                    className={`absolute inset-1 rounded-full border border-cyan-400/40 transition-all duration-500 pointer-events-none ${
                      isHovered ? 'scale-125 opacity-90 animate-ping' : 'scale-100 opacity-20'
                    }`}
                  />

                  {/* Center cyan highlight */}
                  {isHovered && (
                    <div className="absolute w-2/3 h-2/3 rounded-full bg-cyan-400/30 blur-sm pointer-events-none" />
                  )}
                </div>

                {/* C. Floating HUD Inspection Tooltip on Hover */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: hotspot.cubeY > 60 ? `calc(100% - ${hotspot.cubeY}% + 35px)` : 'auto',
                      top: hotspot.cubeY > 60 ? 'auto' : `calc(${hotspot.cubeY}% + 35px)`,
                      left: hotspot.cubeX > 75 ? 'auto' : `${Math.max(15, hotspot.cubeX)}%`,
                      right: hotspot.cubeX > 75 ? `${Math.max(3, 100 - hotspot.cubeX - 10)}%` : 'auto',
                      transform: hotspot.cubeX > 75 ? 'none' : 'translateX(-50%)',
                    }}
                    className="z-50 w-64 sm:w-72 p-3.5 rounded-2xl bg-[#061429]/95 backdrop-blur-xl border border-cyan-400/70 shadow-2xl shadow-cyan-950/90 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-cyan-900/60 text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                      <span>{hotspot.category}</span>
                      <span className="flex items-center gap-1 text-white font-semibold">
                        <span>Click to Open</span>
                        <ArrowRight className="w-3 h-3 text-cyan-300" />
                      </span>
                    </div>

                    <div className="mt-2">
                      <h4 className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-1.5">
                        <Icon className="w-4 h-4 text-cyan-300" />
                        <span>{hotspot.name}</span>
                      </h4>
                      <div className="text-[11px] font-semibold text-cyan-300 mt-0.5">
                        {hotspot.stat}
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                        {hotspot.summary}
                      </p>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      </div>

      {/* =========================================================
          4. BOTTOM COMMAND & SEARCH RIBBON (PLACED SLIGHTLY DOWN)
          Positioned below the panoramic image so Learning Hub
          and all bottom nodes are 100% accessible with zero overlap.
      ========================================================= */}
      <div className="w-full bg-gradient-to-b from-[#030915] via-[#040e1f] to-[#030814] border-b border-cyan-950/70 py-4 sm:py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1720px] mx-auto">
          {/* Frosted Action Dock */}
          <div className="p-3.5 sm:p-4 rounded-3xl bg-[#051327]/90 backdrop-blur-xl border border-cyan-900/70 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full lg:w-[460px]">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search verified research, expeditions, datasets, scientists..."
                className="w-full pl-11 pr-24 py-2.5 rounded-2xl bg-[#091e38]/90 border border-cyan-800/60 text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Quick Direct Buttons for Key Portals */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => onNavigate('reports')}
                className="px-3 py-2 rounded-xl bg-[#0a223f]/80 hover:bg-[#10325c] border border-cyan-800/50 hover:border-cyan-400 text-xs font-semibold text-slate-200 hover:text-cyan-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Research</span>
              </button>
              <button
                onClick={() => onNavigate('expeditions')}
                className="px-3 py-2 rounded-xl bg-[#0a223f]/80 hover:bg-[#10325c] border border-cyan-800/50 hover:border-cyan-400 text-xs font-semibold text-slate-200 hover:text-cyan-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Ship className="w-3.5 h-3.5 text-amber-400" />
                <span>Expeditions</span>
              </button>
              <button
                onClick={() => onNavigate('datasets')}
                className="px-3 py-2 rounded-xl bg-[#0a223f]/80 hover:bg-[#10325c] border border-cyan-800/50 hover:border-cyan-400 text-xs font-semibold text-slate-200 hover:text-cyan-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Datasets</span>
              </button>
              <button
                onClick={() => onNavigate('learning')}
                className="px-3 py-2 rounded-xl bg-[#0a223f]/80 hover:bg-[#10325c] border border-cyan-800/50 hover:border-cyan-400 text-xs font-semibold text-slate-200 hover:text-cyan-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Learning Hub</span>
              </button>
              <button
                onClick={() => onNavigate('media')}
                className="px-3 py-2 rounded-xl bg-[#0a223f]/80 hover:bg-[#10325c] border border-cyan-800/50 hover:border-cyan-400 text-xs font-semibold text-slate-200 hover:text-cyan-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-sky-400" />
                <span>Media</span>
              </button>
              <button
                onClick={() => onNavigate('ai')}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/60 text-xs font-bold text-cyan-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-cyan-500/10"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Ask Polar AI</span>
              </button>
            </div>

            {/* Live Station Weather Feed */}
            <div className="hidden xl:flex items-center gap-4 pl-4 border-l border-cyan-900/60 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-white">-18°C</span>
                <span className="text-[10px] text-slate-400">Maitri</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-white">38 kts</span>
                <span className="text-[10px] text-slate-400">Wind</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] text-emerald-300 font-semibold">Stations Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
