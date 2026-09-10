import React, { useState } from 'react';
import {
  Mountain,
  Search,
  User,
  Menu,
  X,
  Compass,
  FileText,
  Ship,
  BookOpen,
  Database,
  Image as ImageIcon,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  GraduationCap,
  Sparkles,
  Shield,
} from 'lucide-react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenSearch: () => void;
  userXP?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  userXP = 240,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems: { label: string; view: ViewMode; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: 'Home', view: 'home', icon: Mountain },
    { label: 'Explore Polar Science', view: 'explore', icon: Compass },
    { label: 'Trending Reports', view: 'reports', icon: FileText },
    { label: 'Expeditions', view: 'expeditions', icon: Ship },
    { label: 'Research & Publications', view: 'research', icon: BookOpen },
    { label: 'Datasets', view: 'datasets', icon: Database },
    { label: 'Media & Visuals', view: 'media', icon: ImageIcon },
    { label: 'Polar Facts', view: 'facts', icon: CheckCircle2 },
    { label: 'Polar Myths & Claims', view: 'claims', icon: HelpCircle },
    { label: 'Polar Voices', view: 'voices', icon: MessageSquare },
    { label: 'Learning Hub', view: 'learning', icon: GraduationCap },
    { label: 'Quiz', view: 'quiz', icon: Sparkles },
  ];

  const handleItemClick = (view: ViewMode) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-50 w-full bg-[#050e1d]/85 backdrop-blur-md border-b border-cyan-950/60 transition-all"
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Logo */}
        <div
          id="nav-logo-btn"
          onClick={() => handleItemClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-300 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Mountain className="w-4 h-4 text-[#031127]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-lg text-white font-['Outfit'] group-hover:text-cyan-200 transition-colors">
              POLARSETU
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          id="desktop-nav-links"
          className="hidden xl:flex items-center gap-1.5 lg:gap-2 overflow-x-auto scrollbar-none py-1"
        >
          {navItems.map((item) => {
            const isActive =
              currentView === item.view ||
              (item.view === 'reports' && currentView === 'report-detail') ||
              (item.view === 'expeditions' && currentView === 'expedition-detail') ||
              (item.view === 'claims' && currentView === 'claim-detail') ||
              (item.view === 'research' && currentView === 'research-detail') ||
              (item.view === 'learning' && currentView === 'learning-detail');

            return (
              <button
                key={item.label}
                id={`nav-link-${item.view}`}
                onClick={() => handleItemClick(item.view)}
                className={`relative px-2.5 py-1.5 text-[13px] font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'text-white' : 'text-slate-300/80 hover:text-cyan-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_#38bdf8]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls (Search & User Avatar) */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Quick AI Trigger */}
          <button
            id="nav-quick-ai-btn"
            onClick={() => handleItemClick('ai')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              currentView === 'ai'
                ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400'
                : 'bg-cyan-950/40 text-cyan-300 border-cyan-800/60 hover:bg-cyan-900/40 hover:border-cyan-500/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Polar AI</span>
          </button>

          {/* Admin Portal Direct Button */}
          <button
            id="nav-admin-portal-button"
            onClick={() => handleItemClick('admin')}
            title="NCPOR Admin Portal (Access Key: POLAR-ADMIN-NCPOR-2026)"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-xs font-semibold text-cyan-300 hover:text-white transition-all shadow-sm cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Admin</span>
          </button>

          {/* Search Button */}
          <button
            id="nav-search-button"
            onClick={onOpenSearch}
            aria-label="Open Search"
            className="w-9 h-9 rounded-full bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm hover:border-cyan-500/40"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* User Profile Avatar with dropdown */}
          <div className="relative">
            <button
              id="nav-user-avatar-btn"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              aria-label="User profile"
              className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 flex items-center justify-center text-slate-200 hover:text-white transition-all overflow-hidden"
            >
              <User className="w-4 h-4" />
            </button>

            {profileDropdownOpen && (
              <div
                id="user-profile-dropdown"
                className="absolute right-0 mt-2 w-56 bg-[#08172c] border border-cyan-900/80 rounded-xl shadow-2xl p-2 z-50 text-sm"
              >
                <div className="px-3 py-2 border-b border-slate-700/60 mb-1">
                  <div className="font-semibold text-white">Polar Researcher</div>
                  <div className="text-xs text-cyan-400 flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                    <span>{userXP} XP • Level 3 Contributor</span>
                  </div>
                </div>
                <button
                  id="dropdown-profile-btn"
                  onClick={() => handleItemClick('profile')}
                  className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>My Profile & Feed</span>
                </button>
                <button
                  id="dropdown-voices-btn"
                  onClick={() => handleItemClick('voices-create')}
                  className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Contribute to Voices</span>
                </button>
                <div className="h-px bg-slate-700/60 my-1" />
                <button
                  id="dropdown-admin-btn"
                  onClick={() => handleItemClick('admin')}
                  className="w-full text-left px-3 py-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800/60 flex items-center gap-2 text-xs"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin & Review Portal</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-9 h-9 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="xl:hidden bg-[#071325] border-b border-cyan-900/60 px-4 py-4 max-h-[80vh] overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.label}
                  id={`mobile-nav-${item.view}`}
                  onClick={() => handleItemClick(item.view)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
