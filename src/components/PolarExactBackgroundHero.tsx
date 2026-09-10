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
  RotateCw,
  Upload,
  Image as ImageIcon,
  Layers,
} from 'lucide-react';
import { ViewMode } from '../types';
import { Holographic3DCube } from './3d/Holographic3DCube';

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

// Calibrated 100% strictly to the uploaded bg3.png (1633 x 963 px)
const EXACT_HOTSPOTS: ExactNodeHotspot[] = [
  {
    id: 'research',
    name: 'Research & Publications',
    badgeLabel: 'Research & Publications',
    view: 'reports',
    badgeX: 16.8,
    badgeY: 18.9,
    badgeW: 14.8,
    badgeH: 4.8,
    cubeX: 15.0,
    cubeY: 26.2,
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
    badgeX: 42.0,
    badgeY: 19.8,
    badgeW: 11.2,
    badgeH: 4.8,
    cubeX: 41.8,
    cubeY: 27.2,
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
    badgeX: 68.3,
    badgeY: 24.5,
    badgeW: 10.6,
    badgeH: 4.8,
    cubeX: 68.3,
    cubeY: 31.8,
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
    badgeX: 12.2,
    badgeY: 45.2,
    badgeW: 10.0,
    badgeH: 4.8,
    cubeX: 12.2,
    cubeY: 52.2,
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
    badgeX: 51.3,
    badgeY: 43.7,
    badgeW: 10.5,
    badgeH: 4.8,
    cubeX: 51.3,
    cubeY: 51.2,
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
    badgeX: 89.6,
    badgeY: 37.1,
    badgeW: 11.2,
    badgeH: 4.8,
    cubeX: 89.6,
    cubeY: 44.5,
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
    badgeX: 33.0,
    badgeY: 65.6,
    badgeW: 10.2,
    badgeH: 4.8,
    cubeX: 33.0,
    cubeY: 72.8,
    cubeSize: 5.6,
    icon: ShieldCheck,
    color: '#34d399',
    category: 'Scientific Fact-Checking',
    stat: 'Peer-Reviewed Audits',
    summary: 'Evidence-based debunking of common misconceptions surrounding polar ice and melting.',
  },
  {
    id: 'learning',
    name: 'Polar Learning Hub',
    badgeLabel: 'Learning Hub',
    view: 'learning',
    badgeX: 58.5,
    badgeY: 74.6,
    badgeW: 10.8,
    badgeH: 4.8,
    cubeX: 58.5,
    cubeY: 82.0,
    cubeSize: 5.6,
    icon: GraduationCap,
    color: '#818cf8',
    category: 'Education & Quizzes',
    stat: 'Modules & Certifications',
    summary: 'Curricula for students, interactive polar survival simulations, and field science exams.',
  },
  {
    id: 'voices',
    name: 'Polar Voices',
    badgeLabel: 'Polar Voices',
    view: 'voices',
    badgeX: 81.2,
    badgeY: 58.5,
    badgeW: 10.5,
    badgeH: 4.8,
    cubeX: 81.2,
    cubeY: 65.8,
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
  const [imageSrc, setImageSrc] = useState<string>(() => {
    try {
      return localStorage.getItem('polar_hero_bg_data') || '/bg3.png';
    } catch {
      return '/bg3.png';
    }
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [show3dCubes] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(12); // seconds per 360 rotation
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgBox, setImgBox] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>({ left: 0, top: 0, width: 0, height: 0 });

  // Handle file drop / upload to strictly use bg3.png
  const handleFileProcess = useCallback(async (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setImageSrc(dataUrl);
        setImageLoaded(true);
        try {
          localStorage.setItem('polar_hero_bg_data', dataUrl);
        } catch {
          // localStorage might be full for large images
        }
      }
    };
    reader.readAsDataURL(file);

    // Also persist directly to server filesystem via Vite middleware
    try {
      const arrayBuffer = await file.arrayBuffer();
      await fetch('/api/upload-bg', {
        method: 'POST',
        body: arrayBuffer,
      });
    } catch {
      // ignore
    }
  }, []);

  // Compute exact rendered image dimensions for object-cover object-center
  const updateBounds = useCallback(() => {
    if (!containerRef.current) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    if (!cw || !ch) return;

    // Use natural image dimensions or fall back to 1633 x 963 px
    const naturalW = imgRef.current?.naturalWidth || 1633;
    const naturalH = imgRef.current?.naturalHeight || 963;
    const imgAspect = naturalW / naturalH;
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

  // Check if user previously saved image to localStorage or /bg3.png
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
      {/* Hidden file input to select bg3.png */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileProcess(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* =========================================================
          1. DEDICATED PANORAMIC CANVAS (bg3.png + 9 NODES)
          Unobstructed viewport: Learning Hub is 100% visible & accessible
      ========================================================= */}
      <div
        id="polar-exact-background-hero"
        ref={containerRef}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingFile(true);
        }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingFile(false);
          if (e.dataTransfer.files?.[0]) {
            handleFileProcess(e.dataTransfer.files[0]);
          }
        }}
        className={`relative w-full h-[540px] sm:h-[620px] md:h-[700px] lg:h-[780px] xl:h-[840px] bg-[#030915] overflow-hidden flex flex-col justify-between transition-colors ${
          isDraggingFile ? 'ring-4 ring-cyan-400/80 bg-cyan-950/40' : ''
        }`}
      >
      {/* =========================================================
          1. EXACT BACKGROUND IMAGE LAYER (Strictly bg3.png)
      ========================================================= */}
      <div className="absolute inset-0 w-full h-full">
        {imageSrc && (
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Antarctic Polar Science Landscape bg3.png"
            onError={() => {
              setImageLoaded(false);
              updateBounds();
            }}
            onLoad={() => {
              setImageLoaded(true);
              updateBounds();
            }}
            className={`w-full h-full object-cover object-center pointer-events-none transition-opacity duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              filter: 'contrast(1.02) saturate(1.02)',
            }}
          />
        )}

        {/* Subtle Vignette and Cinematic Tone Mapping */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030814] via-transparent to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#020713]/40 pointer-events-none" />
      </div>

      {/* Fallback Upload & Drop Prompt if bg3.png hasn't loaded yet */}
      {!imageLoaded && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center cursor-pointer bg-[#030915]/95"
        >
          <div className="max-w-md p-8 rounded-3xl bg-[#06152d]/90 border border-cyan-800/60 shadow-2xl backdrop-blur-xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mb-4 shadow-lg shadow-cyan-950">
              <Upload className="w-8 h-8 animate-bounce text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Strictly Using Background Image (bg3.png)
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Seeking <code className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">/bg3.png</code>. If not automatically loaded, drag and drop <span className="text-cyan-200 font-semibold">bg3.png</span> here or click below to select it.
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Select bg3.png</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          2. TOP BAR & HUD OVERLAY
      ========================================================= */}
      <div className="relative z-20 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Polar Observatory Telemetry Badge */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#051329]/80 backdrop-blur-md border border-cyan-700/50 shadow-lg text-[11px] sm:text-xs text-cyan-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-white">LIVE POLAR TELEMETRY</span>
          <span className="hidden sm:inline text-cyan-400/60">•</span>
          <span className="hidden sm:inline text-slate-300 font-mono">70°45'57"S, 11°44'09"E</span>
        </div>

        {/* Right: Station Status */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#051329]/80 backdrop-blur-md border border-cyan-800/60 text-[11px] text-cyan-300 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="font-semibold">NCPOR Network Active</span>
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
            const boxSizePx = Math.max(48, Math.round((hotspot.cubeSize / 100) * imgBox.width));

            return (
              <React.Fragment key={hotspot.id}>
                {/* 1. THE MAIN TOPIC BADGE HITBOX - Calibrated exactly over bg3.png badge */}
                <div
                  id={`hotspot-badge-${hotspot.id}`}
                  onClick={() => onNavigate(hotspot.view)}
                  onMouseEnter={() => setActiveHotspot(hotspot)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  style={{
                    left: `${hotspot.badgeX}%`,
                    top: `${hotspot.badgeY}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${Math.max(120, Math.round((hotspot.badgeW * imgBox.width) / 100))}px`,
                    height: `${Math.max(36, Math.round((hotspot.badgeH * imgBox.height) / 100))}px`,
                  }}
                  className="absolute z-40 flex items-center justify-center cursor-pointer pointer-events-auto select-none group"
                  title={`Explore ${hotspot.name}`}
                >
                  <div
                    className={`w-full h-full rounded-full transition-all duration-200 flex items-center justify-between px-3 ${
                      isHovered
                        ? 'ring-2 ring-cyan-300 bg-cyan-950/40 backdrop-blur-xs shadow-[0_0_24px_rgba(34,211,238,0.9)] scale-105'
                        : 'hover:ring-1 hover:ring-cyan-400/50'
                    }`}
                  >
                    {/* Subtle pulsing status beacon */}
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform ${
                        isHovered ? 'scale-125' : 'opacity-85 animate-pulse'
                      }`}
                      style={{
                        backgroundColor:
                          hotspot.id === 'claims'
                            ? '#34d399'
                            : hotspot.id === 'ai'
                            ? '#22d3ee'
                            : '#38bdf8',
                        boxShadow: `0 0 10px ${hotspot.color}`,
                      }}
                    />
                    <span className="sr-only">{hotspot.badgeLabel}</span>
                  </div>
                </div>

                {/* 2. 3D CUBE HITBOX / OPTIONAL LIVE 3D CUBE */}
                <div
                  id={`hotspot-cube-${hotspot.id}`}
                  onClick={() => onNavigate(hotspot.view)}
                  onMouseEnter={() => setActiveHotspot(hotspot)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  style={{
                    left: `${hotspot.cubeX}%`,
                    top: `${hotspot.cubeY}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${boxSizePx}px`,
                    height: `${boxSizePx}px`,
                  }}
                  className="absolute z-30 flex items-center justify-center cursor-pointer pointer-events-auto select-none group"
                  title={`Explore ${hotspot.name}`}
                >
                  {show3dCubes ? (
                    <Holographic3DCube
                      icon={Icon}
                      size={boxSizePx}
                      label={hotspot.name}
                      category={hotspot.category}
                      color={hotspot.color}
                      isHovered={isHovered}
                      autoRotateSpeed={rotationSpeed}
                      enableDrag={true}
                      onClick={() => onNavigate(hotspot.view)}
                      onHoverChange={(hovered) => setActiveHotspot(hovered ? hotspot : null)}
                    />
                  ) : (
                    <div
                      className={`w-full h-full rounded-2xl transition-all duration-200 flex items-center justify-center ${
                        isHovered
                          ? 'ring-2 ring-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.85)] scale-108'
                          : 'hover:ring-1 hover:ring-cyan-400/40'
                      }`}
                    >
                      {isHovered && (
                        <div className="absolute inset-0 rounded-2xl bg-cyan-400/15 animate-pulse pointer-events-none" />
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Floating HUD Inspection Tooltip on Hover */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: hotspot.cubeY > 60 ? `calc(100% - ${hotspot.badgeY}% + 28px)` : 'auto',
                      top: hotspot.cubeY > 60 ? 'auto' : `calc(${hotspot.cubeY}% + 34px)`,
                      // For left-side nodes (Scientists, Research), move the box to the right of the cube so it never clips off the left screen edge
                      left:
                        hotspot.cubeX < 30
                          ? `calc(${hotspot.cubeX}% + 12px)`
                          : hotspot.cubeX > 75
                          ? 'auto'
                          : `${hotspot.cubeX}%`,
                      right:
                        hotspot.cubeX > 75
                          ? `${Math.max(2, 100 - hotspot.cubeX - 8)}%`
                          : 'auto',
                      transform:
                        hotspot.cubeX < 30 || hotspot.cubeX > 75
                          ? 'none'
                          : 'translateX(-50%)',
                    }}
                    className="z-50 w-64 sm:w-72 p-3.5 rounded-2xl bg-[#061429]/95 backdrop-blur-xl border border-cyan-400/70 shadow-2xl shadow-cyan-950/90 pointer-events-none animate-in fade-in zoom-in-95 duration-150 whitespace-normal"
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
      <div className="w-full bg-black border-b border-white/10 py-4 sm:py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1720px] mx-auto">
          {/* Frosted Action Dock */}
          <div className="p-3.5 sm:p-4 rounded-3xl bg-black/95 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
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

            {/* Quick Direct Buttons for Key Portals with Highlighting for Evidence & Polar AI */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => onNavigate('claims')}
                className="px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/70 text-xs font-bold text-emerald-300 hover:text-emerald-100 transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
                title="Webpage: Evidence & Fact-Checks"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Evidence</span>
                <span className="px-1 py-0.2 rounded bg-emerald-400/20 text-emerald-300 text-[9px] font-mono">FACTS</span>
              </button>
              <button
                onClick={() => onNavigate('ai')}
                className="px-3.5 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-400/70 text-xs font-bold text-cyan-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-cyan-900/40"
                title="Webpage: Polar AI Assistant"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span>Polar AI</span>
                <span className="px-1 py-0.2 rounded bg-cyan-400 text-slate-950 text-[9px] font-mono font-black">AI</span>
              </button>
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
