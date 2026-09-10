import React, { useState } from 'react';
import { Image as ImageIcon, Video, MapPin, Calendar, ExternalLink, Download } from 'lucide-react';
import { EXPEDITION_MEDIA } from '../data/mockData';
import { ExpeditionMedia, ViewMode } from '../types';

interface MediaArchiveViewProps {
  onNavigate: (view: ViewMode) => void;
}

export const MediaArchiveView: React.FC<MediaArchiveViewProps> = ({ onNavigate }) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeMedia, setActiveMedia] = useState<ExpeditionMedia | null>(null);

  const filtered = EXPEDITION_MEDIA.filter(
    (m) => selectedType === 'all' || m.type === selectedType
  );

  return (
    <div id="media-archive-view" className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>NCPOR Polar Visual Archives</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Polar Expedition Media & Satellite Imagery
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            High-resolution visual documentation from Indian scientific stations Bharati, Maitri, Himadri, and Southern Ocean expedition vessels.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {['all', 'photo', 'video'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                selectedType === t
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {t === 'all' ? 'All Media' : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveMedia(item)}
            className="group rounded-2xl overflow-hidden bg-[#08172c] border border-cyan-900/60 hover:border-cyan-400 transition-all duration-300 cursor-pointer shadow-xl"
          >
            <div className="relative h-56 w-full overflow-hidden bg-slate-900">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-cyan-300 uppercase">
                  {item.type}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-xs text-slate-300 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-white truncate mr-2">{item.location}</span>
                <span className="text-[11px] text-slate-400">{item.year}</span>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors font-['Outfit']">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">{item.caption}</p>
              <div className="text-[10px] text-slate-500 font-mono pt-1">
                Credit: {item.credit}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal if an item is selected */}
      {activeMedia && (
        <div
          onClick={() => setActiveMedia(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020612]/90 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-[#08172c] border border-cyan-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6 text-slate-200"
          >
            <div className="relative rounded-2xl overflow-hidden max-h-[60vh] bg-slate-950">
              <img
                src={activeMedia.url}
                alt={activeMedia.title}
                className="w-full h-full object-contain mx-auto"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  {activeMedia.title}
                </h3>
                <span className="text-xs text-slate-400">{activeMedia.year}</span>
              </div>
              <p className="text-sm text-slate-300 mt-2">{activeMedia.caption}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400 mt-4">
                <span>Location: {activeMedia.location}</span>
                <span className="font-mono">Credit: {activeMedia.credit}</span>
                <button
                  onClick={() => setActiveMedia(null)}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
