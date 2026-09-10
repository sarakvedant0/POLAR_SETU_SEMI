import React, { useState } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  Tag,
  FileText,
  Camera,
  AlertTriangle,
  User,
} from 'lucide-react';
import { cyberSafetyService, CyberCheckResult } from '../services/cyberSafetyService';
import { aiVerificationService } from '../services/aiVerificationService';
import { polarDataService } from '../services/dataService';
import { authService } from '../services/authService';
import { CyberWarningModal } from './CyberWarningModal';

interface UploadPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'media' | 'voices' | 'research';
  onSuccess?: () => void;
}

export const UploadPostModal: React.FC<UploadPostModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'media',
  onSuccess,
}) => {
  const currentUser = authService.getCurrentUser();
  const [postType, setPostType] = useState<'media' | 'voices' | 'research'>(defaultType);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('#Antarctica, #PolarScience, #ClimateData');
  const [location, setLocation] = useState('Maitri Station, East Antarctica');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cyber Warning Modal State
  const [cyberResult, setCyberResult] = useState<CyberCheckResult | null>(null);
  const [isCyberWarningOpen, setIsCyberWarningOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    // 1. CYBERSECURITY & CONTENT SAFETY SCAN
    const safetyCheck = cyberSafetyService.evaluateContent(content, title);
    if (!safetyCheck.isSafe) {
      setIsSubmitting(false);
      // Immediately discard post & issue security warning
      const strikes = authService.addSecurityStrike(safetyCheck.reason || 'Prohibited Activity');
      const safeSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' =
        safetyCheck.severity === 'LOW' ? 'MEDIUM' : (safetyCheck.severity || 'HIGH');
      polarDataService.logCyberIncident({
        username: currentUser.username,
        reason: safetyCheck.reason || 'Unusual Abusive Activity Detected',
        severity: safeSeverity,
        blockedTextSnippet: title + ': ' + content,
        actionTaken: 'Post Discarded & Security Warning Logged',
      });

      setCyberResult(safetyCheck);
      setIsCyberWarningOpen(true);
      return;
    }

    // 2. MULTI-MODEL AI CROSS-VERIFICATION
    const aiAudit = aiVerificationService.crossVerify(title, content, postType);

    // Parse tags
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // 3. PERSIST TO REPOSITORY ACCORDING TO TYPE
    if (postType === 'media') {
      polarDataService.addMedia({
        title: title.trim(),
        caption: content.trim(),
        type: 'photo',
        url:
          imageUrl.trim() ||
          'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1200&q=80',
        location: location.trim(),
        year: '2026',
        credit: currentUser.name + ` (${currentUser.username})`,
      });
    } else if (postType === 'voices') {
      polarDataService.addCommunityPost({
        authorName: currentUser.name,
        authorRole: currentUser.role,
        authorAvatar: currentUser.avatar,
        institution: currentUser.institution || 'Polar Science Contributor',
        verified: currentUser.role.includes('Researcher') || currentUser.role.includes('Professor'),
        type: 'Observation',
        title: title.trim(),
        content: content.trim(),
        status: aiAudit.batchStatus === 'VERIFIED' ? 'VERIFIED' : 'UNDER_REVIEW',
        likes: 0,
        commentsCount: 0,
      });
    } else {
      // Research Paper Draft
      polarDataService.addReport({
        title: title.trim(),
        abstract: content.trim(),
        authors: [currentUser.name, 'Field Group'],
        institution: currentUser.institution || 'Polar Scientific Community',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        researchArea: 'Climate Science',
        region: 'Antarctica',
        views: '0',
        comments: 0,
        citations: 0,
        expedition: '44th Indian Scientific Expedition to Antarctica',
        imageUrl:
          imageUrl.trim() ||
          'https://images.unsplash.com/photo-1483181957632-8bda974cbc91?auto=format&fit=crop&w=1200&q=80',
        readTime: '4 min read',
        doi: '10.5281/zenodo.' + Math.floor(1000000 + Math.random() * 9000000),
        footerLinkType: 'expedition',
        footerLinkLabel: 'Expedition →',
        aiSummary: {
          overview: content.slice(0, 160) + '...',
          whyItMatters: 'Field verification submitted by registered polar researcher.',
          keyFindings: [title.trim()],
          whatRemainsUncertain: 'Awaiting secondary ground sensor calibration.',
        },
        evidenceChain: [
          {
            claim: title.trim(),
            evidence: content.slice(0, 120),
            source: 'Verified Community Field Upload',
            type: 'Field Census',
          },
        ],
      });
    }

    setIsSubmitting(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <>
      <div
        id="upload-post-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      >
        <div
          id="upload-post-modal-card"
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#081528] border border-cyan-500/40 shadow-2xl p-6 sm:p-7 space-y-5"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-cyan-950/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/90 border border-cyan-500/60 flex items-center justify-center text-cyan-400">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-['Outfit']">
                  Upload & Share Polar Discovery
                </h2>
                <p className="text-xs text-slate-400">
                  Cross-verified by Gemini, Claude, GPT-4o & DeepSeek with cyber safety protection.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close upload modal"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info Bar */}
          <div className="p-3 rounded-xl bg-[#040e1c] border border-cyan-950 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">Publishing as:</span>
              <span className="font-bold text-white">{currentUser.name}</span>
              <span className="font-mono text-cyan-400 text-[11px]">{currentUser.username}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
              {currentUser.role}
            </span>
          </div>

          {/* Post Type Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPostType('media')}
              className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                postType === 'media'
                  ? 'bg-cyan-950/80 text-cyan-200 border-cyan-400 shadow-md'
                  : 'bg-[#051122] text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Media & Visuals</span>
            </button>

            <button
              type="button"
              onClick={() => setPostType('voices')}
              className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                postType === 'voices'
                  ? 'bg-cyan-950/80 text-cyan-200 border-cyan-400 shadow-md'
                  : 'bg-[#051122] text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Community Voice</span>
            </button>

            <button
              type="button"
              onClick={() => setPostType('research')}
              className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                postType === 'research'
                  ? 'bg-cyan-950/80 text-cyan-200 border-cyan-400 shadow-md'
                  : 'bg-[#051122] text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Research Paper Draft</span>
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Title / Observation Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Ice Shelf Basal Melting Observed near Princess Astrid Coast"
                className="w-full px-4 py-2.5 rounded-xl bg-[#040e1c] border border-cyan-900/80 focus:border-cyan-400 text-white placeholder-slate-500 text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Scientific Details / Field Notes / Caption *
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Provide empirical field notes, instrument observations, sensor readouts, or visual descriptions..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#040e1c] border border-cyan-900/80 focus:border-cyan-400 text-white placeholder-slate-500 text-sm focus:outline-none resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Image / Visual URL (Optional)</span>
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900/80 focus:border-cyan-400 text-white placeholder-slate-500 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Location / Polar Station
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bharati Station, Larsemann Hills"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900/80 focus:border-cyan-400 text-white placeholder-slate-500 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Search Tags (Comma-separated for user discovery)</span>
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="#Glaciology, #Maitri, #SeaIce, #Krill"
                className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900/80 focus:border-cyan-400 text-white placeholder-slate-500 text-xs focus:outline-none"
              />
            </div>

            {/* AI Multi-Model Notice */}
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-2 text-xs text-cyan-200">
              <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Automated Multi-Model AI Verification:</strong> Upon submission, Google Gemini, Anthropic Claude, OpenAI GPT-4o, and DeepSeek Reasoner cross-verify your observation against international and NCPOR databases, batching it as <strong>Verified</strong>, <strong>Partially Verified</strong>, or <strong>Unverified</strong>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-cyan-950/80">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-upload-post-btn"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{isSubmitting ? 'Verifying & Uploading...' : 'Upload & Publish Post'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Cybersecurity Warning Modal if triggered */}
      <CyberWarningModal
        isOpen={isCyberWarningOpen}
        onClose={() => setIsCyberWarningOpen(false)}
        result={cyberResult}
        strikesCount={currentUser.securityStrikes + 1}
      />
    </>
  );
};
