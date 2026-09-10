import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
} from 'lucide-react';
import { RESEARCH_REPORTS, DATASETS } from '../data/mockData';
import { ViewMode } from '../types';

interface CreateVoicePostViewProps {
  onNavigate: (view: ViewMode) => void;
  onPostCreated: () => void;
}

export const CreateVoicePostView: React.FC<CreateVoicePostViewProps> = ({
  onNavigate,
  onPostCreated,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('Observation');
  const [isScanningAI, setIsScanningAI] = useState(false);
  const [detectedClaims, setDetectedClaims] = useState<string[]>([]);
  const [suggestedCitations, setSuggestedCitations] = useState<string[]>([]);

  const handleScanAI = () => {
    if (!content.trim()) return;
    setIsScanningAI(true);
    setTimeout(() => {
      // Simulate claim detection and citation suggestion
      setDetectedClaims([
        'Assertion: Recent sub-glacial hydrological channel activation observed.',
        'Temporal Claim: Post-2023 seasonal melt velocity accelerated.',
      ]);
      setSuggestedCitations([
        'Accelerated Ice Shelf Melting in the Indian Sector (Nair et al., 2025)',
        'Antarctic Ice Shelf Basal Melt Rates 1995-2025 (NCPOR Dataset)',
      ]);
      setIsScanningAI(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onPostCreated();
  };

  return (
    <div id="create-voice-post-view" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('voices')}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Polar Voices</span>
      </button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
          Contribute a Polar Scientific Voice
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Share your field observation, propose an expedition hypothesis, or submit an observation for community evidence verification.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-3xl bg-[#08172c] border border-cyan-900/80 shadow-2xl space-y-6"
      >
        {/* Post Type Selector */}
        <div>
          <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
            Post Category
          </label>
          <div className="flex flex-wrap gap-2">
            {['Observation', 'Expedition Story', 'Claim / Myth', 'Research Idea'].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  type === t
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Post Title / Scientific Subject
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Unusual supraglacial lake formation noted at Schirmacher Oasis"
            className="w-full px-4 py-3 rounded-xl bg-[#051122] border border-cyan-950 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Field Description & Details
            </label>
            <button
              type="button"
              onClick={handleScanAI}
              disabled={!content.trim() || isScanningAI}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Claim Detection & Citation Scan</span>
            </button>
          </div>
          <textarea
            required
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Document your field observation, coordinates, equipment used, and preliminary findings..."
            className="w-full px-4 py-3 rounded-xl bg-[#051122] border border-cyan-950 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 leading-relaxed"
          />
        </div>

        {/* AI Scan Feedback Box */}
        {detectedClaims.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#061830] border border-cyan-500/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Polar AI Automated Quality Review</span>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-slate-200">Detected Scientific Claims:</div>
              {detectedClaims.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-cyan-950 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-cyan-300">Suggested Grounding Citations:</div>
              {suggestedCitations.map((cit, i) => (
                <div key={i} className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                  <FileText className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  <span>{cit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onNavigate('voices')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Scientific Contribution</span>
          </button>
        </div>
      </form>
    </div>
  );
};
