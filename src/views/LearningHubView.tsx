import React, { useState } from 'react';
import {
  GraduationCap,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Sliders,
  Layers,
  Thermometer,
  Wind,
  ArrowRight,
} from 'lucide-react';
import { LEARNING_MODULES } from '../data/mockData';
import { ViewMode } from '../types';

interface LearningHubViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const LearningHubView: React.FC<LearningHubViewProps> = ({ onNavigate }) => {
  // Glacier simulation states
  const [ambientTemp, setAmbientTemp] = useState<number>(-2.5); // in °C
  const [oceanWarming, setOceanWarming] = useState<number>(1.2); // in °C
  const [snowAccumulation, setSnowAccumulation] = useState<number>(350); // mm/year

  // Derived simulation indicators
  const calculatedMeltVelocity = Math.max(
    0.2,
    Number((0.8 + oceanWarming * 1.4 + (ambientTemp + 5) * 0.3 - snowAccumulation * 0.001).toFixed(2))
  );

  const calculatedIceShelfThickness = Math.max(
    80,
    Math.round(420 - oceanWarming * 45 - (ambientTemp + 5) * 12 + snowAccumulation * 0.15)
  );

  const riskLevel =
    calculatedMeltVelocity > 3.0 ? 'CRITICAL' : calculatedMeltVelocity > 1.8 ? 'ELEVATED' : 'STABLE';

  return (
    <div id="learning-hub-view" className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Interactive Polar Education</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Polar Science Learning Hub & 3D Glacier Lab
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Master the physics of ice sheets, polar oceanography, and atmospheric teleconnections through guided modules and interactive cryospheric simulations.
          </p>
        </div>

        <button
          onClick={() => onNavigate('quiz')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Take Polar Science Quiz</span>
        </button>
      </div>

      {/* FEATURED: Interactive 3D Glacier & Ice Sheet Lab Simulation */}
      <div
        id="glacier-simulation-container"
        className="p-6 sm:p-8 rounded-3xl bg-[#08182f] border-2 border-cyan-500/40 shadow-2xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-900/60 pb-4">
          <div>
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Interactive Cryosphere Simulator</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1 font-['Outfit']">
              Sub-Ice Shelf Ocean Thermal Dynamic Simulation
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Glacier Stability:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                riskLevel === 'CRITICAL'
                  ? 'bg-rose-950 text-rose-300 border border-rose-600'
                  : riskLevel === 'ELEVATED'
                  ? 'bg-amber-950 text-amber-300 border border-amber-600'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-600'
              }`}
            >
              {riskLevel}
            </span>
          </div>
        </div>

        {/* Simulation Canvas & Visual Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Simulation Visual representation (SVG cross section of glacier & ocean) */}
          <div className="lg:col-span-7 bg-[#040d1a] border border-cyan-950 rounded-2xl p-6 relative overflow-hidden h-72 flex flex-col justify-between">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between z-10">
              <span>Schematic: Antarctic Continental Margin</span>
              <span className="text-cyan-400 font-mono">
                Melt Rate: {calculatedMeltVelocity} m/yr
              </span>
            </div>

            {/* SVG Visual Model */}
            <div className="w-full h-44 relative mt-2">
              <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
                {/* Sky */}
                <rect x="0" y="0" width="500" height="70" fill="#061224" />

                {/* Ocean deep water */}
                <rect x="220" y="70" width="280" height="110" fill="#041b3a" />

                {/* Warm CDW intrusion arrow */}
                <path
                  d="M 480 160 Q 350 140 280 110"
                  fill="none"
                  stroke={oceanWarming > 1.5 ? '#f43f5e' : '#38bdf8'}
                  strokeWidth="4"
                  strokeDasharray="6 4"
                  className="animate-dash"
                />

                {/* Land bedrock */}
                <polygon points="0,180 0,60 180,100 240,180" fill="#1e293b" />

                {/* Ice Sheet & Floating Shelf (scales with thickness) */}
                {(() => {
                  const shelfBottomY = 70 + (420 - calculatedIceShelfThickness) * 0.18;
                  return (
                    <polygon
                      points={`0,30 200,45 460,55 460,${shelfBottomY} 220,105 180,90 0,50`}
                      fill="#e0f2fe"
                      opacity="0.95"
                    />
                  );
                })()}

                {/* Water surface label */}
                <text x="320" y="85" fill="#38bdf8" fontSize="10" fontWeight="bold">
                  Southern Ocean
                </text>
                <text x="50" y="45" fill="#0f172a" fontSize="10" fontWeight="bold">
                  Grounded Ice
                </text>
                <text x="300" y="50" fill="#0f172a" fontSize="10" fontWeight="bold">
                  Floating Ice Shelf ({calculatedIceShelfThickness}m)
                </text>
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 z-10">
              <span>Bedrock: Queen Maud Land</span>
              <span className="text-cyan-300">
                Grounding Line Position: -18.2 km offset
              </span>
            </div>
          </div>

          {/* Sliders Controller (Col 5) */}
          <div className="lg:col-span-5 space-y-4 p-4 rounded-2xl bg-[#061427] border border-cyan-900/60 text-xs">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider font-['Outfit']">
              Environmental Forcing Controls
            </h3>

            {/* Slider 1: Circumpolar Deep Water Temperature */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                  Ocean CDW Temperature Anomaly:
                </span>
                <span className="font-bold text-cyan-300">+{oceanWarming}°C</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.1"
                value={oceanWarming}
                onChange={(e) => setOceanWarming(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Slider 2: Atmospheric Surface Temperature */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  Summer Air Temperature:
                </span>
                <span className="font-bold text-cyan-300">{ambientTemp}°C</span>
              </div>
              <input
                type="range"
                min="-10.0"
                max="4.0"
                step="0.5"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Slider 3: Annual Snow Accumulation */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Annual Snow Precipitation:</span>
                <span className="font-bold text-cyan-300">{snowAccumulation} mm/yr</span>
              </div>
              <input
                type="range"
                min="150"
                max="600"
                step="25"
                value={snowAccumulation}
                onChange={(e) => setSnowAccumulation(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#091f3d] border border-cyan-700/50 mt-2 text-[11px] text-slate-300 space-y-1">
              <div className="font-bold text-cyan-300">Scientific Takeaway:</div>
              <div>
                Ocean thermal forcing at the sub-shelf cavity drives over 80% of Antarctic mass loss, outpacing direct surface air melting by a factor of four.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Learning Modules List */}
      <div>
        <h2 className="text-2xl font-bold text-white font-['Outfit'] mb-4">
          Curated Polar Science Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LEARNING_MODULES.map((mod) => (
            <div
              key={mod.id}
              className="p-6 rounded-3xl bg-[#08172c]/90 border border-cyan-900/60 hover:border-cyan-400/80 transition-all flex flex-col justify-between gap-4 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                    {mod.level}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{mod.duration}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-['Outfit']">{mod.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{mod.description}</p>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Lessons in this Module ({mod.lessonsCount}):
                </div>
                {(mod.lessons || []).slice(0, 3).map((lesson, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{lesson.title}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">+{mod.lessonsCount * 50} XP</span>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Module</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
