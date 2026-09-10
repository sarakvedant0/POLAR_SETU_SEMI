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
} from 'lucide-react';
import { polarDataService } from '../services/dataService';
import { ViewMode, ResearchReport } from '../types';

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

  const handleToggleBookmark = () => {
    polarDataService.toggleBookmark(currentReportId);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      const author = commenterName.trim() || 'Verified Polar Researcher';
      polarDataService.addComment(currentReportId, { author, text: commentText.trim() });
      setInteractions(polarDataService.getInteractions(currentReportId));
      setCommentText('');
    }
  };

  return (
    <div id="report-detail-view" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & 3D Mode Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('reports')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Trending Reports</span>
        </button>

        <button
          id="toggle-3d-research-mode-btn"
          onClick={() => setMode3D(!mode3D)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
            mode3D
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/30'
              : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80 hover:bg-cyan-900/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{mode3D ? 'Exit 3D Research Mode' : 'Explore Research in 3D Mode'}</span>
        </button>
      </div>

      {/* 3D Research Mode Visualization Screen */}
      {mode3D && (
        <div
          id="report-3d-mode-canvas"
          className="p-6 rounded-3xl bg-gradient-to-b from-[#061730] to-[#040d1a] border-2 border-cyan-400 shadow-[0_0_40px_rgba(56,189,248,0.2)] animate-fade-in"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>3D Spatial Knowledge Diagram: Research → Findings → Evidence</span>
            </div>
            <span className="text-[11px] text-slate-400">Interactive Model</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
            {/* Step 1: Research Paper */}
            <div className="p-4 rounded-2xl bg-[#091f3d] border border-cyan-500/50 flex flex-col justify-between">
              <div className="text-[10px] font-bold text-cyan-400 uppercase">Original Publication</div>
              <div className="text-sm font-bold text-white mt-2">{report.title}</div>
              <div className="text-xs text-slate-400 mt-2">DOI: {report.doi}</div>
            </div>

            {/* Step 2: Key Finding */}
            <div className="p-4 rounded-2xl bg-[#091f3d] border border-cyan-500/50 flex flex-col justify-between">
              <div className="text-[10px] font-bold text-cyan-400 uppercase">Primary Finding</div>
              <div className="text-xs font-semibold text-slate-200 mt-2">
                {report.aiSummary.keyFindings[0]}
              </div>
              <div className="text-xs text-cyan-300 mt-2">Empirically Verified</div>
            </div>

            {/* Step 3: Dataset Link */}
            <div
              onClick={() => onNavigate('datasets')}
              className="p-4 rounded-2xl bg-[#081a33] border border-cyan-500/50 hover:border-cyan-300 cursor-pointer flex flex-col justify-between transition-all"
            >
              <div className="text-[10px] font-bold text-cyan-400 uppercase">Grounding Dataset</div>
              <div className="text-xs font-semibold text-white mt-2">
                Decadal Ice Shelf Basal Melt Rates
              </div>
              <div className="text-xs text-cyan-400 mt-2 flex items-center gap-1">
                <Database className="w-3 h-3" />
                <span>View Dataset →</span>
              </div>
            </div>

            {/* Step 4: Evidence Source */}
            <div className="p-4 rounded-2xl bg-[#081a33] border border-emerald-500/50 flex flex-col justify-between">
              <div className="text-[10px] font-bold text-emerald-400 uppercase">Verified Evidence</div>
              <div className="text-xs font-semibold text-slate-200 mt-2">
                Phase-sensitive radar (pRES) + CryoSat-2 altimetry
              </div>
              <div className="text-xs text-emerald-300 mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Peer Audited</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Story Hero Header */}
      <div className="space-y-4 border-b border-cyan-950 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60">
            {report.researchArea}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-slate-300 border border-slate-700">
            {report.region}
          </span>
          <span className="text-xs text-slate-400">• {report.readTime}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight font-['Outfit']">
          {report.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-400">
          <div>
            <span className="text-white font-semibold">{report.authors.join(', ')}</span>
            <span className="mx-2">•</span>
            <span>{report.institution}</span>
            <span className="mx-2">•</span>
            <span>{report.date}</span>
          </div>

          {/* Ask AI Contextual Question Button */}
          <button
            onClick={() =>
              onOpenAIQuery
                ? onOpenAIQuery(`Explain the key findings and evidence behind "${report.title}"`)
                : onNavigate('ai')
            }
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600/60 text-cyan-300 font-semibold cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ask Polar AI about this paper</span>
          </button>
        </div>

        {/* Real Live Metrics Status Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-cyan-950/80">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#061426] border border-cyan-900/60 text-xs text-cyan-300 font-medium">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Views: <strong className="text-white font-mono">{report.views || '0'}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#061426] border border-cyan-900/60 text-xs text-slate-300 font-medium">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Peer Comments: <strong className="text-white font-mono">{interactions.comments.length}</strong></span>
          </div>

          <button
            id="bookmark-report-btn"
            onClick={handleToggleBookmark}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              report.citations > 0
                ? 'bg-cyan-950 text-cyan-200 border-cyan-500'
                : 'bg-[#061426] text-slate-300 border-cyan-900/60 hover:bg-cyan-950'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${report.citations > 0 ? 'fill-cyan-400 text-cyan-400' : 'text-slate-400'}`} />
            <span>Bookmark / Citation: <strong className="font-mono">{report.citations || 0}</strong></span>
          </button>
        </div>
      </div>

      {/* Featured Image */}
      <div className="rounded-3xl overflow-hidden h-72 sm:h-96 w-full border border-cyan-900/60 shadow-2xl">
        <img src={report.imageUrl} alt={report.title} className="w-full h-full object-cover" />
      </div>

      {/* Section 1: AI SUMMARY BLOCK */}
      <div
        id="report-ai-summary-block"
        className="p-6 rounded-2xl bg-[#08182f]/90 border border-cyan-500/30 space-y-4 shadow-xl"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>AI Scientific Synthesis (Polar AI RAG)</span>
        </div>

        <div className="space-y-3 text-sm text-slate-200">
          <div>
            <h3 className="font-bold text-white text-base font-['Outfit']">What is this research about?</h3>
            <p className="mt-1 text-slate-300 leading-relaxed">{report.aiSummary.overview}</p>
          </div>

          <div>
            <h3 className="font-bold text-white text-base font-['Outfit']">Why does it matter?</h3>
            <p className="mt-1 text-slate-300 leading-relaxed">{report.aiSummary.whyItMatters}</p>
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
            <p className="mt-1 text-xs text-slate-300">{report.aiSummary.whatRemainsUncertain}</p>
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
    </div>
  );
};
