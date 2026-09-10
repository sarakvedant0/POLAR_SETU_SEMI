import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  FileText,
  Camera,
  MessageSquare,
  Database,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { ViewMode, SavedItemRecord } from '../types';
import { authService } from '../services/authService';
import { TopLeftBackButton } from '../components/TopLeftBackButton';

interface SavedViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({ onNavigate }) => {
  const [savedItems, setSavedItems] = useState<SavedItemRecord[]>(authService.getSavedItems());
  const [activeFilter, setActiveFilter] = useState<'all' | 'research' | 'media' | 'voices' | 'dataset'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = authService.subscribe(() => {
      setSavedItems(authService.getSavedItems());
    });
    return unsub;
  }, []);

  const handleRemove = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    authService.toggleSaveItem({
      id: itemId,
      type: 'research', // type is ignored by toggle logic check on id
      title: '',
      category: '',
    });
  };

  const handleOpenItem = (item: SavedItemRecord) => {
    if (item.type === 'research') {
      onNavigate('report-detail', item.id);
    } else if (item.type === 'media') {
      onNavigate('media', item.id);
    } else if (item.type === 'voices') {
      onNavigate('voices', item.id);
    } else if (item.type === 'dataset') {
      onNavigate('database', item.id);
    } else {
      onNavigate('home');
    }
  };

  const filteredItems = savedItems.filter((item) => {
    if (activeFilter !== 'all' && item.type !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.author && item.author.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'research':
        return <FileText className="w-4 h-4 text-purple-400" />;
      case 'media':
        return <Camera className="w-4 h-4 text-cyan-400" />;
      case 'voices':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'dataset':
        return <Database className="w-4 h-4 text-amber-400" />;
      default:
        return <Bookmark className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030b17] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Left Back Button */}
        <TopLeftBackButton onBack={() => onNavigate('home')} currentView="saved" targetLabel="Home" />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-950 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Bookmark className="w-4 h-4 text-cyan-400" />
              <span>RESEARCH ARCHIVE & PERSONAL BOOKMARKS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-white">
              Saved Discoveries & Research
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              All bookmarks, research papers, field media, and community observations saved to your polar passport profile.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-[#081528] border border-cyan-500/30 text-center">
              <span className="text-xl font-bold text-cyan-300 font-mono">{savedItems.length}</span>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Saved Items</span>
            </div>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'research', label: 'Research Papers' },
              { id: 'media', label: 'Media & Visuals' },
              { id: 'voices', label: 'Community Posts' },
              { id: 'dataset', label: 'Datasets' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-[#081528] text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved items..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#081528] border border-cyan-950 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Content Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-[#081528]/60 border border-cyan-950/60 p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto">
              <Bookmark className="w-8 h-8 opacity-60" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                {savedItems.length === 0 ? 'No Saved Items Yet' : 'No Items Match Your Filter'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {savedItems.length === 0
                  ? 'Browse through Research Papers, Expeditions, Media, or Community Observations and click the "Save" bookmark icon to keep them in your personal repository.'
                  : 'Try changing your filter or clearing the search query to see other saved items.'}
              </p>
            </div>
            {savedItems.length === 0 && (
              <button
                onClick={() => onNavigate('reports')}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <span>Explore Research Papers</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenItem(item)}
                className="group relative rounded-2xl bg-[#081528] border border-cyan-950 hover:border-cyan-500/60 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-cyan-950/50"
              >
                {/* Thumbnail if present */}
                {item.thumbnail && (
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081528] via-transparent to-black/30" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-cyan-300 border border-cyan-800/80 backdrop-blur-md flex items-center gap-1.5">
                      {getIconForType(item.type)}
                      <span>{item.type}</span>
                    </span>
                  </div>
                )}

                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    {!item.thumbnail && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1">
                          {getIconForType(item.type)}
                          <span>{item.type}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{item.category}</span>
                      </div>
                    )}

                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    {item.author && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        By {item.author}
                      </p>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-cyan-950 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[10px] font-mono text-slate-500">
                      Saved {item.savedAt}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleRemove(item.id, e)}
                        title="Remove from saved"
                        aria-label="Remove item"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="flex items-center gap-1 text-cyan-400 font-bold group-hover:translate-x-0.5 transition-transform text-xs">
                        <span>Open</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
