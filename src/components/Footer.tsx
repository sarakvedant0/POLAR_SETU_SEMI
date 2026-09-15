import React from 'react';
import { Mountain, Shield, ArrowRight, ExternalLink, Heart } from 'lucide-react';
import { ViewMode } from '../types';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer
      id="main-footer"
      className="w-full bg-[#030914] border-t border-cyan-950/80 text-slate-400 text-xs mt-16"
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-300 flex items-center justify-center text-[#031127]">
                <Mountain className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold tracking-wider text-xl text-white font-['Outfit']">
                POLARSETU
              </span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed text-xs">
              "From Scientific Research to Public Understanding."
              <br />
              India's premier AI-assisted integrated polar science platform connecting expeditions,
              peer-reviewed publications, open cryosphere datasets, and community contributions from the Arctic and Antarctic.
            </p>
            <div className="text-[11px] text-cyan-400/90 font-mono">
              Managed in collaboration with NCPOR & Ministry of Earth Sciences (MoES)
            </div>
          </div>

          {/* Col 2: Scientific Discovery */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-bold text-white text-sm font-['Outfit']">Scientific Ecosystem</h4>
            <button
              onClick={() => onNavigate('explore')}
              className="text-left hover:text-cyan-300 transition-colors"
            >
              3D Knowledge Explorer
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="text-left hover:text-cyan-300 transition-colors"
            >
              Trending Research Stories
            </button>
            <button
              onClick={() => onNavigate('expeditions')}
              className="text-left hover:text-cyan-300 transition-colors"
            >
              Indian Polar Expeditions
            </button>
            <button
              onClick={() => onNavigate('research')}
              className="text-left hover:text-cyan-300 transition-colors"
            >
              Publications Repository
            </button>
            <button
              onClick={() => onNavigate('datasets')}
              className="text-left hover:text-cyan-300 transition-colors"
            >
              Cryospheric Datasets
            </button>
          </div>

          {/* Col 3: Trust & Community */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-bold text-white text-sm font-['Outfit']">Trust & Learning</h4>
            <button
              onClick={() => onNavigate('claims')}
              className="text-left hover:text-cyan-300 transition-colors"
            >
              Polar Myths & Claims
            </button>
            <button
              onClick={() => onNavigate('facts')}
              className="text-left hover:text-cyan-300 transition-colors"
            >
              Verified Polar Facts
            </button>
            <button
              onClick={() => onNavigate('voices')}
              className="text-left hover:text-cyan-300 transition-colors"
            >
              Polar Voices Community
            </button>
            <button
              onClick={() => onNavigate('learning')}
              className="text-left hover:text-cyan-300 transition-colors"
            >
              Interactive Learning Hub
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className="text-left hover:text-cyan-300 transition-colors"
            >
              Research-Based Quiz
            </button>
          </div>

          {/* Col 4: Intelligence & Portal */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-bold text-white text-sm font-['Outfit']">Portal Governance</h4>
            <button
              onClick={() => onNavigate('ai')}
              className="text-left hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <span>Polar AI Console</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                RAG
              </span>
            </button>
            <button
              onClick={() => onNavigate('scientists')}
              className="text-left hover:text-cyan-300 transition-colors"
            >
              Verified Scientists
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="text-left hover:text-cyan-300 transition-colors"
            >
              My Feed & Badges
            </button>
            <div className="h-px bg-slate-800 my-1" />
            <button
              onClick={() => onNavigate('admin')}
              className="text-left text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin & Review Portal</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} POLARSETU • Built for Indian Polar Research & Public Understanding. All data verified against peer-reviewed citations.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Stations: Maitri • Bharati • Himadri</span>
            <span>•</span>
            <span className="text-cyan-400">Open Science Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
