import React, { useState, useEffect } from 'react';
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
  Bookmark,
  Plus,
  KeyRound,
  SlidersHorizontal,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { ViewMode } from '../types';
import { authService } from '../services/authService';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenSearch: () => void;
  onOpenAuth?: () => void;
  onOpenOnboarding?: () => void;
  onOpenUpload?: (type?: 'voice' | 'media' | 'report') => void;
  userXP?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  onOpenAuth,
  onOpenOnboarding,
  onOpenUpload,
  userXP = 240,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const unsub = authService.subscribe((user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

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
    { label: 'Saved', view: 'saved', icon: Bookmark },
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

        {/* Action Controls (Upload, Search, AI, Admin, User Profile) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Universal Upload Button */}
          <button
            id="nav-universal-upload-btn"
            onClick={() => onOpenUpload && onOpenUpload('voice')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Upload</span>
          </button>

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

          {/* Search Button */}
          <button
            id="nav-search-button"
            onClick={onOpenSearch}
            aria-label="Open Search"
            className="w-9 h-9 rounded-full bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm hover:border-cyan-500/40 cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* User Profile Avatar with dropdown */}
          <div className="relative">
            <button
              id="nav-user-avatar-btn"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              aria-label="User profile"
              className="flex items-center gap-1.5 p-1 pr-2 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt="User"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-cyan-400/40"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div
                id="user-profile-dropdown"
                className="absolute right-0 mt-2 w-64 bg-[#08172c] border border-cyan-900/80 rounded-2xl shadow-2xl p-2.5 z-50 text-sm animate-fade-in"
              >
                {/* User Header */}
                <div className="px-3 py-2.5 border-b border-slate-700/60 mb-1.5 bg-[#050f1d] rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs truncate max-w-[140px]">
                      {currentUser?.displayName || 'Polar Explorer'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                      {currentUser?.role || 'Researcher'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 mt-1">
                    <KeyRound className="w-3 h-3" />
                    <span>@{currentUser?.username || 'POLAR-USER'}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>{currentUser?.xp || userXP} XP • Level 3 Contributor</span>
                  </div>
                </div>

                {/* Dropdown Navigation Actions */}
                <div className="space-y-0.5">
                  <button
                    id="dropdown-profile-btn"
                    onClick={() => handleItemClick('profile')}
                    className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>My Profile & Feed</span>
                  </button>

                  <button
                    id="dropdown-saved-btn"
                    onClick={() => handleItemClick('saved')}
                    className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span>Saved Research & Posts</span>
                  </button>

                  <button
                    id="dropdown-personalize-btn"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenOnboarding && onOpenOnboarding();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                    <span>Personalize Feed Interests</span>
                  </button>

                  <button
                    id="dropdown-upload-btn"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenUpload && onOpenUpload('voice');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-cyan-400" />
                    <span>Upload Polar Discovery</span>
                  </button>

                  <div className="h-px bg-slate-700/60 my-1" />

                  <button
                    id="dropdown-auth-btn"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenAuth && onOpenAuth();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-cyan-300 hover:text-white hover:bg-cyan-950/60 flex items-center gap-2 text-xs font-semibold cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Switch User / Sign Up</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-9 h-9 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="xl:hidden bg-[#071325] border-b border-cyan-900/60 px-4 py-4 max-h-[80vh] overflow-y-auto space-y-4"
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
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-all cursor-pointer ${
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

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenUpload && onOpenUpload('voice');
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Upload Discovery Post</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth && onOpenAuth();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700"
            >
              <User className="w-4 h-4" />
              <span>Login / Sign Up with Key Pass</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
