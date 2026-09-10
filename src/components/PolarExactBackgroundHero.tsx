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

// Strict node alignment and frame-safe coordinates (1633 x 963 px calibrated)
// All cubes strictly vertically aligned with badges (badgeX === cubeX)
// Scientists (dragged inside from 8.33% to 14.2%) and Media (dragged inside from 90.39% to 83.5%)
const EXACT_HOTSPOTS: ExactNodeHotspot[] = [
  {
    id: 'research',
    name: 'Research & Publications',
    badgeLabel: 'Research & Publications',
    view: 'reports',
    badgeX: 16.3,
    badgeY: 20.0,
    badgeW: 15.2,
    badgeH: 5.4,
    cubeX: 16.3,
    cubeY: 27.2,
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
    badgeX: 41.8,
    badgeY: 19.6,
    badgeW: 12.0,
    badgeH: 5.2,
    cubeX: 41.8,
    cubeY: 27.8,
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
    badgeX: 69.7,
    badgeY: 26.1,
    badgeW: 11.5,
    badgeH: 5.4,
    cubeX: 69.7,
    cubeY: 33.0,
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
    badgeX: 17.5, // Moved comfortably to the right from edge
    badgeY: 45.0,
    badgeW: 8.5,
    badgeH: 4.8,
    cubeX: 17.5, // Strictly vertically aligned
    cubeY: 52.8,
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
    badgeX: 51.2,
    badgeY: 43.7,
    badgeW: 9.0,
    badgeH: 4.8,
    cubeX: 51.2, // Strictly vertically aligned
    cubeY: 51.4,
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
    badgeX: 83.5, // Dragged inside from 90.39% to prevent moving out of frame
    badgeY: 37.2,
    badgeW: 10.5,
    badgeH: 4.8,
    cubeX: 83.5, // Strictly vertically aligned
    cubeY: 44.8,
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
    badgeX: 32.9,
    badgeY: 65.8,
    badgeW: 9.0,
    badgeH: 4.8,
    cubeX: 32.9, // Strictly vertically aligned
    cubeY: 73.2,
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
    badgeX: 58.5,
    badgeY: 75.5,
    badgeW: 9.5,
    badgeH: 4.8,
    cubeX: 58.5, // Strictly vertically aligned
    cubeY: 83.2,
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
    badgeX: 81.5,
    badgeY: 58.8,
    badgeW: 9.5,
    badgeH: 4.8,
    cubeX: 81.5, // Strictly vertically aligned
    cubeY: 66.5,
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
  const [rotationSpeed, setRotationSpeed] = useState<number>(12); // seconds per 360 rotation
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
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
          ref={imgRef}
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
      <div className="relative z-20 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
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
          {/* Concealment patches to completely remove old baked-in duplicate boxes and badges behind Scientists and Media */}
          {/* 1. Remove old Scientists Cube Box at (12.19%, 52.54%) */}
          <div
            id="conceal-old-scientists-cube-box"
            className="absolute pointer-events-none z-20 rounded-full"
            style={{
              left: '12.19%',
              top: '52.54%',
              transform: 'translate(-50%, -50%)',
              width: `${Math.max(68, Math.round((8.8 * imgBox.width) / 100))}px`,
              height: `${Math.max(68, Math.round((10.2 * imgBox.height) / 100))}px`,
              background: 'radial-gradient(ellipse at center, #051934 0%, #04142b 50%, #030e20 75%, rgba(3, 14, 32, 0) 100%)',
              boxShadow: '0 0 28px rgba(4, 20, 43, 0.98)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {/* Core opaque disc to completely erase the glowing icon and cube wireframe */}
            <div
              className="absolute inset-2 rounded-full"
              style={{
                backgroundColor: '#04142b',
                opacity: 0.98,
                filter: 'blur(5px)',
              }}
            />
          </div>

          {/* 2. Remove old Scientists Badge at (8.33%, 45.07%) */}
          <div
            id="conceal-old-scientists-spot"
            className="absolute pointer-events-none z-20 rounded-full"
            style={{
              left: '8.33%',
              top: '45.07%',
              transform: 'translate(-50%, -50%)',
              width: `${Math.round((8.5 * imgBox.width) / 100) + 20}px`,
              height: `${Math.round((4.8 * imgBox.height) / 100) + 14}px`,
              background: 'radial-gradient(ellipse at center, #06172e 0%, #04142a 60%, rgba(4, 20, 42, 0) 100%)',
              boxShadow: '0 0 20px rgba(4, 20, 42, 0.98)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
            }}
          >
            <div
              className="absolute inset-1 rounded-full"
              style={{
                backgroundColor: '#04142a',
                opacity: 0.98,
                filter: 'blur(3px)',
              }}
            />
          </div>

          {/* 3. Remove old Media & Visuals Cube Box at (88.85%, 45.17%) */}
          <div
            id="conceal-old-media-cube-box"
            className="absolute pointer-events-none z-20 rounded-full"
            style={{
              left: '88.85%',
              top: '45.17%',
              transform: 'translate(-50%, -50%)',
              width: `${Math.max(68, Math.round((8.8 * imgBox.width) / 100))}px`,
              height: `${Math.max(68, Math.round((10.2 * imgBox.height) / 100))}px`,
              background: 'radial-gradient(ellipse at center, #061c39 0%, #051732 50%, #031024 75%, rgba(3, 16, 36, 0) 100%)',
              boxShadow: '0 0 28px rgba(5, 23, 50, 0.98)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {/* Core opaque disc to completely erase the glowing icon and cube wireframe */}
            <div
              className="absolute inset-2 rounded-full"
              style={{
                backgroundColor: '#051833',
                opacity: 0.98,
                filter: 'blur(5px)',
              }}
            />
          </div>

          {/* 4. Remove old Media & Visuals Badge at (90.39%, 37.18%) */}
          <div
            id="conceal-old-media-spot"
            className="absolute pointer-events-none z-20 rounded-full"
            style={{
              left: '90.39%',
              top: '37.18%',
              transform: 'translate(-50%, -50%)',
              width: `${Math.round((10.5 * imgBox.width) / 100) + 20}px`,
              height: `${Math.round((4.8 * imgBox.height) / 100) + 14}px`,
              background: 'radial-gradient(ellipse at center, #071933 0%, #05162e 60%, rgba(5, 22, 46, 0) 100%)',
              boxShadow: '0 0 20px rgba(5, 22, 46, 0.98)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
            }}
          >
            <div
              className="absolute inset-1 rounded-full"
              style={{
                backgroundColor: '#051730',
                opacity: 0.98,
                filter: 'blur(3px)',
              }}
            />
          </div>

          {/* 5. Complete eradication of background Research badge graphic */}
          <div
            id="conceal-old-research-spot"
            className="absolute pointer-events-none z-20 rounded-full"
            style={{
              left: '16.3%',
              top: '20.0%',
              transform: 'translate(-50%, -50%)',
              width: `${Math.max(225, Math.round((15.5 * imgBox.width) / 100))}px`,
              height: `${Math.max(50, Math.round((5.6 * imgBox.height) / 100))}px`,
              backgroundColor: '#030e1f',
              boxShadow: '0 0 16px rgba(3, 14, 31, 0.98)',
              opacity: 0.98,
            }}
          />

          {/* 6. Complete eradication of background Datasets badge graphic */}
          <div
            id="conceal-old-datasets-spot"
            className="absolute pointer-events-none z-20 rounded-full"
            style={{
              left: '69.7%',
              top: '26.1%',
              transform: 'translate(-50%, -50%)',
              width: `${Math.max(165, Math.round((12.0 * imgBox.width) / 100))}px`,
              height: `${Math.max(52, Math.round((5.8 * imgBox.height) / 100))}px`,
              backgroundColor: '#030e1f',
              boxShadow: '0 0 16px rgba(3, 14, 31, 0.98)',
              opacity: 0.98,
            }}
          />

          {EXACT_HOTSPOTS.map((hotspot) => {
            const isHovered = activeHotspot?.id === hotspot.id;
            const Icon = hotspot.icon;
            const boxSizePx = Math.max(50, Math.round((hotspot.cubeSize / 100) * imgBox.width));

            return (
              <React.Fragment key={hotspot.id}>
                {/* Visual Connector Line between Main Topic Badge and 3D Cube (Strictly Vertical Beam) */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-20"
                  style={{ overflow: 'visible' }}
                >
                  <line
                    x1={`${hotspot.badgeX}%`}
                    y1={`${hotspot.badgeY + 2.2}%`}
                    x2={`${hotspot.cubeX}%`}
                    y2={`${hotspot.cubeY - 2.8}%`}
                    stroke={
                      hotspot.id === 'claims'
                        ? isHovered
                          ? '#34d399'
                          : 'rgba(52, 211, 153, 0.55)'
                        : isHovered
                        ? '#22d3ee'
                        : 'rgba(56, 189, 248, 0.55)'
                    }
                    strokeWidth={isHovered ? 2 : 1.5}
                    strokeDasharray={isHovered ? 'none' : '3 3'}
                  />
                </svg>

                {/* 1. THE MAIN TOPIC BADGE - Positioned with 100% opaque coverage eliminating any background duplicates */}
                <div
                  id={`hotspot-badge-${hotspot.id}`}
                  onClick={() => onNavigate(hotspot.view)}
                  onMouseEnter={() => setActiveHotspot(hotspot)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  style={{
                    left: `${hotspot.badgeX}%`,
                    top: `${hotspot.badgeY}%`,
                    transform: 'translate(-50%, -50%)',
                    minWidth: `${Math.max(
                      hotspot.id === 'research' ? 220 : 130,
                      Math.round((hotspot.badgeW * imgBox.width) / 100) + 16
                    )}px`,
                    minHeight: `${Math.max(46, Math.round((hotspot.badgeH * imgBox.height) / 100) + 10)}px`,
                  }}
                  className="absolute z-40 flex items-center justify-center cursor-pointer pointer-events-auto select-none group"
                  title={`Open ${hotspot.name}`}
                >
                  {/* Opaque Concealment Backing Shield - strictly eliminates any background duplicate edges, halos, or ghost text */}
                  <div
                    className="absolute -inset-2 rounded-full pointer-events-none"
                    style={{
                      backgroundColor:
                        hotspot.id === 'claims'
                          ? '#041814'
                          : hotspot.id === 'ai'
                          ? '#04162e'
                          : '#030e1f',
                      boxShadow: '0 0 16px rgba(3, 14, 31, 0.98)',
                      zIndex: -1,
                    }}
                  />

                  <div
                    className={`w-full h-full flex items-center justify-between gap-2 px-4 py-2 rounded-full transition-all duration-200 shadow-xl ${
                      isHovered
                        ? 'scale-105 ring-2 ring-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.95)]'
                        : 'shadow-lg group-hover:scale-102'
                    }`}
                    style={{
                      backgroundColor:
                        hotspot.id === 'claims'
                          ? '#051f1a'
                          : hotspot.id === 'ai'
                          ? '#051a36'
                          : '#051326',
                      border: `1.5px solid ${
                        hotspot.id === 'claims'
                          ? '#34d399'
                          : hotspot.id === 'ai'
                          ? '#22d3ee'
                          : isHovered
                          ? '#38bdf8'
                          : 'rgba(56, 189, 248, 0.75)'
                      }`,
                      boxShadow: isHovered
                        ? `0 0 22px ${
                            hotspot.id === 'claims'
                              ? '#34d399'
                              : hotspot.id === 'ai'
                              ? '#22d3ee'
                              : hotspot.color
                          }`
                        : `0 0 12px ${
                            hotspot.id === 'claims'
                              ? '#34d39955'
                              : hotspot.id === 'ai'
                              ? '#22d3ee55'
                              : 'rgba(56,189,248,0.3)'
                          }`,
                    }}
                  >
                    {/* Glowing Live Status Beacon */}
                    <span
                      className="w-2 h-2 rounded-full shrink-0 animate-ping"
                      style={{
                        backgroundColor:
                          hotspot.id === 'claims'
                            ? '#34d399'
                            : hotspot.id === 'ai'
                            ? '#22d3ee'
                            : '#38bdf8',
                      }}
                    />

                    {/* Topic Icon */}
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        hotspot.id === 'claims'
                          ? 'text-emerald-300'
                          : hotspot.id === 'ai'
                          ? 'text-cyan-300 animate-pulse'
                          : 'text-sky-300'
                      }`}
                    />

                    {/* Main Topic Name */}
                    <span
                      className={`text-xs font-black tracking-wider uppercase font-['Outfit'] whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${
                        hotspot.id === 'claims'
                          ? 'text-emerald-200'
                          : hotspot.id === 'ai'
                          ? 'text-cyan-100'
                          : 'text-white'
                      }`}
                    >
                      {hotspot.badgeLabel}
                    </span>

                    {/* Special Neon Tags for Key Pages */}
                    {hotspot.id === 'claims' && (
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black font-mono tracking-tight shadow-sm">
                        FACTS
                      </span>
                    )}
                    {hotspot.id === 'ai' && (
                      <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 text-[9px] font-black font-mono tracking-tight shadow-sm">
                        AI
                      </span>
                    )}

                    {/* Arrow */}
                    <span className="text-xs text-cyan-400 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                      →
                    </span>
                  </div>
                </div>

                {/* 2. 3D ROTATING HOLOGRAPHIC CUBE - Centered at its original measured coordinate */}
                <div
                  id={`hotspot-cube-${hotspot.id}`}
                  onClick={() => onNavigate(hotspot.view)}
                  onMouseEnter={() => setActiveHotspot(hotspot)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  style={{
                    left: `${hotspot.cubeX}%`,
                    top: `${hotspot.cubeY}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute z-30 flex items-center justify-center cursor-pointer pointer-events-auto select-none"
                  title={`Open ${hotspot.name} (${hotspot.badgeLabel})`}
                >
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
