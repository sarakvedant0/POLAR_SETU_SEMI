import React, { useState } from 'react';
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
} from 'lucide-react';
import { COMMUNITY_POSTS } from '../data/mockData';
import { CommunityVoicePost, ViewMode } from '../types';

interface VoicesViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const VoicesView: React.FC<VoicesViewProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<CommunityVoicePost[]>(COMMUNITY_POSTS);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filters = ['ALL', 'Observation', 'Expedition Story', 'Claim / Myth', 'Research Idea'];

  const toggleLike = (id: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id === id) {
          const isLiked = !p.isLiked;
          return { ...p, isLiked, likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1) };
        }
        return p;
      })
    );
  };

  const filtered = posts.filter(
    (p) => activeFilter === 'ALL' || p.type === activeFilter
  );

  return (
    <div id="voices-view-container" className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Create Post CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Scientific Contribution Platform</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Polar Voices
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            A peer-verified scientific forum for expedition researchers, doctoral scholars, and science communicators to post field observations, questions, and research ideas.
          </p>
        </div>

        <button
          id="voices-create-post-cta"
          onClick={() => onNavigate('voices-create')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Contribute Scientific Post</span>
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
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4 max-w-4xl">
        {filtered.map((post) => (
          <div
            key={post.id}
            id={`voice-post-${post.id}`}
            className="p-6 rounded-3xl bg-[#08172c]/90 border border-cyan-900/60 hover:border-cyan-500/50 transition-all shadow-xl space-y-4"
          >
            {/* Author Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-cyan-400/40"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">{post.authorName}</span>
                    {post.verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {post.authorRole} {post.institution && `• ${post.institution}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60 uppercase tracking-wider">
                  {post.type}
                </span>
                {post.status === 'EVIDENCE_FOUND' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/60">
                    Evidence Found
                  </span>
                )}
              </div>
            </div>

            {/* Post Title & Content */}
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">{post.title}</h2>
              <p className="text-sm text-slate-200 mt-2 leading-relaxed">{post.content}</p>
            </div>

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
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-4">
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

                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.commentsCount} comments</span>
                </div>
              </div>

              {post.relatedResearch && (
                <button
                  onClick={() => onNavigate('reports')}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <span>Related Paper</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
