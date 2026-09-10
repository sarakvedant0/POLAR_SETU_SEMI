import React, { useState } from 'react';
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
} from 'lucide-react';
import { EXPEDITION_MEDIA } from '../data/mockData';
import { ExpeditionMedia, ViewMode } from '../types';

interface MediaViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const MediaView: React.FC<MediaViewProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMedia, setSelectedMedia] = useState<ExpeditionMedia | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Visuals', count: EXPEDITION_MEDIA.length },
    { id: 'wildlife', label: 'Polar Wildlife', count: 4 },
    { id: 'stations', label: 'Research Stations', count: 3 },
    { id: 'expeditions', label: 'Expeditions & Icebreakers', count: 3 },
    { id: 'science', label: 'Field Science & Drilling', count: 2 },
  ];

  const filteredMedia = EXPEDITION_MEDIA.filter((item) => {
    // Search query filter
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.credit.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Category filter
    if (activeCategory === 'all') return true;
    if (activeCategory === 'wildlife') {
      return (
        item.title.toLowerCase().includes('penguin') ||
        item.title.toLowerCase().includes('seal') ||
        item.title.toLowerCase().includes('whale') ||
        item.title.toLowerCase().includes('petrel')
      );
    }
    if (activeCategory === 'stations') {
      return (
        item.title.toLowerCase().includes('station') ||
        item.title.toLowerCase().includes('maitri') ||
        item.title.toLowerCase().includes('bharati') ||
        item.title.toLowerCase().includes('himadri')
      );
    }
    if (activeCategory === 'expeditions') {
      return (
        item.title.toLowerCase().includes('icebreak') ||
        item.title.toLowerCase().includes('convoy') ||
        item.title.toLowerCase().includes('iceberg') ||
        item.title.toLowerCase().includes('voyage')
      );
    }
    if (activeCategory === 'science') {
      return (
        item.title.toLowerCase().includes('core') ||
        item.title.toLowerCase().includes('ctd') ||
        item.title.toLowerCase().includes('drilling') ||
        item.title.toLowerCase().includes('rosette')
      );
    }
    return true;
  });

  const handleShare = (item: ExpeditionMedia) => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div id="media-view-container" className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner with Extra Space */}
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
            High-resolution documentary photography, satellite imagery, expedition footage, and wildlife telemetry from 44+ Indian expeditions to Antarctica, the Arctic, and the Southern Ocean.
          </p>
        </div>

        {/* Quick Link to Datasets with Extra Clear Separation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            id="media-to-datasets-btn"
            onClick={() => onNavigate('datasets')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#08172c] hover:bg-[#0f2c54] border border-cyan-700/60 hover:border-cyan-400 text-xs font-bold text-cyan-300 shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Switch to Scientific Datasets</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar: Extra Spacious & Clear */}
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

      {/* Gallery Grid: Spread Clearly with Generous Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedia.map((media) => (
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08172c] via-transparent to-transparent opacity-80" />

              {/* Top Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                  {media.year}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700/50">
                  {media.type === 'photo' ? 'Photo' : 'Video'}
                </span>
              </div>

              {/* View Overlay Button */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Location Tag */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1 text-[11px] font-medium text-slate-200 drop-shadow-md">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="truncate">{media.location}</span>
              </div>
            </div>

            {/* Card Content with Clear Spacing */}
            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors line-clamp-2 leading-snug font-['Outfit']">
                  {media.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {media.caption}
                </p>
              </div>

              {/* Footer Metadata */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[160px] text-slate-400 font-medium">
                  {media.credit}
                </span>
                <span className="text-cyan-400 font-semibold group-hover:underline flex items-center gap-1 flex-shrink-0">
                  <span>Enlarge</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        ))}
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
            className="relative w-full max-w-5xl bg-[#08172c] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-[#061325]">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit']">
                  {selectedMedia.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {selectedMedia.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    {selectedMedia.year}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(selectedMedia)}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Share link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image View */}
            <div className="relative flex-1 min-h-[350px] max-h-[550px] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedMedia.url}
                alt={selectedMedia.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer Information */}
            <div className="p-4 sm:p-6 bg-[#061325] border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-sm text-slate-200 leading-relaxed">
                  {selectedMedia.caption}
                </p>
                <div className="mt-2 text-xs text-cyan-300 font-semibold">
                  Official Attribution: <span className="text-slate-300 font-normal">{selectedMedia.credit}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                {selectedMedia.expeditionId && (
                  <button
                    onClick={() => {
                      const expId = selectedMedia.expeditionId;
                      setSelectedMedia(null);
                      onNavigate('expedition-detail', expId);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600/50 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    View Expedition
                  </button>
                )}
                <a
                  href={selectedMedia.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Full Resolution</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
