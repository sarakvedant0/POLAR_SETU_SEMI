import React, { useState, useEffect } from 'react';
import {
  Database,
  Download,
  Calendar,
  MapPin,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Search,
  Image as ImageIcon,
  ShieldAlert,
  Plus,
} from 'lucide-react';
import { polarDataService } from '../services/dataService';
import { Dataset, ViewMode } from '../types';

interface DatasetsViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const DatasetsView: React.FC<DatasetsViewProps> = ({ onNavigate }) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | undefined>();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void polarDataService.getDatasets().then((initial) => {
      if (!active) return;
      setDatasets(initial);
      setSelectedDataset(initial[0]);
    });

    const unsub = polarDataService.subscribe(() => {
      void polarDataService.getDatasets().then((updated) => {
        if (!active) return;
        setDatasets(updated);
        setSelectedDataset((prev) => updated.find((d) => d.id === prev?.id) || updated[0]);
      });
    });
    return () => {
      active = false;
      unsub();
    };
  }, []);

  const currentDataset = selectedDataset || datasets[0];

  if (!currentDataset) {
    return (
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl border border-cyan-900/60 bg-[#08172c] p-8 text-center text-slate-300">
          Loading datasets from Supabase...
        </div>
      </div>
    );
  }

  const handleDownload = (d: Dataset) => {
    // Generate actual CSV content
    const headers = 'Timeframe,Parameter Value,Unit\n';
    const rows = (d?.dataPoints || []).map((p) => `${p.label},${p.value},${p.unit || ''}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${d.id}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(d.title);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  // Find min and max for svg chart
  const dataPoints = currentDataset?.dataPoints || [];
  const values = dataPoints.map((p) => p.value);
  const minVal = values.length > 0 ? Math.min(...values) : 0;
  const maxVal = values.length > 0 ? Math.max(...values) : 100;
  const range = maxVal - minVal || 1;

  return (
    <div id="datasets-view-container" className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Open Cryosphere Data Repository</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Polar Science Datasets & Time Series
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Calibrated observations spanning 40+ years of Antarctic ice core records, ice shelf thickness surveys, and Southern Ocean CTD transects.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {downloadSuccess && (
            <div className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <span>Downloaded "{downloadSuccess}" CSV</span>
            </div>
          )}

          <button
            onClick={() => onNavigate('admin')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/60 text-xs font-bold text-cyan-300 shadow-md transition-all cursor-pointer whitespace-nowrap"
            title="Open Admin Portal to enter or edit datasets"
          >
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Admin Data Entry</span>
          </button>

          <button
            id="datasets-to-media-btn"
            onClick={() => onNavigate('media')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#08172c] hover:bg-[#0f2c54] border border-sky-700/60 hover:border-sky-400 text-xs font-bold text-sky-300 shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <ImageIcon className="w-4 h-4 text-sky-400" />
            <span>Switch to Media & Visuals Archive</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: Left Dataset Selector & Right Live Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Datasets List (Col 5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Select Scientific Repository ({datasets.length})
            </h2>
            <button
              onClick={() => onNavigate('admin')}
              className="text-[11px] text-cyan-300 hover:text-cyan-200 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Enter New Dataset</span>
            </button>
          </div>
          {datasets.map((d) => {
            const isSelected = currentDataset.id === d.id;
            return (
              <div
                key={d.id}
                onClick={() => setSelectedDataset(d)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#0a1e3b] border-cyan-400 shadow-lg shadow-cyan-950/60'
                    : 'bg-[#08172c] border-cyan-900/40 hover:border-cyan-700 hover:bg-[#0b203d]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-bold text-white font-['Outfit']">{d.title}</div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {d.format}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{d.description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
                  <span>{d.timeframe}</span>
                  <span className="font-mono text-cyan-400">{d.fileSize}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Data Visualization & Download (Col 7) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#08172c] border border-cyan-900/80 shadow-2xl flex flex-col justify-between gap-6">
          {/* Header of selected dataset */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {currentDataset.parameter}
              </span>
              <button
                onClick={() => handleDownload(currentDataset)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md cursor-pointer transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Dataset ({currentDataset.fileSize})</span>
              </button>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-2 font-['Outfit']">
              {currentDataset.title}
            </h2>
            <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
              <span>Location: {currentDataset.location}</span>
              <span>•</span>
              <span>Samples: {currentDataset.samplesCount.toLocaleString()}</span>
              <span>•</span>
              <span className="font-mono text-cyan-300">DOI: {currentDataset.doi}</span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="p-4 rounded-2xl bg-[#050f1d] border border-cyan-950 relative">
            <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
              <span>Observed Decadal Progression</span>
              <span className="text-cyan-400 font-mono">
                Latest: {currentDataset.dataPoints.length > 0
                  ? `${currentDataset.dataPoints[currentDataset.dataPoints.length - 1].value} ${currentDataset.dataPoints[0].unit || ''}`
                  : 'No samples available'}
              </span>
            </div>

            {/* Responsive SVG Chart */}
            <div className="w-full h-56 flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#1e293b" strokeDasharray="4 4" />

                {/* Polyline */}
                {(() => {
                  const points = dataPoints
                    .map((p, i) => {
                      const x = (i / Math.max(1, dataPoints.length - 1)) * 480 + 10;
                      const y = 160 - ((p.value - minVal) / range) * 130;
                      return `${x},${y}`;
                    })
                    .join(' ');

                  return (
                    <>
                      {/* Gradient area */}
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <polygon
                        points={`10,170 ${points} 490,170`}
                        fill="url(#chartGrad)"
                      />
                      <polyline
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        points={points}
                      />
                      {/* Points */}
                      {dataPoints.map((p, i) => {
                        const x = (i / Math.max(1, dataPoints.length - 1)) * 480 + 10;
                        const y = 160 - ((p.value - minVal) / range) * 130;
                        return (
                          <g key={i} className="group">
                            <circle
                              cx={x}
                              cy={y}
                              r="5"
                              fill="#08172c"
                              stroke="#38bdf8"
                              strokeWidth="2.5"
                            />
                            <text
                              x={x}
                              y={y - 10}
                              fill="#94a3b8"
                              fontSize="10"
                              textAnchor="middle"
                            >
                              {p.value}
                            </text>
                            <text
                              x={x}
                              y={175}
                              fill="#64748b"
                              fontSize="10"
                              textAnchor="middle"
                            >
                              {p.label}
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>

          {/* Data Samples Table Preview */}
          <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
            <div className="bg-[#050f1d] px-4 py-2 border-b border-slate-800 font-bold text-slate-300">
              Raw Sample Log Preview
            </div>
            <div className="divide-y divide-slate-800/60 max-h-36 overflow-y-auto">
              {dataPoints.map((row, idx) => (
                <div key={idx} className="px-4 py-1.5 flex items-center justify-between text-slate-300">
                  <span>Year / Level: {row.label}</span>
                  <span className="font-mono text-cyan-300">
                    {row.value} {row.unit || ''}
                  </span>
                  {row.anomaly !== undefined && (
                    <span
                      className={`text-[10px] ${
                        row.anomaly >= 0 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      Anomaly: {row.anomaly > 0 ? `+${row.anomaly}` : row.anomaly}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
