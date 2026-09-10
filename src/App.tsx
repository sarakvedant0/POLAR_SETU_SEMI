import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroOverlay } from './components/HeroOverlay';
import { HomeSections } from './components/HomeSections';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { BadgeAwardModal } from './components/BadgeAwardModal';
import { TopLeftBackButton } from './components/TopLeftBackButton';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { UploadPostModal } from './components/UploadPostModal';
import { ReportContentModal } from './components/ReportContentModal';

// Views
import { ExploreView } from './views/ExploreView';
import { ReportsView } from './views/ReportsView';
import { ReportDetailView } from './views/ReportDetailView';
import { ExpeditionsView } from './views/ExpeditionsView';
import { ExpeditionDetailView } from './views/ExpeditionDetailView';
import { DatasetsView } from './views/DatasetsView';
import { ClaimsView } from './views/ClaimsView';
import { ClaimDetailView } from './views/ClaimDetailView';
import { FactsView } from './views/FactsView';
import { VoicesView } from './views/VoicesView';
import { CreateVoicePostView } from './views/CreateVoicePostView';
import { LearningHubView } from './views/LearningHubView';
import { QuizView } from './views/QuizView';
import { PolarAIView } from './views/PolarAIView';
import { ScientistsView } from './views/ScientistsView';
import { MediaView } from './views/MediaView';
import { ProfileFeedView } from './views/ProfileFeedView';
import { AdminPortalView } from './views/AdminPortalView';
import { SavedView } from './views/SavedView';

import { USER_BADGES, SCIENTIFIC_NODES, EXPEDITIONS, POLAR_FACTS, CLAIMS } from './data/mockData';
import { polarDataService } from './services/dataService';
import { authService } from './services/authService';
import { Polar3DScene } from './components/3d/Polar3DScene';
import { PolarExactBackgroundHero } from './components/PolarExactBackgroundHero';
import { ViewMode, UserBadge, ResearchReport } from './types';

interface NavHistoryEntry {
  view: ViewMode;
  id?: string;
}

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [viewHistory, setViewHistory] = useState<ViewMode[]>(['home']);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [navHistory, setNavHistory] = useState<NavHistoryEntry[]>([]);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  const [aiPresetQuery, setAiPresetQuery] = useState<string>('');
  const [awardedBadge, setAwardedBadge] = useState<UserBadge | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([USER_BADGES[1]]);
  const [reports, setReports] = useState<ResearchReport[]>(polarDataService.getReports());

  // Global Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'voice' | 'media' | 'report'>('voice');

  // Subscribe to real-time report modifications & live interaction updates
  useEffect(() => {
    const unsub = polarDataService.subscribe(() => {
      setReports(polarDataService.getReports());
    });
    return unsub;
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedId]);

  const handleNavigate = (view: ViewMode, id?: string) => {
    if (view !== currentView || id !== selectedId) {
      setNavHistory((prev) => [...prev, { view: currentView, id: selectedId }]);
    }

    if (view === 'report-detail' && id) {
      // Increment real live view starting from 0
      polarDataService.incrementReportViews(id);
    }

    setViewHistory((prev) => {
      const previous = prev[prev.length - 1];
      if (previous === view) {
        return prev;
      }
      return [...prev, view];
    });

    setCurrentView(view);
    setSelectedId(id);
  };

  const handleBack = () => {
<<<<<<< HEAD
    if (navHistory.length > 0) {
      const last = navHistory[navHistory.length - 1];
      setNavHistory((prev) => prev.slice(0, -1));
      setCurrentView(last.view);
      setSelectedId(last.id);
    } else {
      setCurrentView('home');
      setSelectedId(undefined);
    }
  };

  const getBackLabel = (): string => {
    if (navHistory.length > 0) {
      const prev = navHistory[navHistory.length - 1].view;
      const map: Record<string, string> = {
        home: 'Home',
        explore: 'Explore Polar Science',
        reports: 'Trending Reports',
        'report-detail': 'Report',
        expeditions: 'Expeditions',
        'expedition-detail': 'Expedition Details',
        datasets: 'Datasets',
        claims: 'Myths & Claims',
        'claim-detail': 'Claim Details',
        facts: 'Polar Facts',
        voices: 'Polar Voices',
        learning: 'Learning Hub',
        quiz: 'Quiz',
        media: 'Media Archive',
        profile: 'Profile & Feed',
        admin: 'Admin Portal',
        saved: 'Saved Items',
        ai: 'Polar AI',
      };
      return `Back to ${map[prev] || 'Previous'}`;
    }
    return 'Back to Home';
=======
    setViewHistory((prev) => {
      if (prev.length <= 1) {
        setCurrentView('home');
        setSelectedId(undefined);
        return ['home'];
      }

      const next = [...prev];
      next.pop();
      const previousView = next[next.length - 1] || 'home';
      setCurrentView(previousView);
      setSelectedId(undefined);
      return next;
    });
>>>>>>> 14abb3b (Update polar homepage styling and navigation)
  };

  const handleOpenSearch = (initialQ?: string) => {
    setSearchInitialQuery(initialQ || '');
    setIsSearchOpen(true);
  };

  const handleAskAI = (query: string) => {
    setAiPresetQuery(query);
    handleNavigate('ai');
  };

  const handleBadgeAward = (badge: UserBadge) => {
    if (!earnedBadges.some((b) => b.id === badge.id)) {
      setEarnedBadges((prev) => [...prev, badge]);
    }
    setAwardedBadge(badge);
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Fixed Header Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => handleOpenSearch('')}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenUpload={(type) => {
          setUploadType(type || 'voice');
          setIsUploadOpen(true);
        }}
      />

      {/* Dedicated Global Top-Left Back Button for EVERY single webpage */}
      {currentView !== 'home' && (
        <div
          id="global-page-back-banner"
          className="w-full bg-[#050e1d]/80 border-b border-cyan-950/40 sticky top-16 z-40 backdrop-blur-md"
        >
          <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
            <TopLeftBackButton
              onBack={handleBack}
              currentView={currentView}
              targetLabel={getBackLabel()}
              className="!mb-0"
            />

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-400/80">
              <span>NCPOR Polar Network</span>
              <span>/</span>
              <span className="text-white font-semibold uppercase">{currentView.replace('-', ' ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Dynamic View Content */}
<<<<<<< HEAD
      <main className={`flex-1 w-full flex flex-col ${currentView === 'home' ? 'pt-16' : 'pt-2'}`}>
=======
      <main className="flex-1 w-full flex flex-col pt-16">
        {currentView !== 'home' && (
          <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#071827]/90 border border-cyan-700/60 text-xs font-semibold text-cyan-200 hover:text-white hover:border-cyan-500/70 transition-all shadow-lg shadow-cyan-900/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>
        )}

>>>>>>> 14abb3b (Update polar homepage styling and navigation)
        {currentView === 'home' && (
          <>
            {/* Exact Panoramic Background Hero (bg3.png) with Interactive Holographic Nodes */}
            <PolarExactBackgroundHero
              onNavigate={handleNavigate}
              onSearchSubmit={(q) => handleOpenSearch(q)}
            />

            {/* Content Sections strictly matching website_home.png layout */}
            <HomeSections
              reports={reports}
              expeditions={EXPEDITIONS}
              facts={POLAR_FACTS}
              claims={CLAIMS}
              onNavigate={handleNavigate}
              onAskAI={handleAskAI}
            />
          </>
        )}

        {currentView === 'explore' && (
          <ExploreView onNavigate={handleNavigate} />
        )}

        {(currentView === 'reports' || (currentView as string) === 'research') && (
          <ReportsView onNavigate={handleNavigate} />
        )}

        {currentView === 'report-detail' && (
          <ReportDetailView
            reportId={selectedId}
            onNavigate={handleNavigate}
            onOpenAIQuery={handleAskAI}
          />
        )}

        {currentView === 'expeditions' && (
          <ExpeditionsView onNavigate={handleNavigate} />
        )}

        {currentView === 'expedition-detail' && (
          <ExpeditionDetailView
            expeditionId={selectedId}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'datasets' && (
          <DatasetsView onNavigate={handleNavigate} />
        )}

        {currentView === 'dataset-detail' && (
          <DatasetsView onNavigate={handleNavigate} />
        )}

        {currentView === 'claims' && (
          <ClaimsView onNavigate={handleNavigate} />
        )}

        {currentView === 'claim-detail' && (
          <ClaimDetailView claimId={selectedId} onNavigate={handleNavigate} />
        )}

        {currentView === 'facts' && (
          <FactsView onNavigate={handleNavigate} />
        )}

        {currentView === 'voices' && (
          <VoicesView onNavigate={handleNavigate} />
        )}

        {currentView === 'voices-create' && (
          <CreateVoicePostView
            onNavigate={handleNavigate}
            onPostCreated={() => handleNavigate('voices')}
          />
        )}

        {currentView === 'learning' && (
          <LearningHubView onNavigate={handleNavigate} />
        )}

        {currentView === 'quiz' && (
          <QuizView
            onNavigate={handleNavigate}
            onBadgeAwarded={handleBadgeAward}
          />
        )}

        {currentView === 'ai' && (
          <PolarAIView
            initialQuery={aiPresetQuery}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'scientists' && (
          <ScientistsView onNavigate={handleNavigate} />
        )}

        {currentView === 'media' && (
          <MediaView onNavigate={handleNavigate} />
        )}

        {currentView === 'profile' && (
          <ProfileFeedView
            onNavigate={handleNavigate}
            earnedBadges={earnedBadges}
          />
        )}

        {currentView === 'saved' && (
          <SavedView onNavigate={handleNavigate} />
        )}

        {currentView === 'admin' && (
          <AdminPortalView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer matching Indian Polar Science portal */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Universal Search Dialog */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        initialQuery={searchInitialQuery}
      />

      {/* 3D Badge Award Celebration Modal */}
      <BadgeAwardModal
        badge={awardedBadge}
        onClose={() => setAwardedBadge(null)}
      />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={() => setIsAuthOpen(false)}
        onOpenOnboarding={() => {
          setIsAuthOpen(false);
          setIsOnboardingOpen(true);
        }}
      />

      {/* Global Onboarding Questionnaire Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={() => setIsOnboardingOpen(false)}
      />

      {/* Global Universal Upload Modal */}
      <UploadPostModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        defaultType={uploadType}
        onSuccess={() => {
          setReports(polarDataService.getReports());
        }}
      />
    </div>
  );
}

export default App;
