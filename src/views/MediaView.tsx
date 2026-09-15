import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Camera,
  MapPin,
  Calendar,
  ExternalLink,
  Search,
  Filter,
  Download,
  X,
  Share2,
  Database,
  ArrowRight,
  Sparkles,
  Maximize2,
  Upload,
  Bookmark,
  Flag,
  ThumbsUp,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { polarDataService } from '../services/dataService';
import { authService } from '../services/authService';
import { ExpeditionMedia, ViewMode } from '../types';
import { TopLeftBackButton } from '../components/TopLeftBackButton';
import { UploadPostModal } from '../components/UploadPostModal';
import { ReportContentModal } from '../components/ReportContentModal';

interface MediaViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const MediaView: React.FC<MediaViewProps> = ({ onNavigate }) => {
  const [mediaList, setMediaList] = useState<ExpeditionMedia[]>(polarDataService.getMedia());
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMedia, setSelectedMedia] = useState<ExpeditionMedia | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload & Report Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; type: 'media'; title: string } | null>(null);

  useEffect(() => {
    const unsub = polarDataService.subscribe(() => {
      setMediaList(polarDataService.getMedia());
    });
    return unsub;
  }, []);

  const categories = [
    { id: 'all', label: 'All Visuals', count: mediaList.length },
    { id: 'wildlife', label: 'Polar Wildlife', count: mediaList.filter((m) => /penguin|seal|whale|petrel|bird|fauna/i.test(m.title + m.caption)).length },
    { id: 'stations', label: 'Research Stations', count: mediaList.filter((m) => /station|maitri|bharati|himadri/i.test(m.title + m.caption + m.location)).length },
    { id: 'expeditions', label: 'Expeditions & Vessels', count: mediaList.filter((m) => /icebreak|convoy|iceberg|voyage|vessel/i.test(m.title + m.caption)).length },
    { id: 'science', label: 'Field Science & Sensors', count: mediaList.filter((m) => /core|ctd|drilling|rosette|sensor|glacier/i.test(m.title + m.caption)).length },
  ];

  const filteredMedia = mediaList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.credit.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'wildlife') {
      return /penguin|seal|whale|petrel|bird|fauna/i.test(item.title + item.caption);
    }
    if (activeCategory === 'stations') {
      return /station|maitri|bharati|himadri/i.test(item.title + item.caption + item.location);
    }
    if (activeCategory === 'expeditions') {
      return /icebreak|convoy|iceberg|voyage|vessel/i.test(item.title + item.caption);
    }
    if (activeCategory === 'science') {
      return /core|ctd|drilling|rosette|sensor|glacier/i.test(item.title + item.caption);
    }
    return true;
  });

  const handleShare = (item: ExpeditionMedia, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleToggleSave = (item: ExpeditionMedia, e: React.MouseEvent) => {
    e.stopPropagation();
    authService.toggleSaveItem({
      id: item.id,
      type: 'media',
      title: item.title,
      category: item.location,
      thumbnail: item.url,
      author: item.credit,
    });
  };

  const handleOpenReport = (item: ExpeditionMedia, e: React.MouseEvent) => {
    e.stopPropagation();
    setReportTarget({
      id: item.id,
      type: 'media',
      title: item.title,
    });
  };

  const handleLike = (item: ExpeditionMedia, e: React.MouseEvent) => {
    e.stopPropagation();
    polarDataService.toggleLike(item.id);
  };

  return (
    <div id="media-view-container" className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Left Back Button */}
      <TopLeftBackButton onBack={() => onNavigate('home')} currentView="media" targetLabel="Home" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-cyan-900/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-sky-950/80 border border-sky-600/50 text-sky-300 mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Official Polar Visual Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Media & Visuals Archive
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            High-resolution documentary photography, satellite imagery, expedition footage, and wildlife telemetry from Indian expeditions to Antarctica, the Arctic, and the Southern Ocean.
          </p>
        </div>

        {/* Action Buttons: Upload Visual & Switch to Datasets */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="upload-media-btn"
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            <span>+ Upload Photo / Visual</span>
          </button>

          <button
            id="media-to-datasets-btn"
            onClick={() => onNavigate('datasets')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#08172c] hover:bg-[#0f2c54] border border-cyan-700/60 hover:border-cyan-400 text-xs font-bold text-cyan-300 shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Switch to Datasets</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#08172c]/90 p-4 rounded-2xl border border-cyan-900/60">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 hover:border-cyan-500/40'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media, wildlife, stations..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900/90 border border-cyan-900/60 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedia.map((media) => {
          const isSaved = authService.isItemSaved(media.id);
          const interactions = polarDataService.getInteractions(media.id);

          return (
            <div
              key={media.id}
              id={`media-card-${media.id}`}
              onClick={() => setSelectedMedia(media)}
              className="group relative bg-[#08172c]/90 rounded-2xl overflow-hidden border border-cyan-900/50 hover:border-cyan-400/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-950/60 flex flex-col justify-between cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                <img
                  src={media.url}
                  alt={media.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08172c] via-transparent to-transparent opacity-80" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    {media.year}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700/50 uppercase">
                    {media.type}
                  </span>
                  {media.aiVerification && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50">
                      AI Verified
                    </span>
                  )}
                </div>

                {/* Top Action Icons (Save Bookmark & Report) */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleToggleSave(media, e)}
                    title={isSaved ? 'Remove from Saved' : 'Save to Profile'}
                    aria-label="Save media"
                    className={`p-1.5 rounded-lg backdrop-blur-md transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-700/50'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-slate-950' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => handleOpenReport(media, e)}
                    title="Report Unusual Activity"
                    aria-label="Report media"
                    className="p-1.5 rounded-lg bg-slate-950/70 text-slate-400 hover:text-amber-400 hover:bg-slate-900 border border-slate-700/50 backdrop-blur-md transition-all cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Location Tag */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1 text-[11px] font-medium text-slate-200 drop-shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{media.location}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors line-clamp-2 leading-snug font-['Outfit']">
                    {media.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {media.caption}
                  </p>
                </div>

                {/* Footer Metadata & Like Reaction */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[140px] text-slate-400 font-medium">
                    {media.credit}
                  </span>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => handleLike(media, e)}
                      aria-label="Like visual"
                      className={`flex items-center gap-1 transition-colors cursor-pointer ${
                        interactions.userHasLiked ? 'text-emerald-400 font-bold' : 'hover:text-cyan-300'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${interactions.userHasLiked ? 'fill-emerald-400' : ''}`} />
                      <span className="font-mono text-[11px]">{interactions.likes}</span>
                    </button>

                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-16 bg-[#08172c]/50 rounded-2xl border border-cyan-900/30">
          <Camera className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No media found</h3>
          <p className="text-xs text-slate-400 mt-1">Try changing your search term or category filter.</p>
        </div>
      )}

      {/* High-Resolution Modal View */}
      {selectedMedia && (
        <div
          id="media-modal-backdrop"
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 lg:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-[#08172c] border border-cyan-700/60 rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
          >
            {/* Modal Image Display */}
            <div className="relative w-full h-[52vh] sm:h-[60vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedMedia.url}
                alt={selectedMedia.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setSelectedMedia(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Info Footer */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                      {selectedMedia.year}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Location: {selectedMedia.location}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white font-['Outfit']">
                    {selectedMedia.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      authService.toggleSaveItem({
                        id: selectedMedia.id,
                        type: 'media',
                        title: selectedMedia.title,
                        category: selectedMedia.location,
                        thumbnail: selectedMedia.url,
                        author: selectedMedia.credit,
                      });
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      authService.isItemSaved(selectedMedia.id)
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{authService.isItemSaved(selectedMedia.id) ? 'Saved' : 'Save to Passport'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setReportTarget({
                        id: selectedMedia.id,
                        type: 'media',
                        title: selectedMedia.title,
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>

                  <button
                    onClick={() => handleShare(selectedMedia)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-cyan-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedId === selectedMedia.id ? 'Copied URL' : 'Share'}</span>
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedMedia.caption}
              </p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Credit: {selectedMedia.credit}</span>
                <span className="text-[11px] font-mono text-cyan-400">
                  Official NCPOR Antarctic & Arctic Telemetry Cell
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Post Modal */}
      <UploadPostModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        defaultType="media"
        onSuccess={() => setMediaList(polarDataService.getMedia())}
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
