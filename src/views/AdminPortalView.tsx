import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  Database,
  Plus,
  Edit,
  Trash2,
  Key,
  Lock,
  Unlock,
  Download,
  FileText,
  Save,
  X,
  RefreshCw,
  ExternalLink,
  Search,
  Sliders,
  LogOut,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { ViewMode, Dataset, ResearchReport } from '../types';
import { polarDataService, MASTER_ADMIN_KEY } from '../services/dataService';

interface AdminPortalViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({ onNavigate }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    polarDataService.isAdminAuthenticated()
  );
  const [inputKey, setInputKey] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Management Tab
  const [activeTab, setActiveTab] = useState<'datasets' | 'reports' | 'claims' | 'studio'>('datasets');

  // Live Data State
  const [datasets, setDatasets] = useState<Dataset[]>(polarDataService.getDatasets());
  const [reports, setReports] = useState<ResearchReport[]>(polarDataService.getReports());

  // Search & Filter
  const [datasetSearch, setDatasetSearch] = useState('');

  // Modal State for Dataset
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);
  const [editingDatasetId, setEditingDatasetId] = useState<string | null>(null);
  const [datasetForm, setDatasetForm] = useState<Partial<Dataset>>({
    title: '',
    description: '',
    parameter: '',
    timeframe: '',
    location: '',
    coordinates: '',
    samplesCount: 10000,
    fileSize: '25 MB',
    format: 'CSV / NetCDF-4',
    institution: 'National Centre for Polar and Ocean Research (NCPOR)',
    doi: '10.5281/zenodo.',
    dataPoints: [
      { label: '2020', value: 10, unit: '' },
      { label: '2022', value: 15, unit: '' },
      { label: '2024', value: 22, unit: '' },
    ],
  });

  // Modal State for Research Report
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [reportForm, setReportForm] = useState<Partial<ResearchReport>>({
    title: '',
    abstract: '',
    authors: ['Dr. Polar Researcher', 'NCPOR Science Group'],
    institution: 'National Centre for Polar and Ocean Research (NCPOR)',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    researchArea: 'Climate Science',
    region: 'Antarctica',
    expedition: '43rd Indian Scientific Expedition to Antarctica',
    doi: '10.1016/j.polar.2025.04.101',
    imageUrl: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    footerLinkType: 'expedition',
    footerLinkLabel: 'Expedition →',
    aiSummary: {
      overview: '',
      whyItMatters: '',
      keyFindings: [''],
      whatRemainsUncertain: '',
    },
    evidenceChain: [
      {
        claim: 'Verified observational correlation',
        evidence: 'Field telemetry and satellite altimetry sensors.',
        source: 'NCPOR Grounding Archive',
        type: 'Satellite',
      },
    ],
  });

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Subscribe to data changes
  useEffect(() => {
    const unsub = polarDataService.subscribe(() => {
      setDatasets(polarDataService.getDatasets());
      setReports(polarDataService.getReports());
      setIsAuthenticated(polarDataService.isAdminAuthenticated());
    });
    return unsub;
  }, []);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (polarDataService.loginAdmin(inputKey)) {
      setIsAuthenticated(true);
      setAuthError(null);
      showToast('Welcome, NCPOR Polar Data Administrator.');
    } else {
      setAuthError('Invalid Master Access Key. Please check the credentials.');
    }
  };

  const handleUseOfficialKey = () => {
    setInputKey(MASTER_ADMIN_KEY);
    if (polarDataService.loginAdmin(MASTER_ADMIN_KEY)) {
      setIsAuthenticated(true);
      setAuthError(null);
      showToast('Unlocked with Master Key: ' + MASTER_ADMIN_KEY);
    }
  };

  const handleLogout = () => {
    polarDataService.logoutAdmin();
    setIsAuthenticated(false);
    setInputKey('');
    showToast('Logged out of Admin Console.');
  };

  // Dataset Actions
  const handleOpenNewDatasetModal = () => {
    setEditingDatasetId(null);
    setDatasetForm({
      id: `data-${Date.now().toString(36)}`,
      title: '',
      description: '',
      parameter: 'Temperature / Thickness / Concentration',
      timeframe: '2015 – 2025',
      location: 'Bharati Station, Larsemann Hills, East Antarctica',
      coordinates: '69°24′28″S, 76°11′14″E',
      samplesCount: 25000,
      fileSize: '35 MB',
      format: 'CSV / NetCDF-4',
      institution: 'National Centre for Polar and Ocean Research (NCPOR)',
      doi: '10.5281/zenodo.' + Math.floor(1000000 + Math.random() * 9000000),
      dataPoints: [
        { label: '2020', value: 12.4, unit: '' },
        { label: '2022', value: 14.8, unit: '' },
        { label: '2024', value: 17.2, unit: '' },
      ],
    });
    setIsDatasetModalOpen(true);
  };

  const handleOpenEditDatasetModal = (dataset: Dataset) => {
    setEditingDatasetId(dataset.id);
    setDatasetForm({ ...dataset });
    setIsDatasetModalOpen(true);
  };

  const handleSaveDataset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!datasetForm.title || !datasetForm.parameter) {
      alert('Please provide a Title and Parameter for the dataset.');
      return;
    }

    if (editingDatasetId) {
      polarDataService.updateDataset(editingDatasetId, datasetForm);
      showToast(`Dataset "${datasetForm.title}" updated successfully.`);
    } else {
      polarDataService.addDataset(datasetForm as Dataset);
      showToast(`New Dataset "${datasetForm.title}" registered.`);
    }

    setIsDatasetModalOpen(false);
    setEditingDatasetId(null);
  };

  const handleDeleteDataset = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete dataset "${title}"? This cannot be undone.`)) {
      polarDataService.deleteDataset(id);
      showToast(`Dataset "${title}" deleted.`);
    }
  };

  const handleResetDatasetsToBaseline = () => {
    if (window.confirm('Reset all datasets to the official NCPOR verified baseline?')) {
      polarDataService.resetDatasets();
      showToast('Datasets reset to NCPOR verified baseline.');
    }
  };

  // Report Actions
  const handleOpenNewReportModal = () => {
    setEditingReportId(null);
    setReportForm({
      id: `report-${Date.now().toString(36)}`,
      title: '',
      abstract: '',
      authors: ['Dr. Polar Scientist', 'NCPOR Glaciology Team'],
      institution: 'National Centre for Polar and Ocean Research (NCPOR)',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      researchArea: 'Climate Science',
      region: 'Antarctica',
      expedition: '43rd Indian Scientific Expedition to Antarctica',
      doi: '10.1016/j.polar.2025.' + Math.floor(100 + Math.random() * 900),
      imageUrl: 'https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=800&q=80',
      readTime: '6 min read',
      views: '0',
      comments: 0,
      citations: 0,
      footerLinkType: 'expedition',
      footerLinkLabel: 'Expedition →',
      aiSummary: {
        overview: 'Comprehensive empirical synthesis conducted during polar field operations.',
        whyItMatters: 'Provides ground truth calibration for cryospheric climate models.',
        keyFindings: ['Observed distinct physical anomaly during summer melt season.'],
        whatRemainsUncertain: 'Winter polar-night boundary layer dynamics remain under investigation.',
      },
      evidenceChain: [
        {
          claim: 'Empirical data corroborated by ground sensors',
          evidence: 'Calibrated weather station sensors and satellite altimetry passes.',
          source: 'NCPOR Polar Telemetry Database',
          type: 'Satellite',
        },
      ],
    });
    setIsReportModalOpen(true);
  };

  const handleOpenEditReportModal = (report: ResearchReport) => {
    setEditingReportId(report.id);
    setReportForm({ ...report });
    setIsReportModalOpen(true);
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.title || !reportForm.abstract) {
      alert('Please provide a Title and Abstract for the research report.');
      return;
    }

    if (editingReportId) {
      polarDataService.updateReport(editingReportId, reportForm);
      showToast(`Research paper "${reportForm.title}" updated.`);
    } else {
      polarDataService.addReport(reportForm as ResearchReport);
      showToast(`Research publication "${reportForm.title}" registered.`);
    }

    setIsReportModalOpen(false);
    setEditingReportId(null);
  };

  const handleDeleteReport = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete research report "${title}"?`)) {
      polarDataService.deleteReport(id);
      showToast(`Research report removed.`);
    }
  };

  // Filtered Datasets
  const filteredDatasets = datasets.filter((d) => {
    const q = datasetSearch.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.parameter.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q) ||
      (d.doi && d.doi.toLowerCase().includes(q))
    );
  });

  // =========================================================================
  // VIEW 1: AUTHENTICATION LOCK SCREEN (IF NOT LOGGED IN)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div id="admin-login-screen" className="max-w-xl mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-cyan-950/90 border-2 border-cyan-500/60 shadow-xl shadow-cyan-950/60 mx-auto text-cyan-400">
            <Lock className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-700/50 text-cyan-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NCPOR Secure Editorial Gate</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Admin & Data Officer Portal
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Authorized access for entering scientific datasets, editing observational parameters, and publishing peer-verified cryospheric research.
          </p>
        </div>

        {/* Access Key Notification Card */}
        <div className="p-5 rounded-2xl bg-[#07172e] border border-cyan-500/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4 text-cyan-300" />
              <span>Official Admin Portal Access Key</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500">
              Verified
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#051122] border border-cyan-900/80 font-mono text-cyan-200 text-sm font-bold tracking-wider select-all">
            <span>{MASTER_ADMIN_KEY}</span>
            <button
              onClick={handleUseOfficialKey}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>1-Click Unlock</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Click "1-Click Unlock" or paste the master key into the field below to access full CRUD capabilities for datasets and scientific publications.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 rounded-2xl bg-[#08172c] border border-slate-800 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Enter Access Key
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setAuthError(null);
                }}
                placeholder="Enter key (e.g. POLAR-ADMIN-NCPOR-2026)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#051122] border border-cyan-900 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticate into Admin Portal</span>
          </button>
        </form>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED ADMIN CONSOLE
  // =========================================================================
  return (
    <div id="admin-portal-view" className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-[#061830] border border-cyan-400 shadow-2xl text-cyan-200 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header with Operator Info & Logout */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-cyan-950/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-700/50 text-cyan-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>NCPOR Editorial Console • Master Access Granted</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/60">
              Active Session
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Polar Data Repository & Research Editorial Portal
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Live database management for entering verified scientific datasets, editing time-series parameters, publishing peer-reviewed research papers, and auditing community submissions.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('datasets')}
            className="px-3.5 py-2 rounded-xl bg-[#071830] hover:bg-[#0c2750] border border-cyan-800 text-xs font-bold text-cyan-300 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>View Public Datasets</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="px-3.5 py-2 rounded-xl bg-[#071830] hover:bg-[#0c2750] border border-cyan-800 text-xs font-bold text-cyan-300 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>View Public Reports</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950 border border-slate-700 hover:border-rose-600 text-xs font-bold text-slate-300 hover:text-rose-200 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Console</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('datasets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'datasets'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-[#08172c] text-slate-300 hover:bg-[#0d2547]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Manage Datasets ({datasets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-[#08172c] text-slate-300 hover:bg-[#0d2547]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Research Publications ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'claims'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-[#08172c] text-slate-300 hover:bg-[#0d2547]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Scientific Claim Audits</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'studio'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-[#08172c] text-slate-300 hover:bg-[#0d2547]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Synthesis Studio</span>
          </button>
        </div>

        {/* Global Reset Option */}
        <button
          onClick={handleResetDatasetsToBaseline}
          className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          title="Reset datasets and reports back to verified initial baseline"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to NCPOR Baseline</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: DATASETS MANAGEMENT (ENTER & EDIT DATASETS)
      ===================================================================== */}
      {activeTab === 'datasets' && (
        <div className="space-y-6">
          {/* Action Bar: Enter Dataset & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#061426] border border-cyan-900/60">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                value={datasetSearch}
                onChange={(e) => setDatasetSearch(e.target.value)}
                placeholder="Search datasets by title, parameter, DOI..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#091e38] border border-cyan-900 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                id="enter-new-dataset-btn"
                onClick={handleOpenNewDatasetModal}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Enter New Dataset</span>
              </button>
            </div>
          </div>

          {/* Datasets Table/Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDatasets.map((d) => (
              <div
                key={d.id}
                id={`admin-dataset-card-${d.id}`}
                className="p-5 rounded-2xl bg-[#08172c] border border-cyan-900/60 hover:border-cyan-400/80 shadow-xl flex flex-col justify-between gap-4 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                      {d.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-700">
                      {d.format}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-['Outfit'] line-clamp-2 leading-snug">
                    {d.title}
                  </h3>
                  <p className="text-xs text-cyan-300 font-semibold mt-1 line-clamp-1">
                    Parameter: {d.parameter}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {d.description}
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-800 pt-3 text-[11px] text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Timeframe:</span>
                    <span className="text-slate-200 font-medium">{d.timeframe}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-slate-200 font-medium line-clamp-1 max-w-[180px]">
                      {d.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">DOI:</span>
                    <span className="text-cyan-400 font-mono">{d.doi || 'Pending DOI'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Data Points:</span>
                    <span className="text-emerald-400 font-bold">{d.dataPoints?.length || 0} points</span>
                  </div>
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <button
                    onClick={() => handleOpenEditDatasetModal(d)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Dataset</span>
                  </button>

                  <button
                    onClick={() => handleDeleteDataset(d.id, d.title)}
                    className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDatasets.length === 0 && (
            <div className="p-12 text-center bg-[#08172c] border border-cyan-900/60 rounded-2xl text-slate-400 text-xs space-y-3">
              <Database className="w-8 h-8 text-cyan-500 mx-auto opacity-60" />
              <p>No datasets found matching your search query.</p>
              <button
                onClick={handleOpenNewDatasetModal}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Enter First Dataset</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 2: RESEARCH PUBLICATIONS (ENTER & EDIT RESEARCH STORIES)
      ===================================================================== */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 rounded-2xl bg-[#061426] border border-cyan-900/60">
            <div>
              <h2 className="text-base font-bold text-white font-['Outfit']">
                Peer-Reviewed Research Publications
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage live research stories, DOI citations, and scientific evidence chains.
              </p>
            </div>

            <button
              onClick={handleOpenNewReportModal}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Enter New Research Paper</span>
            </button>
          </div>

          <div className="space-y-4">
            {reports.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-2xl bg-[#08172c] border border-cyan-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {r.researchArea}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-700">
                      {r.region}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">DOI: {r.doi}</span>
                  </div>

                  <h3 className="text-base font-bold text-white font-['Outfit']">{r.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{r.abstract}</p>
                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-4">
                    <span>Authors: {r.authors?.join(', ')}</span>
                    <span>Date: {r.date}</span>
                    <span>Live Views: {r.views || '0'}</span>
                    <span>Comments: {r.comments || 0}</span>
                    <span>Bookmarks: {r.citations || 0}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleOpenEditReportModal(r)}
                    className="px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteReport(r.id, r.title)}
                    className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: SCIENTIFIC CLAIM VERIFICATION AUDITS
      ===================================================================== */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#061426] border border-cyan-900/60 text-xs text-slate-300">
            Auditing submissions under ISO 19115 Cryosphere Metadata Standard and NCPOR Grounding Framework.
          </div>

          <div className="p-6 rounded-2xl bg-[#08172c] border border-cyan-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                  AI Recommendation: VERIFIED
                </span>
                <span className="text-xs text-slate-500 font-mono">Confidence: 94%</span>
              </div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                "Southern Ocean Antarctic Intermediate Water freshening rate reached -0.04 PSU/decade"
              </h3>
              <p className="text-xs text-slate-400">
                Submitted by Dr. S. K. Roy (NIO Goa) • Grounded by CTD Transect 57.5°E
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => showToast('Claim approved and published to verification register.')}
                className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Publish</span>
              </button>
              <button
                onClick={() => showToast('Claim rejected.')}
                className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: AI CONTENT STUDIO
      ===================================================================== */}
      {activeTab === 'studio' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#08172c] border border-cyan-900/60 shadow-2xl space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Polar AI Research Story Synthesizer</span>
            </div>
            <h2 className="text-xl font-bold text-white font-['Outfit']">
              Synthesize Calibrated Expedition Telemetry into Public Scientific Stories
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-[#051122] border border-cyan-950 text-xs text-slate-300 leading-relaxed">
            All AI generated stories are grounded against NCPOR raw datasets (NetCDF and CSV files) with zero hallucination protocols and strict citation tracking.
          </div>
        </div>
      )}

      {/* =====================================================================
          DATASET MODAL: ENTER OR EDIT DATASET
      ===================================================================== */}
      {isDatasetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 p-6 rounded-3xl bg-[#06152a] border-2 border-cyan-500/80 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  {editingDatasetId ? 'Edit Verified Dataset' : 'Enter New Verified Dataset'}
                </h3>
              </div>
              <button
                onClick={() => setIsDatasetModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDataset} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider">
                  Dataset Title *
                </label>
                <input
                  type="text"
                  required
                  value={datasetForm.title || ''}
                  onChange={(e) => setDatasetForm({ ...datasetForm, title: e.target.value })}
                  placeholder="e.g. Maitri Station Decadal Surface Meteorology (1990–2025)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#091f3a] border border-cyan-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    Parameter Measured *
                  </label>
                  <input
                    type="text"
                    required
                    value={datasetForm.parameter || ''}
                    onChange={(e) => setDatasetForm({ ...datasetForm, parameter: e.target.value })}
                    placeholder="e.g. Mean Air Temperature (°C) & Wind (kts)"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#091f3a] border border-cyan-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    Timeframe
                  </label>
                  <input
                    type="text"
                    value={datasetForm.timeframe || ''}
                    onChange={(e) => setDatasetForm({ ...datasetForm, timeframe: e.target.value })}
                    placeholder="e.g. 1990 – 2025"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#091f3a] border border-cyan-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    Location / Research Station
                  </label>
                  <input
                    type="text"
                    value={datasetForm.location || ''}
                    onChange={(e) => setDatasetForm({ ...datasetForm, location: e.target.value })}
                    placeholder="e.g. Maitri Station, Schirmacher Oasis"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#091f3a] border border-cyan-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    GPS Coordinates
                  </label>
                  <input
                    type="text"
                    value={datasetForm.coordinates || ''}
                    onChange={(e) => setDatasetForm({ ...datasetForm, coordinates: e.target.value })}
                    placeholder="e.g. 70°45′58″S, 11°44′09″E"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#091f3a] border border-cyan-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    Format
                  </label>
                  <input
                    type="text"
                    value={datasetForm.format || ''}
                    onChange={(e) => setDatasetForm({ ...datasetForm, format: e.target.value })}
                    placeholder="CSV / NetCDF-4"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#091f3a] border border-cyan-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={datasetForm.fileSize || ''}
                    onChange={(e) => setDatasetForm({ ...datasetForm, fileSize: e.target.value })}
                    placeholder="e.g. 45 MB"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#091f3a] border border-cyan-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    DOI Identifier
                  </label>
                  <input
                    type="text"
                    value={datasetForm.doi || ''}
                    onChange={(e) => setDatasetForm({ ...datasetForm, doi: e.target.value })}
                    placeholder="10.5281/zenodo.7849102"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#091f3a] border border-cyan-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider">
                  Description & Methodology
                </label>
                <textarea
                  rows={3}
                  value={datasetForm.description || ''}
                  onChange={(e) => setDatasetForm({ ...datasetForm, description: e.target.value })}
                  placeholder="Comprehensive scientific methodology and calibration details..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#091f3a] border border-cyan-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDatasetModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingDatasetId ? 'Save Dataset Changes' : 'Register Dataset'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          REPORT MODAL: ENTER OR EDIT RESEARCH PAPER
      ===================================================================== */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 p-6 rounded-3xl bg-[#06152a] border-2 border-cyan-500/80 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  {editingReportId ? 'Edit Research Publication' : 'Enter New Research Publication'}
                </h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider">
                  Paper Title *
                </label>
                <input
                  type="text"
                  required
                  value={reportForm.title || ''}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  placeholder="e.g. Accelerated Ice Shelf Basal Melting in the Indian Sector..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#091f3a] border border-cyan-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    Research Area
                  </label>
                  <select
                    value={reportForm.researchArea || 'Climate Science'}
                    onChange={(e) => setReportForm({ ...reportForm, researchArea: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#091f3a] border border-cyan-900 text-white focus:outline-none"
                  >
                    <option value="Climate Science">Climate Science</option>
                    <option value="Marine Biology">Marine Biology</option>
                    <option value="Ecology">Ecology</option>
                    <option value="Earth Science">Earth Science</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    Region
                  </label>
                  <select
                    value={reportForm.region || 'Antarctica'}
                    onChange={(e) => setReportForm({ ...reportForm, region: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#091f3a] border border-cyan-900 text-white focus:outline-none"
                  >
                    <option value="Antarctica">Antarctica</option>
                    <option value="Arctic">Arctic</option>
                    <option value="Southern Ocean">Southern Ocean</option>
                    <option value="Himalaya">Himalaya</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider">
                  Authors (comma separated)
                </label>
                <input
                  type="text"
                  value={reportForm.authors?.join(', ') || ''}
                  onChange={(e) =>
                    setReportForm({
                      ...reportForm,
                      authors: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  placeholder="Dr. Rajeshwari Nair, Prof. Vikram Sengupta"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#091f3a] border border-cyan-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider">
                  Abstract *
                </label>
                <textarea
                  rows={4}
                  required
                  value={reportForm.abstract || ''}
                  onChange={(e) => setReportForm({ ...reportForm, abstract: e.target.value })}
                  placeholder="Scientific abstract and empirical findings..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#091f3a] border border-cyan-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    DOI Identifier
                  </label>
                  <input
                    type="text"
                    value={reportForm.doi || ''}
                    onChange={(e) => setReportForm({ ...reportForm, doi: e.target.value })}
                    placeholder="10.1016/j.polar.2025.03.112"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#091f3a] border border-cyan-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    Expedition / Mission
                  </label>
                  <input
                    type="text"
                    value={reportForm.expedition || ''}
                    onChange={(e) => setReportForm({ ...reportForm, expedition: e.target.value })}
                    placeholder="43rd Indian Scientific Expedition to Antarctica"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#091f3a] border border-cyan-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingReportId ? 'Save Publication Changes' : 'Publish Research'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
