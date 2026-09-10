import React, { useState } from 'react';
import {
  X,
  Key,
  Lock,
  User,
  Mail,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { authService } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onTriggerOnboarding?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onTriggerOnboarding,
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  // Sign In State
  const [loginKey, setLoginKey] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign Up State
  const [signupKey, setSignupKey] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupError, setSignupError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleGenerateKey = () => {
    const key = authService.generateSpecialKey('polar_scholar');
    setSignupKey(key);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const res = authService.login(loginKey, loginPassword);
    if (res.success && res.user) {
      onClose();
      if (!res.user.onboardingCompleted && onTriggerOnboarding) {
        onTriggerOnboarding();
      } else if (onSuccess) {
        onSuccess();
      }
    } else {
      setLoginError(res.error || 'Authentication failed.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    const res = authService.signup({
      username: signupKey,
      name: signupName,
      email: signupEmail,
      password: signupPassword,
    });

    if (res.success && res.user) {
      onClose();
      // First-time onboarding questionnaire is automatically triggered!
      if (onTriggerOnboarding) {
        onTriggerOnboarding();
      } else if (onSuccess) {
        onSuccess();
      }
    } else {
      setSignupError(res.error || 'Registration failed.');
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="auth-modal-card"
        className="relative w-full max-w-md rounded-3xl bg-[#081528] border border-cyan-500/40 shadow-2xl p-6 sm:p-7 space-y-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/90 border border-cyan-500/60 flex items-center justify-center text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Outfit']">
                POLARSETU Passport
              </h2>
              <p className="text-xs text-slate-400">
                Special Username Key Authentication & Researcher Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[#040e1c] p-1 border border-cyan-950">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In with Key
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              if (!signupKey) handleGenerateKey();
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'signup'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* TAB 1: LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-300">
                {loginError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Special Username Key *</span>
                <span className="text-[10px] text-cyan-400 font-mono">e.g. @polar_explorer_26</span>
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                <input
                  type="text"
                  required
                  value={loginKey}
                  onChange={(e) => setLoginKey(e.target.value)}
                  placeholder="@your_special_key"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#040e1c] border border-cyan-900/80 focus:border-cyan-400 text-white placeholder-slate-500 text-sm focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Account Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#040e1c] border border-cyan-900/80 focus:border-cyan-400 text-white placeholder-slate-500 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="submit-login-btn"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In with Key</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 2: SIGN UP */}
        {tab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            {signupError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-300">
                {signupError}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Special Username Key *
                </label>
                <button
                  type="button"
                  onClick={handleGenerateKey}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generate Key</span>
                </button>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                <input
                  type="text"
                  required
                  value={signupKey}
                  onChange={(e) => setSignupKey(e.target.value)}
                  placeholder="@polar_custom_key"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#040e1c] border border-cyan-900/80 focus:border-cyan-400 text-white placeholder-slate-500 text-xs focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Full Name / Display Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Dr. K. Raman / Ananya Verma"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#040e1c] border border-cyan-900/80 focus:border-cyan-400 text-white placeholder-slate-500 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Official / Academic Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="scholar@university.edu"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#040e1c] border border-cyan-900/80 focus:border-cyan-400 text-white placeholder-slate-500 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Set Account Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Choose a strong password"
                  className="w-full pl-10 pr-10 py-2 rounded-xl bg-[#040e1c] border border-cyan-900/80 focus:border-cyan-400 text-white placeholder-slate-500 text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              After signing up, you will complete a quick 3-step questionnaire (Student, Teacher, Professor, Researcher & Purpose) to customize your personalized polar research feed.
            </p>

            <button
              type="submit"
              id="submit-signup-btn"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Register & Continue to Questionnaire</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
