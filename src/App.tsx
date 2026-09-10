import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroOverlay } from './components/HeroOverlay';
import { HomeSections } from './components/HomeSections';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { BadgeAwardModal } from './components/BadgeAwardModal';

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

import { USER_BADGES, SCIENTIFIC_NODES, EXPEDITIONS, POLAR_FACTS, CLAIMS } from './data/mockData';
import { polarDataService } from './services/dataService';
import { Polar3DScene } from './components/3d/Polar3DScene';
import { PolarExactBackgroundHero } from './components/PolarExactBackgroundHero';
import { ViewMode, UserBadge, ResearchReport } from './types';

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  const [aiPresetQuery, setAiPresetQuery] = useState<string>('');
  const [awardedBadge, setAwardedBadge] = useState<UserBadge | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([USER_BADGES[1]]);
  const [reports, setReports] = useState<ResearchReport[]>(polarDataService.getReports());

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
    if (view === 'report-detail' && id) {
      // Increment real live view starting from 0
      polarDataService.incrementReportViews(id);
    }
    setCurrentView(view);
    setSelectedId(id);
  };

  const handleOpenSearch = (initialQ?: string) => {
    setSearchInitialQuery(initialQ || '');
    setIsSearchOpen(true);
  };

  const handleAskAI = (query: string) => {
    setAiPresetQuery(query);
    setCurrentView('ai');
  };

  const handleBadgeAward = (badge: UserBadge) => {
    if (!earnedBadges.some((b) => b.id === badge.id)) {
      setEarnedBadges((prev) => [...prev, badge]);
    }
    setAwardedBadge(badge);
  };

  return (
    <div className="min-h-screen bg-[#030814] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Fixed Header Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => handleOpenSearch('')}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1 w-full flex flex-col pt-16">
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
    </div>
  );
}

export default App;
