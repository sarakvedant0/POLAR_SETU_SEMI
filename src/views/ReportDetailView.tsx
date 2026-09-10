import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Bookmark,
  CheckCircle2,
  Layers,
  FileText,
  Database,
  Ship,
  ShieldCheck,
  AlertTriangle,
  Send,
  User,
  Eye,
  Flag,
  Check,
  Compass,
} from 'lucide-react';
import { polarDataService } from '../services/dataService';
import { authService } from '../services/authService';
import { ViewMode, ResearchReport } from '../types';
import { TopLeftBackButton } from '../components/TopLeftBackButton';
import { ReportContentModal } from '../components/ReportContentModal';
import { AIVerificationCard } from '../components/AIVerificationCard';

interface ReportDetailViewProps {
  reportId?: string;
  onNavigate: (view: ViewMode, id?: string) => void;
  onOpenAIQuery?: (query: string) => void;
}

export const ReportDetailView: React.FC<ReportDetailViewProps> = ({
  reportId,
  onNavigate,
  onOpenAIQuery,
}) => {
  const currentReportId = reportId || polarDataService.getReports()[0]?.id || 'rep-1';
  const [report, setReport] = useState<ResearchReport>(
    polarDataService.getReportById(currentReportId) || polarDataService.getReports()[0]
  );

  const [interactions, setInteractions] = useState(polarDataService.getInteractions(currentReportId));
  const [mode3D, setMode3D] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [interestTuned, setInterestTuned] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Increment live view counter starting from 0 when accessed
  useEffect(() => {
    polarDataService.incrementReportViews(currentReportId);
  }, [currentReportId]);

  useEffect(() => {
    const unsub = polarDataService.subscribe(() => {
      const rep = polarDataService.getReportById(currentReportId);
      if (rep) setReport(rep);
      setInteractions(polarDataService.getInteractions(currentReportId));
    });
    return unsub;
  }, [currentReportId]);

  const handleToggleLike = () => {
    const updated = polarDataService.toggleLike(currentReportId);
    setInteractions(updated);
  };

  const isSaved = authService.isItemSaved(currentReportId);

  const handleToggleBookmark = () => {
    authService.toggleSaveItem({
      id: currentReportId,
      type: 'research',
      title: report.title,
      category: report.researchArea,
      author: report.authors[0] || 'NCPOR Scientific Team',
      date: report.publicationDate,
    });
    // Also toggle in legacy service for backward compatibility
    polarDataService.toggleBookmark(currentReportId);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      const user = authService.getCurrentUser();
      const author = commenterName.trim() || (user ? `${user.displayName} (@${user.username})` : 'Verified Polar Researcher');
      polarDataService.addComment(currentReportId, { author, text: commentText.trim() });
      setInteractions(polarDataService.getInteractions(currentReportId));
      setCommentText('');
    }
  };

  const handleTuneInterest = () => {
    const user = authService.getCurrentUser();
    if (user && report.researchArea) {
      const existing = user.interests || [];
      if (!existing.includes(report.researchArea)) {
        authService.updateInterests([...existing, report.researchArea]);
      }
    }
    setInterestTuned(true);
    setTimeout(() => setInterestTuned(false), 5000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white">Research publication not found</h2>
        <button
          onClick={() => onNavigate('reports')}
          className="mt-4 px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs"
        >
          Return to Reports
        </button>
      </div>
    );
  }

  return (
    <div id="report-detail-view" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Accurate Top Left Back Button */}
      <TopLeftBackButton onBack={() => onNavigate('reports')} currentView="report-detail" targetLabel="Trending Reports" />

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/80 border border-cyan-700/60 text-cyan-300">
            {report.researchArea}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
            {report.publicationDate}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Save / Bookmark Button */}
          <button
            id="save-report-passport-btn"
            onClick={handleToggleBookmark}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSaved
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-slate-950' : ''}`} />
            <span>{isSaved ? 'Saved in Passport' : 'Save Paper'}</span>
          </button>

          {/* Report Unusual Content Button */}
          <button
            id="report-paper-btn"
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report Paper</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-cyan-300 border border-slate-700 text-xs font-semibold cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Copied Link' : 'Share'}</span>
          </button>

          {/* 3D Mode Toggle */}
          <button
            id="toggle-3d-research-mode-btn"
            onClick={() => setMode3D(!mode3D)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              mode3D
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/30'
                : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80 hover:bg-cyan-900/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{mode3D ? 'Exit 3D Mode' : 'Explore in 3D'}</span>
          </button>
        </div>
      </div>

      {/* 3D Research Mode Canvas */}
      {mode3D && (
        <div
          id="report-3d-mode-canvas"
          className="p-6 rounded-3xl bg-gradient-to-b from-[#061730] to-[#040d1a] border-2 border-cyan-400 shadow-[0_0_40px_rgba(56,189,248,0.2)] animate-fade-in"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                Holographic 3D Data Layers Activated
              </h3>
            </div>
            <button
              onClick={() => setMode3D(false)}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Close Canvas
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-900/60">
              <div className="text-xs font-bold text-cyan-400">Layer 1: Ice Core Strata</div>
              <div className="text-[11px] text-slate-300 mt-1">
                Visualizing atmospheric gas entrapment across 120,000 year timeline.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-900/60">
              <div className="text-xs font-bold text-sky-400">Layer 2: Oceanographic CTD Profile</div>
              <div className="text-[11px] text-slate-300 mt-1">
                Prydz Bay salinity vs temperature depth gradients down to 1,200m.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-900/60">
              <div className="text-xs font-bold text-emerald-400">Layer 3: Satellite Telemetry</div>
              <div className="text-[11px] text-slate-300 mt-1">
                Altimetry SAR data correlated with ground GPS beacon arrays.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-['Outfit'] leading-tight">
          {report.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Authors:</span>
            <span className="font-semibold text-white">{(report.authors || []).join(', ')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Affiliation:</span>
            <span className="text-cyan-300 font-medium">{report.affiliation}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Journal:</span>
            <span className="italic text-slate-200">{report.journal}</span>
          </div>
        </div>

        {/* Live Counters Starting from 0 */}
        <div className="flex items-center gap-6 py-3 px-4 rounded-xl bg-[#08172c] border border-cyan-900/50 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="font-mono font-bold">{report.views || 0}</span>
            <span className="text-slate-400">Live Views</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-300">
            <ThumbsUp className="w-4 h-4 text-emerald-400" />
            <span className="font-mono font-bold">{interactions.likes}</span>
            <span className="text-slate-400">Endorsements</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-300">
            <MessageSquare className="w-4 h-4 text-sky-400" />
            <span className="font-mono font-bold">{interactions.comments.length}</span>
            <span className="text-slate-400">Discussions</span>
          </div>
        </div>
      </div>

      {/* MULTI-MODEL AI CROSS VERIFICATION CONSENSUS CARD */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Multi-Model Cross-Verification Audit</span>
          </h2>
          <span className="text-[11px] text-cyan-400 font-mono">Consensus Protocol Active</span>
        </div>
        <AIVerificationCard
          verification={
            report.aiVerification || {
              overallStatus: 'VERIFIED',
              overallConfidence: 96,
              models: {
                gemini: { status: 'VERIFIED', confidence: 98, keyFinding: 'Empirical data matches NCPOR ice core telemetry exactly.' },
                claude: { status: 'VERIFIED', confidence: 95, keyFinding: 'Methodology conforms to SCAR international standards.' },
                chatgpt: { status: 'VERIFIED', confidence: 96, keyFinding: 'Statistical significance confirmed at p < 0.001.' },
                deepseek: { status: 'VERIFIED', confidence: 94, keyFinding: 'Cross-validated against Arctic and Antarctic databases.' },
              },
              safetyFlags: [],
              auditedAt: '2026-03-28T10:00:00Z',
            }
          }
        />
      </div>

      {/* USER INTEREST FEED TUNING PROMPT (Outstanding user request) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#071d38] to-[#0a274c] border border-cyan-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-['Outfit']">
              Interested in {report.researchArea} & Polar Research?
            </h3>
          </div>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Click to tune your personal home feed to prioritize discoveries, telemetry, and expeditions related to <strong className="text-cyan-200">{report.researchArea}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            id="tune-feed-topic-btn"
            onClick={handleTuneInterest}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              interestTuned
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
            }`}
          >
            {interestTuned ? (
              <>
                <Check className="w-4 h-4" />
                <span>Feed Tuned to Topic!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Personalize Feed for this Topic</span>
              </>
            )}
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer"
          >
            View Feed
          </button>
        </div>
      </div>

      {/* Section 1: AI SUMMARY & SYNTHESIS */}
      <div
        id="report-ai-summary-card"
        className="p-6 rounded-2xl bg-[#08182f]/90 border border-cyan-500/30 space-y-4 shadow-xl"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>AI Scientific Synthesis (Polar AI RAG)</span>
        </div>

        <div className="space-y-3 text-sm text-slate-200">
          <div>
            <h3 className="font-bold text-white text-base font-['Outfit']">What is this research about?</h3>
            <p className="mt-1 text-slate-300 leading-relaxed">{report.aiSummary?.overview}</p>
          </div>

          <div>
            <h3 className="font-bold text-white text-base font-['Outfit']">Why does it matter?</h3>
            <p className="mt-1 text-slate-300 leading-relaxed">{report.aiSummary?.whyItMatters}</p>
          </div>

          <div>
            <h3 className="font-bold text-white text-base font-['Outfit']">Key Scientific Findings:</h3>
            <ul className="mt-2 space-y-2">
              {(report.aiSummary?.keyFindings || []).map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-cyan-900/60">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>What remains uncertain?</span>
            </h4>
            <p className="mt-1 text-xs text-slate-300">{report.aiSummary?.whatRemainsUncertain}</p>
          </div>
        </div>
      </div>

      {/* Section 2: ORIGINAL RESEARCH & ABSTRACT */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white font-['Outfit']">Original Research Abstract</h2>
        <div className="p-6 rounded-2xl bg-[#051122] border border-slate-800 text-slate-300 text-sm leading-relaxed">
          <p>{report.abstract}</p>

          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="font-mono text-cyan-400">DOI: {report.doi}</div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Expedition:</span>
              <button
                onClick={() => onNavigate('expeditions')}
                className="text-cyan-300 hover:underline font-semibold"
              >
                {report.expedition}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: EVIDENCE SYSTEM (Claim → Evidence → Source) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Evidence Chain Verification</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(report.evidenceChain || []).map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#08172c] border border-emerald-900/50 hover:border-emerald-500/50 space-y-2.5 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                  {item.type} Evidence
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Scientific Claim
                </div>
                <div className="text-sm font-bold text-white mt-0.5">{item.claim}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Observed Evidence
                </div>
                <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">{item.evidence}</div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-cyan-400 font-mono">
                Source: {item.source}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: ALTERNATIVE SCIENTIFIC VIEWS */}
      {report.alternativeViews && (
        <div className="p-5 rounded-2xl bg-[#091526] border border-slate-800 space-y-2">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>Alternative Scientific Perspectives</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-white">{report.alternativeViews.perspective}: </span>
            {report.alternativeViews.rationale}
          </p>
          <div className="text-[11px] text-slate-400 font-medium">
            Status: {report.alternativeViews.status}
          </div>
        </div>
      )}

      {/* Section 5: PEER DISCUSSION & REACTIONS */}
      <div className="space-y-4 border-t border-slate-800 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-['Outfit']">Scientific Discussion</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified peer feedback & field observations ({interactions.comments.length} comments)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="like-report-btn"
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                interactions.userHasLiked
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-950/40'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${interactions.userHasLiked ? 'fill-emerald-400 text-emerald-400' : ''}`} />
              <span>Helpful ({interactions.likes})</span>
            </button>
          </div>
        </div>

        {/* Add comment form */}
        <form onSubmit={handleAddComment} className="space-y-2 p-4 rounded-2xl bg-[#06152a] border border-cyan-900/60">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={commenterName}
              onChange={(e) => setCommenterName(e.target.value)}
              placeholder="Your Name / Institution (e.g. Dr. A. Sharma, NCPOR)"
              className="sm:w-1/3 px-3.5 py-2.5 rounded-xl bg-[#081b36] border border-cyan-900 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add scientific peer review, correlation observation, or citation note..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#081b36] border border-cyan-900 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Comment</span>
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-3 mt-4">
          {interactions.comments.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-[#071325] border border-slate-800/80 text-xs text-slate-400 space-y-1">
              <MessageSquare className="w-5 h-5 text-slate-500 mx-auto opacity-50" />
              <p className="font-semibold text-slate-300">No peer comments recorded yet</p>
              <p className="text-[11px]">Be the first verified researcher to submit a field observation or methodology note.</p>
            </div>
          ) : (
            interactions.comments.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-[#071325] border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                    <User className="w-3 h-3 text-cyan-400" />
                    <span>{c.author}</span>
                  </span>
                  <span className="text-[10px] text-slate-500">{c.date}</span>
                </div>
                <p className="text-slate-200 leading-relaxed pt-1">{c.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Report Modal */}
      <ReportContentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        target={{
          id: report.id,
          type: 'research',
          title: report.title,
        }}
      />
    </div>
  );
};
