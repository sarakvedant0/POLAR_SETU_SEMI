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
  Shield,
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

  const navItems: { label: string; view: ViewMode; icon: React.ComponentType<{ className?: string }>; highlight?: 'emerald' | 'cyan' }[] = [
    { label: 'Home', view: 'home', icon: Mountain },
    { label: 'Explore', view: 'explore', icon: Compass },
    { label: 'Evidence', view: 'claims', icon: CheckCircle2, highlight: 'emerald' },
    { label: 'Polar AI', view: 'ai', icon: Sparkles, highlight: 'cyan' },
    { label: 'Research', view: 'reports', icon: FileText },
    { label: 'Expeditions', view: 'expeditions', icon: Ship },
    { label: 'Datasets', view: 'datasets', icon: Database },
    { label: 'Media & Visuals', view: 'media', icon: ImageIcon },
    { label: 'Learning Hub', view: 'learning', icon: GraduationCap },
    { label: 'Polar Voices', view: 'voices', icon: MessageSquare },
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
                className={`relative px-2.5 py-1 text-[13px] font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 rounded-full ${
                  item.highlight === 'emerald'
                    ? isActive
                      ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                      : 'bg-emerald-950/40 text-emerald-300/90 border border-emerald-500/50 hover:bg-emerald-900/60 hover:text-emerald-100 hover:border-emerald-400'
                    : item.highlight === 'cyan'
                    ? isActive
                      ? 'bg-cyan-500/25 text-cyan-100 border border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                      : 'bg-cyan-950/40 text-cyan-300/90 border border-cyan-500/50 hover:bg-cyan-900/60 hover:text-cyan-100 hover:border-cyan-400'
                    : isActive
                    ? 'text-white'
                    : 'text-slate-300/80 hover:text-cyan-200'
                }`}
              >
                {item.highlight === 'emerald' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                )}
                {item.highlight === 'cyan' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 animate-pulse" />
                )}
                <span>{item.label}</span>
                {isActive && !item.highlight && (
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

          {/* User Profile / Guest Mode Area */}
          <div className="relative">
            {!currentUser ? (
              // Guest Mode Trigger
              <button
                id="nav-guest-signin-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700/90 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm shadow-cyan-950/30"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Guest Mode • Sign In</span>
                <ChevronDown className="w-3 h-3 text-cyan-400/80" />
              </button>
            ) : (
              // Logged-In User Avatar
              <button
                id="nav-user-avatar-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-label="User profile"
                className="flex items-center gap-1.5 p-1 pr-2 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-cyan-500/40 text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm"
              >
                <img
                  src={currentUser.avatarUrl || currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-cyan-400/60"
                />
                <span className="text-xs font-medium text-slate-200 hidden md:inline max-w-[90px] truncate">
                  {currentUser.displayName || currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}

            {profileDropdownOpen && (
              <div
                id="user-profile-dropdown"
                className="absolute right-0 mt-2 w-72 bg-[#08172c] border border-cyan-900/80 rounded-2xl shadow-2xl p-2.5 z-50 text-sm animate-fade-in"
              >
                {!currentUser ? (
                  // Guest Mode Dropdown Content
                  <div>
                    <div className="px-3 py-3 border-b border-slate-700/60 mb-2 bg-[#050f1d] rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">Guest Explorer</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-800/60">
                          Guest Mode
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        You are browsing in guest mode. Sign up or log in to personalize your polar feed, track research progress, and unlock verified scientific badges.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <button
                        id="guest-dropdown-signup-btn"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenAuth && onOpenAuth();
                        }}
                        className="w-full text-center px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20 transition-all"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Sign In / Sign Up</span>
                      </button>

                      <button
                        id="guest-dropdown-explore-btn"
                        onClick={() => handleItemClick('home')}
                        className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 text-xs cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Explore Polar Network</span>
                      </button>

                      <button
                        id="guest-dropdown-personalize-btn"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenOnboarding && onOpenOnboarding();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 text-xs cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                        <span>Filter by Topic Interests</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Logged In Researcher Dropdown Content
                  <div>
                    {/* User Header */}
                    <div className="px-3 py-2.5 border-b border-slate-700/60 mb-1.5 bg-[#050f1d] rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs truncate max-w-[150px]">
                          {currentUser.displayName || currentUser.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                          {currentUser.role}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 mt-1">
                        <KeyRound className="w-3 h-3" />
                        <span>{currentUser.username}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>{currentUser.xp || userXP} XP • Polar Contributor</span>
                      </div>
                    </div>

                    {/* Dropdown Navigation Actions */}
                    <div className="space-y-0.5">
                      <button
                        id="dropdown-profile-btn"
                        onClick={() => handleItemClick('profile')}
                        className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer text-xs"
                      >
                        <User className="w-4 h-4 text-cyan-400" />
                        <span>My Profile & Feed</span>
                      </button>

                      <button
                        id="dropdown-saved-btn"
                        onClick={() => handleItemClick('saved')}
                        className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer text-xs"
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
                        className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer text-xs"
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
                        className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer text-xs"
                      >
                        <Plus className="w-4 h-4 text-cyan-400" />
                        <span>Upload Polar Discovery</span>
                      </button>

                      <div className="h-px bg-slate-700/60 my-1" />

                      <button
                        id="dropdown-logout-btn"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          authService.logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 flex items-center gap-2 text-xs font-semibold cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>Log Out (Switch to Guest Mode)</span>
                      </button>
                    </div>
                  </div>
                )}
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
