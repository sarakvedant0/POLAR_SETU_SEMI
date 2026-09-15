import React, { useState, useEffect } from 'react';
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
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  Tag,
  KeyRound,
  GraduationCap,
  LogOut,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import { USER_BADGES } from '../data/mockData';
import { polarDataService } from '../services/dataService';
import { authService } from '../services/authService';
import { UserBadge, ViewMode, ResearchReport, SavedItem } from '../types';
import { TopLeftBackButton } from '../components/TopLeftBackButton';
import { OnboardingModal } from '../components/OnboardingModal';
import { AuthModal } from '../components/AuthModal';

interface ProfileFeedViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
  earnedBadges: UserBadge[];
}

export const ProfileFeedView: React.FC<ProfileFeedViewProps> = ({
  onNavigate,
  earnedBadges,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'saved' | 'badges' | 'profile'>('feed');
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>(authService.getSavedItems());

  useEffect(() => {
    const unsub = authService.subscribe((user) => {
      setCurrentUser(user);
      setSavedItems(authService.getSavedItems());
    });
    return unsub;
  }, []);

  const allReports = polarDataService.getReports();
  const allPosts = polarDataService.getCommunityPosts();
  const allMedia = polarDataService.getMedia();

  // Filter content based on user's interests
  const userInterests = currentUser?.interests || ['Climate Change & Ice Melt', 'Glacier Dynamics'];

  const matchedReports = allReports.filter((r) => {
    if (userInterests.length === 0) return true;
    return userInterests.some((interest) =>
      r.researchArea.toLowerCase().includes(interest.toLowerCase()) ||
      r.title.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(r.researchArea.toLowerCase())
    );
  });

  const feedReports = matchedReports.length > 0 ? matchedReports : allReports.slice(0, 4);

  const matchedPosts = allPosts.filter((p) => {
    if (userInterests.length === 0) return true;
    return userInterests.some((interest) =>
      p.title.toLowerCase().includes(interest.toLowerCase()) ||
      p.content.toLowerCase().includes(interest.toLowerCase()) ||
      p.tags?.some((t) => interest.toLowerCase().includes(t.toLowerCase()))
    );
  });

  return (
    <div id="profile-feed-view" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Left Back Button */}
      <TopLeftBackButton onBack={() => onNavigate('home')} currentView="profile" targetLabel="Home" />

      {/* User Header Profile Card */}
      {!currentUser ? (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#08182f] via-[#091f3d] to-[#061426] border border-cyan-700/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-slate-800/90 border-2 border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <User className="w-10 h-10" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-extrabold text-white font-['Outfit']">Polar Explorer</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-cyan-300 border border-cyan-700/50">
                  Guest Mode
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                You are currently exploring in guest mode. To personalize your research feed, follow scientists, save publications, and earn verified polar badges, please sign up or log in.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-400">
                <span>0 Research XP</span>
                <span>•</span>
                <span>{savedItems.length} Temporary Bookmarks</span>
                <span>•</span>
                <span>Public Feed Preview</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign Up / Log In</span>
            </button>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
              <span>Filter Topics</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#08182f] via-[#091f3d] to-[#061426] border border-cyan-700/60 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <img
              src={currentUser.avatarUrl || currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt="Researcher Avatar"
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
            />
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-cyan-500 text-slate-950 font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
                {currentUser.displayName || currentUser.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-600">
                <KeyRound className="w-3 h-3 text-cyan-400" />
                <span>{currentUser.username}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600">
                {currentUser.role}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {currentUser.bio ||
                'Cryosphere Research Fellow • Investigating Antarctic ice shelf grounding line dynamics, satellite radar altimetry, and Indian polar station telemetry.'}
            </p>

            {currentUser.purpose && (
              <div className="text-xs text-cyan-300 flex items-center justify-center md:justify-start gap-1.5 pt-1">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Primary Mission: {currentUser.purpose}</span>
              </div>
            )}

            {/* User Interests Chips */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-1.5">
              <span className="text-xs text-slate-400 mr-1">Active Interests:</span>
              {userInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-cyan-950/80 border border-cyan-800 text-cyan-200"
                >
                  {interest}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-3 text-xs text-slate-400">
              <div>
                <span className="font-bold text-white text-sm">{currentUser.xp || 240}</span> Research XP
              </div>
              <div>
                <span className="font-bold text-white text-sm">{savedItems.length}</span> Saved Items
              </div>
              <div>
                <span className="font-bold text-white text-sm">{earnedBadges.length}</span> Badges Earned
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Personalize Interests</span>
            </button>
            <button
              onClick={() => {
                authService.logout();
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-rose-950/40 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-700/60 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Log Out (Guest Mode)</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs overflow-x-auto">
        {[
          { id: 'feed', label: `Personalized Feed (${feedReports.length + matchedPosts.length})`, icon: Sparkles },
          { id: 'saved', label: `Saved Passport Items (${savedItems.length})`, icon: Bookmark },
          { id: 'badges', label: `Badges & Honors (${earnedBadges.length})`, icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
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
        <div className="space-y-6">
          {/* Active Personalization Banner */}
          <div className="p-5 rounded-2xl bg-[#08182f] border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  Curated for your profile role: <strong className="text-cyan-300">{currentUser?.role || 'Researcher'}</strong>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Showing verified research & community posts matching: {userInterests.join(', ')}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              Adjust Interests
            </button>
          </div>

          {/* Research Reports Matching Interests */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Recommended Research Papers for You</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedReports.map((r) => (
                <div
                  key={r.id}
                  onClick={() => onNavigate('report-detail', r.id)}
                  className="p-5 rounded-2xl bg-[#08172c] hover:bg-[#0a2347] border border-cyan-900/60 hover:border-cyan-400 cursor-pointer transition-all space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-800">
                        {r.researchArea}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">Matched Interest</span>
                    </div>
                    <div className="text-sm font-bold text-white line-clamp-2 font-['Outfit'] mt-2">
                      {r.title}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {r.abstract}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{r.authors[0]}</span>
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      <span>Read Publication</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Voice Posts Matching Interests */}
          {matchedPosts.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <h2 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Field Voices & Observations Matching Interests</span>
              </h2>
              <div className="space-y-3">
                {matchedPosts.slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onNavigate('voices')}
                    className="p-4 rounded-2xl bg-[#08172c] hover:bg-[#0c274f] border border-cyan-900/50 hover:border-cyan-500/60 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{post.authorName}</span>
                        <span className="text-[11px] text-slate-400">• {post.type}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                        AI Verified
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-200">{post.title}</div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{post.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Items */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-['Outfit']">
              Your Saved Items & Research Passport
            </h2>
            <button
              onClick={() => onNavigate('saved')}
              className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Open Dedicated Saved Tab</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {savedItems.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#08172c] border border-cyan-900/40 space-y-3">
              <Bookmark className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="text-sm font-bold text-white">No items saved yet</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Save research papers, expedition media, and community posts by clicking the bookmark icon on any item.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.type === 'research') onNavigate('report-detail', item.id);
                    else if (item.type === 'media') onNavigate('media');
                    else if (item.type === 'post') onNavigate('voices');
                    else if (item.type === 'expedition') onNavigate('expeditions');
                  }}
                  className="p-4 rounded-2xl bg-[#08172c] hover:bg-[#0d274c] border border-cyan-900/60 hover:border-cyan-400 transition-all cursor-pointer flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-300 flex-shrink-0">
                    {item.type === 'media' && <ImageIcon className="w-5 h-5" />}
                    {item.type === 'research' && <FileText className="w-5 h-5" />}
                    {item.type !== 'media' && item.type !== 'research' && <Bookmark className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">{item.type}</span>
                    <h3 className="text-xs font-bold text-white line-clamp-1 mt-0.5">{item.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.author || item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Badges Showcase */}
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

      {/* Onboarding Questionnaire Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(profile) => {
          setCurrentUser(authService.getCurrentUser());
          setIsOnboardingOpen(false);
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthOpen(false);
        }}
        onOpenOnboarding={() => {
          setIsAuthOpen(false);
          setIsOnboardingOpen(true);
        }}
      />
    </div>
  );
};
