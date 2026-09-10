import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, ShieldCheck, Sparkles, X, Check } from 'lucide-react';
import { UserBadge } from '../types';

interface BadgeAwardModalProps {
  badge: UserBadge | null;
  onClose: () => void;
}

export const BadgeAwardModal: React.FC<BadgeAwardModalProps> = ({ badge, onClose }) => {
  useEffect(() => {
    if (badge) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#0284c7', '#34d399', '#facc15', '#ffffff'],
      });
    }
  }, [badge]);

  if (!badge) return null;

  return (
    <div
      id="badge-award-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/85 backdrop-blur-md"
    >
      <div
        id="badge-award-modal-card"
        className="relative w-full max-w-md bg-[#08172c] border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(56,189,248,0.35)] flex flex-col items-center gap-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/60"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 3D Glowing Badge Container */}
        <div className="relative w-28 h-28 my-2 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping opacity-75" />
          <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-400 to-blue-300 shadow-[0_0_30px_#38bdf8] flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#061427] flex items-center justify-center text-cyan-300">
              <ShieldCheck className="w-10 h-10 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scientific Badge Unlocked</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white font-['Outfit']">
            {badge.name}
          </h3>
        </div>

        <p className="text-sm text-slate-300 max-w-xs">{badge.description}</p>

        {badge.evidenceReference && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
            Grounding: {badge.evidenceReference}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-2 w-full py-3 rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
        >
          Claim Scientific Recognition
        </button>
      </div>
    </div>
  );
};
