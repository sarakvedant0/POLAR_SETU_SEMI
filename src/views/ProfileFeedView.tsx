import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Bookmark,
  Bell,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { USER_BADGES, RESEARCH_REPORTS, CLAIMS } from '../data/mockData';
import { UserBadge, ViewMode } from '../types';

interface ProfileFeedViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
  earnedBadges: UserBadge[];
}

export const ProfileFeedView: React.FC<ProfileFeedViewProps> = ({
  onNavigate,
  earnedBadges,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'badges' | 'watched' | 'saved'>('feed');

  const savedReports = RESEARCH_REPORTS.slice(0, 2);
  const watchedClaims = CLAIMS.slice(0, 2);

  return (
    <div id="profile-feed-view" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="p-8 rounded-3xl bg-[#08172c] border border-cyan-800/80 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
            alt="Researcher Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
          />
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-cyan-500 text-slate-950 font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              Dr. Ananya Sharma
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
              Verified Polar Researcher
            </span>
          </div>

          <p className="text-xs text-slate-300 max-w-xl">
            Cryosphere Research Fellow • Specializing in Antarctic ice shelf grounding line dynamics and remote sensing altimetry.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 pt-2 text-xs text-slate-400">
            <div>
              <span className="font-bold text-white text-sm">340</span> Research XP
            </div>
            <div>
              <span className="font-bold text-white text-sm">{earnedBadges.length}</span> Badges Earned
            </div>
            <div>
              <span className="font-bold text-white text-sm">{watchedClaims.length}</span> Watched Claims
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        {[
          { id: 'feed', label: 'My Personalized Polar Feed', icon: Sparkles },
          { id: 'badges', label: `Badge Showcase (${earnedBadges.length})`, icon: Award },
          { id: 'watched', label: `Watched Claims (${watchedClaims.length})`, icon: Bell },
          { id: 'saved', label: `Saved Papers (${savedReports.length})`, icon: Bookmark },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                active
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Personalized Feed */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#08182f] border border-cyan-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-sm font-bold text-white">
                  New Evidence Alert: 43rd Expedition CTD Transect Uploaded
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Matches your research interest: "Antarctic Ice Shelf Melt Rates"
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('datasets')}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-xs font-semibold cursor-pointer"
            >
              View Dataset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RESEARCH_REPORTS.map((r) => (
              <div
                key={r.id}
                onClick={() => onNavigate('report-detail', r.id)}
                className="p-4 rounded-2xl bg-[#08172c] hover:bg-cyan-950/60 border border-cyan-900/60 hover:border-cyan-400 cursor-pointer transition-all space-y-2"
              >
                <div className="text-[10px] font-bold text-cyan-400 uppercase">
                  {r.researchArea} • Recommended for You
                </div>
                <div className="text-sm font-bold text-white line-clamp-1 font-['Outfit']">
                  {r.title}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{r.abstract}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Badge Showcase */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {USER_BADGES.map((badge) => {
            const isUnlocked = earnedBadges.some((b) => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`p-6 rounded-3xl border flex items-start gap-4 transition-all ${
                  isUnlocked
                    ? 'bg-[#08182f] border-cyan-400 shadow-[0_0_30px_rgba(56,189,248,0.2)]'
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 flex-shrink-0">
                  <Award className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-['Outfit']">{badge.name}</h3>
                    {isUnlocked ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500">
                        Earned
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{badge.description}</p>
                  {badge.evidenceReference && (
                    <div className="text-[11px] text-cyan-400 pt-1">
                      Citation: {badge.evidenceReference}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Watched Claims */}
      {activeTab === 'watched' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            You will receive an automated notification whenever an expedition uploads new radar altimetry or observational logs relevant to these claims.
          </p>
          <div className="space-y-3">
            {watchedClaims.map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigate('claim-detail', c.id)}
                className="p-4 rounded-2xl bg-[#08172c] border border-cyan-900/60 hover:border-cyan-400 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">
                    {c.category} • Status: {c.status}
                  </span>
                  <div className="text-sm font-bold text-white mt-0.5">"{c.claimText}"</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Saved Papers */}
      {activeTab === 'saved' && (
        <div className="space-y-3">
          {savedReports.map((r) => (
            <div
              key={r.id}
              onClick={() => onNavigate('report-detail', r.id)}
              className="p-4 rounded-2xl bg-[#08172c] border border-cyan-900/60 hover:border-cyan-400 cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase">
                  {r.researchArea} • DOI: {r.doi}
                </span>
                <div className="text-sm font-bold text-white mt-0.5">{r.title}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
