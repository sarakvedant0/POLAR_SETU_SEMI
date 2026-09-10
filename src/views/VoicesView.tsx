import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Plus,
  ShieldCheck,
  Bell,
  Sparkles,
  ArrowRight,
  Filter,
  Bookmark,
  Flag,
  Users,
  Tag,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { polarDataService } from '../services/dataService';
import { authService } from '../services/authService';
import { CommunityVoicePost, ViewMode } from '../types';
import { TopLeftBackButton } from '../components/TopLeftBackButton';
import { UploadPostModal } from '../components/UploadPostModal';
import { ReportContentModal } from '../components/ReportContentModal';

interface VoicesViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const VoicesView: React.FC<VoicesViewProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<CommunityVoicePost[]>(polarDataService.getCommunityPosts());
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; type: 'post'; title: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = polarDataService.subscribe(() => {
      setPosts(polarDataService.getCommunityPosts());
    });
    return unsub;
  }, []);

  const filters = ['ALL', 'Observation', 'Expedition Story', 'Claim / Myth', 'Research Idea'];

  const toggleLike = (id: string) => {
    polarDataService.toggleLike(id);
    setPosts(polarDataService.getCommunityPosts());
  };

  const handleToggleSave = (post: CommunityVoicePost) => {
    authService.toggleSaveItem({
      id: post.id,
      type: 'post',
      title: post.title,
      category: post.type,
      author: post.authorName,
      date: post.createdAt,
    });
  };

  const handleShare = (post: CommunityVoicePost) => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filtered = posts.filter(
    (p) => activeFilter === 'ALL' || p.type === activeFilter
  );

  return (
    <div id="voices-view-container" className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Left Back Button */}
      <TopLeftBackButton onBack={() => onNavigate('home')} currentView="voices" targetLabel="Home" />

      {/* Header & Create Post CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Scientific Contribution Platform</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Polar Voices & Community Feed
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            A peer-verified scientific forum for expedition researchers, doctoral scholars, and science communicators to post field observations, questions, and research ideas. All posts undergo AI multi-model cross-verification.
          </p>
        </div>

        <button
          id="voices-create-post-cta"
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Upload Discovery / Voice Post</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === f
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4 max-w-4xl">
        {filtered.map((post) => {
          const isSaved = authService.isItemSaved(post.id);
          const aiBatchStatus = post.aiVerification?.overallStatus || 'VERIFIED';

          return (
            <div
              key={post.id}
              id={`voice-post-${post.id}`}
              className="p-6 rounded-3xl bg-[#08172c]/90 border border-cyan-900/60 hover:border-cyan-500/50 transition-all shadow-xl space-y-4"
            >
              {/* Author Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={post.authorName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-cyan-400/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">{post.authorName}</span>
                      {post.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{post.authorRole} {post.institution && `• ${post.institution}`}</span>
                      {post.followers !== undefined && (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-500" />
                          <span>{post.followers} followers</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60 uppercase tracking-wider">
                    {post.type}
                  </span>

                  {/* AI Verification Batch Badge */}
                  {aiBatchStatus === 'VERIFIED' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>AI Verified (Gemini/Claude/GPT)</span>
                    </span>
                  )}
                  {aiBatchStatus === 'PARTIALLY_VERIFIED' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/50">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Partially Verified</span>
                    </span>
                  )}
                  {aiBatchStatus === 'UNVERIFIED' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/90 text-rose-300 border border-rose-500/50">
                      <AlertCircle className="w-3 h-3 text-rose-400" />
                      <span>Unverified by AI</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Post Title & Content */}
              <div>
                <h2 className="text-lg font-bold text-white font-['Outfit']">{post.title}</h2>
                <p className="text-sm text-slate-200 mt-2 leading-relaxed">{post.content}</p>
              </div>

              {/* Tags for Discovery & Popularity */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/40"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      <span>#{tag}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Evidence Watch Alert Banner if applicable */}
              {post.evidenceWatchers && (
                <div className="p-3 rounded-xl bg-[#071933] border border-cyan-800/60 flex items-center justify-between text-xs text-cyan-300">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>
                      <strong>{post.evidenceWatchers} researchers</strong> watching this post for future satellite/expedition verification.
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{post.createdAt}</span>
                </div>
              )}

              {/* Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  {/* Like / Popularity Button */}
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      post.isLiked
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({post.likes})</span>
                  </button>

                  {/* Bookmark / Save to Passport */}
                  <button
                    onClick={() => handleToggleSave(post)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-slate-950' : ''}`} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>

                  {/* Report Unusual Content */}
                  <button
                    onClick={() =>
                      setReportTarget({
                        id: post.id,
                        type: 'post',
                        title: post.title,
                      })
                    }
                    title="Report unusual or abusive activity"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.commentsCount} comments</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleShare(post)}
                    className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedId === post.id ? 'Copied' : 'Share'}</span>
                  </button>

                  {post.relatedResearch && (
                    <button
                      onClick={() => onNavigate('reports')}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Related Paper</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Post Modal */}
      <UploadPostModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        defaultType="voice"
        onSuccess={() => setPosts(polarDataService.getCommunityPosts())}
      />

      {/* Report Modal */}
      <ReportContentModal
        isOpen={!!reportTarget}
        onClose={() => setReportTarget(null)}
        target={reportTarget}
      />
    </div>
  );
};
