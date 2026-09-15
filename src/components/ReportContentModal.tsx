import React, { useState } from 'react';
import { Flag, X, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { polarDataService } from '../services/dataService';
import { authService } from '../services/authService';

interface ReportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: {
    id: string;
    type: 'research' | 'post' | 'media' | 'dataset' | 'expedition';
    title: string;
  } | null;
  onSuccess?: () => void;
}

export const ReportContentModal: React.FC<ReportContentModalProps> = ({
  isOpen,
  onClose,
  target,
  onSuccess,
}) => {
  const currentUser = authService.getCurrentUser();
  const [reason, setReason] = useState('Suspected Misinformation or Fabricated Polar Data');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !target) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    polarDataService.submitUserReport({
      targetId: target.id,
      targetType: target.type,
      targetTitle: target.title,
      reportedByUsername: currentUser.username,
      reason,
      details: details.trim(),
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDetails('');
      onClose();
      if (onSuccess) onSuccess();
    }, 2000);
  };

  return (
    <div
      id="report-content-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="report-content-modal-card"
        className="relative w-full max-w-md rounded-3xl bg-[#081528] border border-cyan-500/40 shadow-2xl p-6 space-y-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-950/90 border border-amber-500/60 flex items-center justify-center text-amber-400">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Report Content or Activity
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1">
                Target: "{target.title}"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close report modal"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-emerald-200">
              Report Submitted & Queued
            </h4>
            <p className="text-xs text-slate-300">
              Multi-model AI (Gemini, Claude, GPT-4o, DeepSeek) has launched an immediate cross-audit. This ticket is now registered in the NCPOR Admin Moderation Queue.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Reason for Reporting
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040e1c] border border-cyan-900/80 focus:border-cyan-400 text-white text-xs focus:outline-none"
              >
                <option value="Suspected Misinformation or Fabricated Polar Data">
                  Suspected Misinformation or Fabricated Polar Data
                </option>
                <option value="Unusual or Abusive Activity">
                  Unusual or Abusive Activity / Harassment
                </option>
                <option value="Malicious Link or Cybersecurity Vulnerability">
                  Malicious Link or Cybersecurity Vulnerability
                </option>
                <option value="Plagiarism or Unauthorized Scientific Content">
                  Plagiarism or Unauthorized Scientific Content
                </option>
                <option value="Spam or Unrelated Commercial Promotion">
                  Spam or Unrelated Commercial Promotion
                </option>
                <option value="Other Policy Violation">Other Policy Violation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Explain Details / Observed Anomalies *
              </label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what is unusual, inaccurate, or violative..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900/80 focus:border-cyan-400 text-white placeholder-slate-500 text-xs focus:outline-none resize-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#040e1c] border border-slate-800 flex items-start gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                All reported items undergo automated AI consensus verification before being reviewed by NCPOR human editors.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-report-ticket-btn"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Submit Report to Admin</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
