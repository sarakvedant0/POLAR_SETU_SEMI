import React, { useState } from 'react';
import {
  Sparkles,
  GraduationCap,
  BookOpen,
  Compass,
  Award,
  Check,
  ArrowRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { authService, UserRole, UserPurpose } from '../services/authService';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const currentUser = authService.getCurrentUser();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [selectedRole, setSelectedRole] = useState<UserRole>('Student');
  const [selectedPurpose, setSelectedPurpose] = useState<UserPurpose>('Academic Research & Thesis');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Climate Science',
    'Glaciology & Ice Sheets',
    'Antarctica Expeditions',
  ]);

  if (!isOpen) return null;

  const roles: { role: UserRole; desc: string; icon: any }[] = [
    { role: 'Student', desc: 'Undergraduate, post-grad, or school polar student', icon: GraduationCap },
    { role: 'Teacher', desc: 'Educator teaching earth & environmental science', icon: BookOpen },
    { role: 'Professor', desc: 'University faculty & thesis advisor in cryosphere', icon: Award },
    { role: 'Polar Researcher / Scientist', desc: 'NCPOR, IMD, SCAR or institutional researcher', icon: Compass },
    { role: 'Climate Data Analyst', desc: 'GIS, meteorological modeling, or climate policy', icon: Sparkles },
    { role: 'Citizen Science Explorer', desc: 'Enthusiast learning polar science and climate', icon: ShieldCheck },
  ];

  const purposes: { purpose: UserPurpose; desc: string }[] = [
    { purpose: 'Academic Research & Thesis', desc: 'Access empirical datasets, ice core data, and peer-reviewed papers' },
    { purpose: 'Classroom Teaching & Education', desc: 'Use verified learning modules and interactive 3D stations for students' },
    { purpose: 'General Polar Science Interest', desc: 'Stay updated on Arctic & Antarctic missions, wildlife, and facts' },
    { purpose: 'Field Expedition Collaboration', desc: 'Collaborate with scientists stationed at Maitri, Bharati, and Himadri' },
    { purpose: 'Climate Modeling & Policy Analysis', desc: 'Analyze sea ice extent, albedo shifts, and regional telemetry' },
  ];

  const interestOptions = [
    'Climate Science',
    'Glaciology & Ice Sheets',
    'Antarctica Expeditions',
    'Arctic Sea Ice',
    'Marine Ecosystems & Krill',
    'Maitri & Bharati Stations',
    'Atmospheric Physics & Ozone',
    'Himalayan Glaciers (Third Pole)',
  ];

  const toggleInterest = (topic: string) => {
    if (selectedInterests.includes(topic)) {
      setSelectedInterests(selectedInterests.filter((t) => t !== topic));
    } else {
      setSelectedInterests([...selectedInterests, topic]);
    }
  };

  const handleFinish = () => {
    authService.completeOnboarding(selectedRole, selectedPurpose, selectedInterests);
    onClose();
    if (onComplete) onComplete();
  };

  return (
    <div
      id="onboarding-modal-overlay"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="onboarding-modal-card"
        className="relative w-full max-w-xl rounded-3xl bg-[#081528] border border-cyan-500/50 shadow-2xl p-6 sm:p-8 space-y-6"
      >
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-cyan-950 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Welcome to POLARSETU, {currentUser.name}!
              </h2>
              <p className="text-xs text-slate-400">
                Personalize your polar research feed & community experience.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-mono text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-900">
            <span>Step {step} of 3</span>
          </div>
        </div>

        {/* STEP 1: SELECT ROLE */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                1. What is your role or academic designation?
              </h3>
              <p className="text-xs text-slate-400">
                This helps us recommend research levels, peer review opportunities, and verified modules.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[45vh] overflow-y-auto pr-1">
              {roles.map(({ role, desc, icon: Icon }) => {
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-950 text-white'
                        : 'bg-[#040e1c] border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{role}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">{desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <span>Continue to Purpose</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT PURPOSE */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                2. What is your primary purpose on POLARSETU?
              </h3>
              <p className="text-xs text-slate-400">
                We'll tailor your home feed, notifications, and expedition recommendations.
              </p>
            </div>

            <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
              {purposes.map(({ purpose, desc }) => {
                const isSelected = selectedPurpose === purpose;
                return (
                  <button
                    key={purpose}
                    type="button"
                    onClick={() => setSelectedPurpose(purpose)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-950 text-white'
                        : 'bg-[#040e1c] border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{purpose}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{desc}</div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <span>Continue to Interests</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TOPICS OF INTEREST */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                3. Choose topics of interest
              </h3>
              <p className="text-xs text-slate-400">
                The feed algorithm will prioritize these research areas, field observations, and media.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {interestOptions.map((topic) => {
                const isSelected = selectedInterests.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleInterest(topic)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950 text-cyan-200 border-cyan-400 shadow-sm'
                        : 'bg-[#040e1c] text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Tag className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{topic}</span>
                    {isSelected && <Check className="w-3 h-3 text-cyan-400 ml-0.5" />}
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300">
              Your special key is <strong className="font-mono text-white">{currentUser.username}</strong>. Posts matching your selected topics will be prioritized in your personalized feed!
            </div>

            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                id="complete-onboarding-btn"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save & Launch Personalized Feed</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
