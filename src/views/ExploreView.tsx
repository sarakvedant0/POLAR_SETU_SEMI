import React, { useState } from 'react';
import {
  Compass,
  Filter,
  Layers,
  ArrowRight,
  FileText,
  Building2,
  Database,
  Ship,
  Sparkles,
  Image as ImageIcon,
  Share2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Polar3DScene } from '../components/3d/Polar3DScene';
import { SCIENTIFIC_NODES, RESEARCH_REPORTS, EXPEDITIONS, DATASETS } from '../data/mockData';
import { ScientificNode, ViewMode } from '../types';

interface ExploreViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<ScientificNode>(SCIENTIFIC_NODES[0]);
  const [viewMode2D, setViewMode2D] = useState(false);

  const filters = [
    { id: 'all', label: 'All Knowledge Nodes' },
    { id: 'research', label: 'Research', icon: FileText },
    { id: 'station', label: 'Stations', icon: Building2 },
    { id: 'expedition', label: 'Expeditions', icon: Ship },
    { id: 'dataset', label: 'Datasets', icon: Database },
    { id: 'ai', label: 'Polar AI', icon: Sparkles },
    { id: 'media', label: 'Media', icon: ImageIcon },
  ];

  const filteredNodes = SCIENTIFIC_NODES.filter(
    (n) => activeFilter === 'all' || n.type === activeFilter
  );

  return (
    <div id="explore-view-container" className="w-full min-h-[calc(100vh-4rem)] flex flex-col bg-[#040b17]">
      {/* Header Bar */}
      <div className="border-b border-cyan-950/80 bg-[#061224]/90 px-4 sm:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white font-['Outfit']">
              3D Polar Science & Expedition Explorer
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interact with spatial 3D nodes representing India’s polar research stations, scientific papers, and datasets.
          </p>
        </div>

        {/* View Toggle and Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setViewMode2D(!viewMode2D)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{viewMode2D ? 'Switch to 3D View' : 'Switch to 2D Graph'}</span>
          </button>
        </div>
      </div>

      {/* Main Exploration Stage */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 relative min-h-[600px] overflow-hidden">
        {/* Left: 3D Scene / 2D Graph Canvas (Col 8) */}
        <div className="lg:col-span-8 relative bg-gradient-to-b from-[#061124] to-[#040813] min-h-[450px] lg:min-h-full">
          {!viewMode2D ? (
            <Polar3DScene
              nodes={filteredNodes}
              activeNodeId={selectedNode.id}
              onNodeClick={(node) => setSelectedNode(node)}
              interactive={true}
            />
          ) : (
            /* 2D Knowledge Graph Fallback / Alternative */
            <div className="w-full h-full p-8 flex flex-col items-center justify-center relative">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-xl w-full z-10">
                {filteredNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedNode.id === node.id
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.3)] text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-cyan-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      {node.category}
                    </div>
                    <div className="text-sm font-bold text-white mt-1">{node.label}</div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {node.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Floating Filter Pills on the 3D Canvas */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5 max-w-md">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-lg shadow-cyan-500/20'
                    : 'bg-[#08172c]/80 text-slate-300 border-cyan-900/60 hover:bg-[#0e274c]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Helper hint */}
          <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-full bg-[#08172c]/80 border border-slate-800 text-[11px] text-slate-400 backdrop-blur-md">
            Click on any 3D node to inspect connected scientific data
          </div>
        </div>

        {/* Right: Selected Node Details & Connected Knowledge Panel (Col 4) */}
        <div className="lg:col-span-4 bg-[#07152b] border-t lg:border-t-0 lg:border-l border-cyan-950/80 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            {/* Active Node Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/50 uppercase tracking-wider mb-2">
                <span>{selectedNode.category} Node</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
                {selectedNode.label}
              </h2>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            {/* Connected Knowledge Pathways */}
            <div className="border-t border-slate-800/80 pt-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
                Connected Knowledge Entities
              </h3>
              <div className="space-y-2">
                {(selectedNode?.connectedTo || []).map((targetId) => {
                  const target = SCIENTIFIC_NODES.find((n) => n.id === targetId);
                  if (!target) return null;
                  return (
                    <div
                      key={targetId}
                      onClick={() => setSelectedNode(target)}
                      className="p-3 rounded-xl bg-slate-900/60 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between transition-all group"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-cyan-200">
                          {target.label}
                        </div>
                        <div className="text-[11px] text-slate-400">{target.category}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Related Research Paper Preview */}
            <div className="border-t border-slate-800/80 pt-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                Associated Research
              </h3>
              <div className="p-3 rounded-xl bg-[#091e3d] border border-cyan-800/40 text-xs">
                <div className="font-bold text-white">
                  Accelerated Ice Shelf Melting in the Indian Sector
                </div>
                <div className="text-slate-400 mt-1">
                  NCPOR & 43rd Indian Scientific Expedition
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-6 border-t border-slate-800/80">
            <button
              onClick={() => onNavigate(selectedNode.route)}
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <span>Open {selectedNode.label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
