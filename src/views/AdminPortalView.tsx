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
  Camera,
  Compass,
  Lightbulb,
  Flag,
  UserCheck,
  Users,
  Eye,
  EyeOff,
  Radio,
  Cpu,
  Check,
} from 'lucide-react';
import {
  ViewMode,
  Dataset,
  ResearchReport,
  Expedition,
  ExpeditionMedia,
  PolarFact,
  UserReportTicket,
  CyberWarningLog,
} from '../types';
import { polarDataService } from '../services/dataService';
import { authService, UserAccount } from '../services/authService';
import { aiVerificationService } from '../services/aiVerificationService';
import { TopLeftBackButton } from '../components/TopLeftBackButton';
import { AIVerificationCard } from '../components/AIVerificationCard';

interface AdminPortalViewProps {
  onNavigate: (view: ViewMode, id?: string) => void;
}

type AdminTab =
  | 'overview'
  | 'datasets'
  | 'reports'
  | 'expeditions'
  | 'media'
  | 'facts'
  | 'moderation'
  | 'cyber'
  | 'users';

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({ onNavigate }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    polarDataService.isAdminAuthenticated()
  );
  const [inputKey, setInputKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Management Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Live Data State
  const [datasets, setDatasets] = useState<Dataset[]>(polarDataService.getDatasets());
  const [reports, setReports] = useState<ResearchReport[]>(polarDataService.getReports());
  const [expeditions, setExpeditions] = useState<Expedition[]>(polarDataService.getExpeditions());
  const [mediaItems, setMediaItems] = useState<ExpeditionMedia[]>(polarDataService.getMedia());
  const [facts, setFacts] = useState<PolarFact[]>(polarDataService.getFacts());
  const [userReports, setUserReports] = useState<UserReportTicket[]>(polarDataService.getUserReports());
  const [cyberLogs, setCyberLogs] = useState<CyberWarningLog[]>(polarDataService.getCyberLogs());
  const [users, setUsers] = useState<UserAccount[]>(authService.getAllRegisteredUsers());

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronize with polarDataService
  useEffect(() => {
    const unsubData = polarDataService.subscribe(() => {
      setDatasets(polarDataService.getDatasets());
      setReports(polarDataService.getReports());
      setExpeditions(polarDataService.getExpeditions());
      setMediaItems(polarDataService.getMedia());
      setFacts(polarDataService.getFacts());
      setUserReports(polarDataService.getUserReports());
      setCyberLogs(polarDataService.getCyberLogs());
      setIsAuthenticated(polarDataService.isAdminAuthenticated());
    });
    const unsubAuth = authService.subscribe(() => {
      setUsers(authService.getAllRegisteredUsers());
    });
    return () => {
      unsubData();
      unsubAuth();
    };
  }, []);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (polarDataService.loginAdmin(inputKey)) {
      setIsAuthenticated(true);
      setAuthError(null);
      showToast('Authenticated as NCPOR Senior Polar Data Administrator.');
    } else {
      setAuthError('Access Denied: Invalid Security Key. Incident flagged to NCPOR Cyber Division.');
    }
  };

  const handleLogout = () => {
    polarDataService.logoutAdmin();
    setIsAuthenticated(false);
    setInputKey('');
  };

  // =========================================================================
  // MODAL STATES FOR ENTITY CRUD
  // =========================================================================

  // 1. DATASET MODAL
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);
  const [editingDatasetId, setEditingDatasetId] = useState<string | null>(null);
  const [datasetForm, setDatasetForm] = useState<Partial<Dataset>>({
    title: '',
    description: '',
    parameter: '',
    timeframe: '',
    location: '',
    coordinates: '',
    samplesCount: 15000,
    fileSize: '32 MB',
    format: 'CSV / NetCDF-4',
    institution: 'National Centre for Polar and Ocean Research (NCPOR)',
    doi: '10.5281/zenodo.',
    dataPoints: [
      { label: '2020', value: 10, unit: '' },
      { label: '2022', value: 16, unit: '' },
      { label: '2024', value: 24, unit: '' },
    ],
  });

  // 2. REPORT MODAL
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [reportForm, setReportForm] = useState<Partial<ResearchReport>>({
    title: '',
    abstract: '',
    authors: ['Dr. Polar Researcher', 'NCPOR Science Division'],
    institution: 'National Centre for Polar and Ocean Research (NCPOR)',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    researchArea: 'Climate Science',
    region: 'Antarctica',
    expedition: '44th Indian Scientific Expedition to Antarctica',
    doi: '10.1016/j.polar.2026.01.001',
    imageUrl: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min read',
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
        evidence: 'Field ground truth sensor readings.',
        source: 'NCPOR Grounding Archive',
        type: 'Sensor Array',
      },
    ],
  });

  // 3. EXPEDITION MODAL
  const [isExpeditionModalOpen, setIsExpeditionModalOpen] = useState(false);
  const [editingExpeditionId, setEditingExpeditionId] = useState<string | null>(null);
  const [expeditionForm, setExpeditionForm] = useState<Partial<Expedition>>({
    number: 44,
    title: '44th Indian Scientific Expedition to Antarctica (ISEA)',
    season: '2024–2025',
    vessel: 'MV Vasiliy Golovnin',
    leader: 'Dr. Alok Kumar (NCPOR)',
    objectives: ['Glaciological balance in Dronning Maud Land', 'Atmospheric boundary layer profiling'],
    keyFindings: ['Completed winter maintenance at Maitri and Bharati stations.'],
    status: 'COMPLETED',
  });

  // 4. MEDIA MODAL
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [mediaForm, setMediaForm] = useState<Partial<ExpeditionMedia>>({
    title: '',
    caption: '',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1200&q=80',
    location: 'Maitri Station, Schirmacher Oasis',
    year: '2026',
    credit: 'NCPOR Media Cell',
  });

  // 5. FACT MODAL
  const [isFactModalOpen, setIsFactModalOpen] = useState(false);
  const [editingFactId, setEditingFactId] = useState<string | null>(null);
  const [factForm, setFactForm] = useState<Partial<PolarFact>>({
    statement: '',
    isFact: true,
    explanation: '',
    category: 'Climate',
    verifiedSource: 'NCPOR & Intergovernmental Panel on Climate Change (IPCC)',
  });

  // =========================================================================
  // CRUD HANDLERS
  // =========================================================================

  // Dataset Save
  const handleSaveDataset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!datasetForm.title || !datasetForm.parameter) return;
    if (editingDatasetId) {
      polarDataService.updateDataset(editingDatasetId, datasetForm);
      showToast(`Dataset "${datasetForm.title}" successfully updated.`);
    } else {
      polarDataService.addDataset(datasetForm as Dataset);
      showToast(`New Dataset "${datasetForm.title}" published to live repository.`);
    }
    setIsDatasetModalOpen(false);
    setEditingDatasetId(null);
  };

  // Report Save
  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.title || !reportForm.abstract) return;

    // Run AI Cross Verification
    const aiAudit = aiVerificationService.crossVerify(
      reportForm.title,
      reportForm.abstract,
      reportForm.researchArea
    );

    const updatedData = {
      ...reportForm,
      aiSummary: {
        overview: reportForm.aiSummary?.overview || reportForm.abstract?.slice(0, 160) + '...',
        whyItMatters: reportForm.aiSummary?.whyItMatters || 'Crucial for cryospheric baseline modeling.',
        keyFindings: reportForm.aiSummary?.keyFindings || [reportForm.title || ''],
        whatRemainsUncertain: reportForm.aiSummary?.whatRemainsUncertain || 'Extended multidecadal tracking required.',
      },
    };

    if (editingReportId) {
      polarDataService.updateReport(editingReportId, updatedData);
      showToast(`Research report updated with multi-model AI audit: ${aiAudit.batchStatus}.`);
    } else {
      polarDataService.addReport(updatedData as ResearchReport);
      showToast(`New Research Paper published with AI Consensus: ${aiAudit.batchStatus}.`);
    }
    setIsReportModalOpen(false);
    setEditingReportId(null);
  };

  // Expedition Save
  const handleSaveExpedition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expeditionForm.title || !expeditionForm.leader) return;
    if (editingExpeditionId) {
      polarDataService.updateExpedition(editingExpeditionId, expeditionForm);
      showToast(`Expedition "${expeditionForm.title}" updated.`);
    } else {
      polarDataService.addExpedition(expeditionForm as Expedition);
      showToast(`Expedition "${expeditionForm.title}" added to active polar registry.`);
    }
    setIsExpeditionModalOpen(false);
    setEditingExpeditionId(null);
  };

  // Media Save
  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaForm.title || !mediaForm.url) return;
    if (editingMediaId) {
      polarDataService.updateMedia(editingMediaId, mediaForm);
      showToast(`Media item "${mediaForm.title}" updated.`);
    } else {
      polarDataService.addMedia(mediaForm as ExpeditionMedia);
      showToast(`Media visual "${mediaForm.title}" added to live public gallery.`);
    }
    setIsMediaModalOpen(false);
    setEditingMediaId(null);
  };

  // Fact Save
  const handleSaveFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!factForm.statement || !factForm.explanation) return;
    if (editingFactId) {
      polarDataService.updateFact(editingFactId, factForm);
      showToast(`Polar fact/myth updated.`);
    } else {
      polarDataService.addFact(factForm as PolarFact);
      showToast(`New polar fact/myth published.`);
    }
    setIsFactModalOpen(false);
    setEditingFactId(null);
  };

  // Moderation Resolution
  const handleResolveReport = (
    reportId: string,
    action: 'MARK_SAFE' | 'REMOVE_CONTENT' | 'WARNING_ISSUED'
  ) => {
    polarDataService.resolveUserReport(reportId, action);
    showToast(`Moderation ticket ${reportId} resolved with action: ${action}.`);
  };

  // =========================================================================
  // VIEW 1: SECURE AUTHENTICATION SCREEN (IF NOT LOGGED IN)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030b17] text-white pt-24 pb-20 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <TopLeftBackButton onBack={() => onNavigate('home')} currentView="admin" targetLabel="Home" />

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-cyan-950/90 border-2 border-cyan-500/60 shadow-xl shadow-cyan-950/60 text-cyan-400">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-white">
              NCPOR Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Secure Zero-Trust Editorial Gateway. Full CRUD database management, AI moderation queue, and cybersecurity monitoring.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#081528] border border-cyan-900/80 shadow-2xl space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Enter Master Security Key</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Encrypted</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={inputKey}
                    onChange={(e) => {
                      setInputKey(e.target.value);
                      setAuthError(null);
                    }}
                    placeholder="Enter confidential administrator key"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#040e1c] border border-cyan-900/80 focus:border-cyan-400 text-white placeholder-slate-500 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#040e1c] border border-cyan-950/80 flex items-start gap-2 text-[11px] text-slate-400">
                <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p>
                  Keys are restricted to verified NCPOR Data Officers. All authentication sessions are logged. (Authorized default test keys include <code>POLAR#SECURE-ADMIN@2026</code> or <code>admin</code>).
                </p>
              </div>

              <button
                type="submit"
                id="authenticate-admin-btn"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Credentials & Enter Console</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED ADMIN CONSOLE
  // =========================================================================
  return (
    <div id="admin-portal-view" className="min-h-screen bg-[#030b17] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1720px] mx-auto space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-2xl bg-cyan-950 border border-cyan-400 text-cyan-200 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Left Back Button */}
        <TopLeftBackButton onBack={() => onNavigate('home')} currentView="admin" targetLabel="Home" />

        {/* Console Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-[#081528] border border-cyan-500/30 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500">
                  Full CRUD Live
                </span>
                <span className="text-xs font-mono text-cyan-400">NCPOR Central Command</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white mt-1">
                Polar Scientific Editorial & Database Administration
              </h1>
            </div>
          </div>

          {/* Quick Actions & Logout */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setEditingReportId(null);
                setIsReportModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/60 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Research Paper</span>
            </button>
            <button
              onClick={() => {
                setEditingDatasetId(null);
                setIsDatasetModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Dataset</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/60 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-cyan-950">
          {[
            { id: 'overview', label: 'System Telemetry', icon: Cpu, count: undefined },
            { id: 'datasets', label: 'Datasets (CRUD)', icon: Database, count: datasets.length },
            { id: 'reports', label: 'Research Papers (CRUD)', icon: FileText, count: reports.length },
            { id: 'expeditions', label: 'Polar Expeditions', icon: Compass, count: expeditions.length },
            { id: 'media', label: 'Media & Visuals', icon: Camera, count: mediaItems.length },
            { id: 'facts', label: 'Facts & Myths', icon: Lightbulb, count: facts.length },
            {
              id: 'moderation',
              label: 'AI Moderation Queue',
              icon: Flag,
              count: userReports.filter((r) => r.status === 'PENDING_REVIEW').length,
            },
            { id: 'cyber', label: 'Cybersecurity Logs', icon: ShieldAlert, count: cyberLogs.length },
            { id: 'users', label: 'User Passports', icon: Users, count: users.length },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as AdminTab)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                    : 'bg-[#081528] text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
                {t.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      isActive ? 'bg-slate-950 text-cyan-300' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* TAB: OVERVIEW / TELEMETRY */}
        {/* ================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#081528] border border-cyan-950 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Live Datasets</span>
                <span className="text-2xl font-bold font-mono text-cyan-300">{datasets.length}</span>
                <span className="text-[10px] text-emerald-400 block">Verified NCPOR Repos</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#081528] border border-cyan-950 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Research Papers</span>
                <span className="text-2xl font-bold font-mono text-purple-300">{reports.length}</span>
                <span className="text-[10px] text-purple-400 block">Multi-Model AI Audited</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#081528] border border-cyan-950 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Flagged Reports</span>
                <span className="text-2xl font-bold font-mono text-amber-300">{userReports.length}</span>
                <span className="text-[10px] text-amber-400 block">
                  {userReports.filter((r) => r.status === 'PENDING_REVIEW').length} Pending AI Review
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#081528] border border-cyan-950 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Cyber Incidents Blocked</span>
                <span className="text-2xl font-bold font-mono text-rose-300">{cyberLogs.length}</span>
                <span className="text-[10px] text-rose-400 block">Zero-Tolerance Active</span>
              </div>
            </div>

            {/* AI Cross-Verification Consensus Info Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#07162b] to-[#041021] border border-cyan-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-400/60 flex items-center justify-center text-cyan-300">
                  <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    Multi-Model AI Consensus Engine (Gemini, Claude, GPT-4o, DeepSeek)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Every community field observation, media upload, and research paper is cross-audited across 4 global models against empirical NCPOR & Antarctic Treaty baseline physics.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#030c18] border border-cyan-900/60 space-y-1">
                  <span className="text-xs font-bold text-cyan-300 block">Google Gemini 2.5 Flash</span>
                  <span className="text-[11px] text-slate-400 block">
                    CryoGrounding check against IMD & NCPOR telemetry series.
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#030c18] border border-cyan-900/60 space-y-1">
                  <span className="text-xs font-bold text-amber-300 block">Anthropic Claude 3.5 Sonnet</span>
                  <span className="text-[11px] text-slate-400 block">
                    Methodological rigor & peer-review anomaly detection.
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#030c18] border border-cyan-900/60 space-y-1">
                  <span className="text-xs font-bold text-purple-300 block">OpenAI GPT-4o</span>
                  <span className="text-[11px] text-slate-400 block">
                    Polar literature citation lookup & taxonomic consistency.
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#030c18] border border-cyan-900/60 space-y-1">
                  <span className="text-xs font-bold text-emerald-300 block">DeepSeek Reasoner</span>
                  <span className="text-[11px] text-slate-400 block">
                    Thermodynamic bounds & glaciological physics calculation.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: DATASETS CRUD */}
        {/* ================================================================= */}
        {activeTab === 'datasets' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search datasets by title or parameter..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#081528] border border-cyan-950 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                onClick={() => {
                  setEditingDatasetId(null);
                  setDatasetForm({
                    title: '',
                    description: '',
                    parameter: '',
                    timeframe: '',
                    location: '',
                    coordinates: '',
                    samplesCount: 12000,
                    fileSize: '18 MB',
                    format: 'CSV / NetCDF-4',
                    institution: 'National Centre for Polar and Ocean Research (NCPOR)',
                    doi: '10.5281/zenodo.',
                    dataPoints: [
                      { label: '2020', value: 12, unit: '' },
                      { label: '2022', value: 18, unit: '' },
                      { label: '2024', value: 25, unit: '' },
                    ],
                  });
                  setIsDatasetModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dataset</span>
              </button>
            </div>

            <div className="rounded-2xl bg-[#081528] border border-cyan-950 overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-cyan-950 bg-[#040e1c] text-slate-400">
                    <th className="p-3.5 font-semibold">Title & Parameter</th>
                    <th className="p-3.5 font-semibold">Location / Station</th>
                    <th className="p-3.5 font-semibold">Timeframe</th>
                    <th className="p-3.5 font-semibold">Format & Size</th>
                    <th className="p-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-950/60">
                  {datasets
                    .filter((d) => d.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((d) => (
                      <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{d.title}</div>
                          <div className="text-[11px] text-cyan-400">{d.parameter}</div>
                        </td>
                        <td className="p-3.5 text-slate-300">{d.location}</td>
                        <td className="p-3.5 text-slate-400 font-mono text-[11px]">{d.timeframe}</td>
                        <td className="p-3.5 text-slate-300 font-mono text-[11px]">
                          {d.format} ({d.fileSize})
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingDatasetId(d.id);
                              setDatasetForm(d);
                              setIsDatasetModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-950/60 transition-colors"
                            title="Edit Dataset"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete dataset "${d.title}"?`)) {
                                polarDataService.deleteDataset(d.id);
                                showToast(`Dataset "${d.title}" removed.`);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 transition-colors"
                            title="Delete Dataset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: RESEARCH PAPERS CRUD */}
        {/* ================================================================= */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search research papers..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#081528] border border-cyan-950 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                onClick={() => {
                  setEditingReportId(null);
                  setReportForm({
                    title: '',
                    abstract: '',
                    authors: ['NCPOR Research Fellow', 'Expedition Team'],
                    institution: 'National Centre for Polar and Ocean Research (NCPOR)',
                    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                    researchArea: 'Glaciology',
                    region: 'Antarctica',
                    expedition: '44th Indian Scientific Expedition to Antarctica',
                    doi: '10.1016/j.polar.2026.01.002',
                    imageUrl: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=800&q=80',
                    readTime: '5 min read',
                    footerLinkType: 'expedition',
                    footerLinkLabel: 'Expedition →',
                  });
                  setIsReportModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Research Paper</span>
              </button>
            </div>

            <div className="rounded-2xl bg-[#081528] border border-cyan-950 overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-cyan-950 bg-[#040e1c] text-slate-400">
                    <th className="p-3.5 font-semibold">Title & Authors</th>
                    <th className="p-3.5 font-semibold">Discipline & Region</th>
                    <th className="p-3.5 font-semibold">Live Metrics</th>
                    <th className="p-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-950/60">
                  {reports
                    .filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((r) => (
                      <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5 max-w-md">
                          <div className="font-bold text-white line-clamp-1">{r.title}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            {r.authors.join(', ')} • {r.date}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                            {r.researchArea}
                          </span>
                          <span className="text-slate-400 text-[11px] ml-2">{r.region}</span>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-300">
                          {r.views || '0'} views • {r.comments || 0} comments
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingReportId(r.id);
                              setReportForm(r);
                              setIsReportModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-950/60 transition-colors"
                            title="Edit Research Report"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete research report "${r.title}"?`)) {
                                polarDataService.deleteReport(r.id);
                                showToast(`Research report removed.`);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 transition-colors"
                            title="Delete Report"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: POLAR EXPEDITIONS CRUD */}
        {/* ================================================================= */}
        {activeTab === 'expeditions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Indian Antarctic & Arctic Expeditions
              </h3>
              <button
                onClick={() => {
                  setEditingExpeditionId(null);
                  setExpeditionForm({
                    number: expeditions.length + 1,
                    title: `${expeditions.length + 1}th Indian Scientific Expedition to Antarctica`,
                    season: '2025–2026',
                    vessel: 'Icebreaker Research Vessel',
                    leader: 'Dr. Senior Scientist (NCPOR)',
                    objectives: ['Southern Ocean CTD profiling', 'Ice-core drilling at Maitri'],
                    keyFindings: ['Operational telemetry active.'],
                    status: 'ACTIVE',
                  });
                  setIsExpeditionModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Expedition</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expeditions.map((exp) => (
                <div
                  key={exp.id}
                  className="p-5 rounded-2xl bg-[#081528] border border-cyan-950 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                        Expedition #{exp.number}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          exp.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {exp.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-1">{exp.title}</h4>
                    <p className="text-xs text-slate-400">
                      <strong>Leader:</strong> {exp.leader} • <strong>Season:</strong> {exp.season}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      <strong>Vessel:</strong> {exp.vessel}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-cyan-950 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {exp.objectives?.length || 0} Objectives
                    </span>
                    <div className="space-x-1">
                      <button
                        onClick={() => {
                          setEditingExpeditionId(exp.id);
                          setExpeditionForm(exp);
                          setIsExpeditionModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-950/60"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete expedition "${exp.title}"?`)) {
                            polarDataService.deleteExpedition(exp.id);
                            showToast(`Expedition removed.`);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: MEDIA & VISUALS CRUD */}
        {/* ================================================================= */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Expedition Media Gallery & Visuals
              </h3>
              <button
                onClick={() => {
                  setEditingMediaId(null);
                  setMediaForm({
                    title: '',
                    caption: '',
                    type: 'photo',
                    url: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1200&q=80',
                    location: 'Maitri Station, Schirmacher Oasis',
                    year: '2026',
                    credit: 'NCPOR Editorial Field Archive',
                  });
                  setIsMediaModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Media Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaItems.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl bg-[#081528] border border-cyan-950 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-40 bg-slate-900 overflow-hidden">
                    <img
                      src={m.url}
                      alt={m.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-950/80 text-cyan-300 border border-cyan-900">
                      {m.type}
                    </span>
                  </div>
                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{m.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{m.caption}</p>
                    </div>
                    <div className="pt-2 border-t border-cyan-950 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{m.location}</span>
                      <div className="space-x-1">
                        <button
                          onClick={() => {
                            setEditingMediaId(m.id);
                            setMediaForm(m);
                            setIsMediaModalOpen(true);
                          }}
                          className="p-1 rounded text-cyan-400 hover:bg-cyan-950"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete media "${m.title}"?`)) {
                              polarDataService.deleteMedia(m.id);
                              showToast(`Media visual deleted.`);
                            }
                          }}
                          className="p-1 rounded text-rose-400 hover:bg-rose-950"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: POLAR FACTS & MYTHS CRUD */}
        {/* ================================================================= */}
        {activeTab === 'facts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Debunked Polar Myths & Facts
              </h3>
              <button
                onClick={() => {
                  setEditingFactId(null);
                  setFactForm({
                    statement: '',
                    isFact: false,
                    explanation: '',
                    category: 'Wildlife',
                    verifiedSource: 'NCPOR Wildlife Biology',
                  });
                  setIsFactModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Fact or Myth</span>
              </button>
            </div>

            <div className="space-y-3">
              {facts.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-2xl bg-[#081528] border border-cyan-950 flex flex-col sm:flex-row items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.isFact
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : 'bg-rose-950 text-rose-300 border border-rose-700'
                        }`}
                      >
                        {f.isFact ? 'FACT' : 'MYTH DEBUNKED'}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400">{f.category}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">"{f.statement}"</h4>
                    <p className="text-xs text-slate-300 max-w-3xl">{f.explanation}</p>
                    <div className="text-[10px] text-slate-500 font-mono">Source: {f.verifiedSource}</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingFactId(f.id);
                        setFactForm(f);
                        setIsFactModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-950"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${f.statement}"?`)) {
                          polarDataService.deleteFact(f.id);
                          showToast(`Item removed.`);
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: USER REPORTS & AI MODERATION QUEUE */}
        {/* ================================================================= */}
        {activeTab === 'moderation' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                User Reports & AI Moderation Queue
              </h3>
              <p className="text-xs text-slate-400">
                Whenever users report unusual activity or fabricated data, multi-model AI (Gemini, Claude, GPT-4o, DeepSeek) audits the claim and generates a verdict for admin decision.
              </p>
            </div>

            {userReports.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#081528] border border-cyan-950 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Moderation Queue Clean</h4>
                <p className="text-xs text-slate-400">
                  No active reports or flagged violations. The platform is operating securely.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-5 rounded-2xl bg-[#081528] border border-cyan-950 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-950 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600">
                            {rep.reason}
                          </span>
                          <span className="text-xs font-mono text-cyan-400">{rep.timestamp}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">
                          Target: "{rep.targetTitle}" ({rep.targetType})
                        </h4>
                        <p className="text-xs text-slate-400">
                          Reported by user <strong className="text-white font-mono">{rep.reportedByUsername}</strong>: "{rep.details}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            rep.status === 'PENDING_REVIEW'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-500'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </div>
                    </div>

                    {/* AI Consensus Card */}
                    {rep.aiAudit && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Multi-Model AI Cross-Audit:
                        </span>
                        <AIVerificationCard summary={rep.aiAudit} compact />
                      </div>
                    )}

                    {/* Admin Actions */}
                    {rep.status === 'PENDING_REVIEW' && (
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          onClick={() => handleResolveReport(rep.id, 'MARK_SAFE')}
                          className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600 text-xs font-bold cursor-pointer"
                        >
                          Mark Verified & Safe
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep.id, 'REMOVE_CONTENT')}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950 cursor-pointer"
                        >
                          Remove Content from Platform
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: CYBERSECURITY LOGS */}
        {/* ================================================================= */}
        {activeTab === 'cyber' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Cybersecurity Incident & Abuse Filter Logs
                </h3>
                <p className="text-xs text-slate-400">
                  Any uploads containing prohibited terms, abusive phrases, XSS, or SQL injection are automatically discarded and logged here.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-600">
                {cyberLogs.length} Blocked Incidents
              </span>
            </div>

            {cyberLogs.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#081528] border border-cyan-950">
                <ShieldCheck className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">No Malicious Incidents Detected</h4>
                <p className="text-xs text-slate-400">Cyber scanners are active and monitoring all submission payloads.</p>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#081528] border border-cyan-950 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-cyan-950 bg-[#040e1c] text-slate-400">
                      <th className="p-3 font-semibold">User & Timestamp</th>
                      <th className="p-3 font-semibold">Violation Reason</th>
                      <th className="p-3 font-semibold">Severity</th>
                      <th className="p-3 font-semibold">Blocked Payload Snippet</th>
                      <th className="p-3 font-semibold">Action Taken</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-950/60">
                    {cyberLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30">
                        <td className="p-3">
                          <div className="font-mono text-cyan-300 font-bold">{log.username}</div>
                          <div className="text-[10px] text-slate-500">{log.timestamp}</div>
                        </td>
                        <td className="p-3 text-slate-300 font-semibold">{log.reason}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.severity === 'CRITICAL'
                                ? 'bg-rose-950 text-rose-300 border border-rose-500'
                                : 'bg-amber-950 text-amber-300 border border-amber-500'
                            }`}
                          >
                            {log.severity}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-rose-300/90 max-w-xs truncate">
                          {log.blockedTextSnippet}
                        </td>
                        <td className="p-3 text-emerald-400 font-semibold">{log.actionTaken}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: REGISTERED USER PASSPORTS */}
        {/* ================================================================= */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Registered Polar Passports & User Profiles
                </h3>
                <p className="text-xs text-slate-400">
                  Accounts created with special username keys, roles (student/teacher/researcher), and interest tags.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                {users.length} Registered Passports
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="p-5 rounded-2xl bg-[#081528] border border-cyan-950 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full border border-cyan-500/40 object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{u.name}</h4>
                      <span className="text-xs font-mono text-cyan-400 block">{u.username}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300">
                    <div>
                      <strong className="text-slate-400">Role:</strong> {u.role}
                    </div>
                    <div>
                      <strong className="text-slate-400">Purpose:</strong> {u.purpose}
                    </div>
                    <div>
                      <strong className="text-slate-400">Joined:</strong> {u.joinedDate}
                    </div>
                  </div>

                  {u.interests && u.interests.length > 0 && (
                    <div className="pt-2 border-t border-cyan-950 flex flex-wrap gap-1">
                      {u.interests.map((it, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-[#040e1c] text-cyan-300 border border-cyan-900">
                          {it}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-cyan-950 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{u.savedItems?.length || 0} Saved Items</span>
                    <span
                      className={`font-bold ${
                        u.securityStrikes > 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {u.securityStrikes} Security Strikes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL: DATASET ADD / EDIT */}
        {/* ================================================================= */}
        {isDatasetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#081528] border border-cyan-500/40 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  {editingDatasetId ? 'Edit Dataset' : 'Publish New Scientific Dataset'}
                </h3>
                <button
                  onClick={() => setIsDatasetModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDataset} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Dataset Title *</label>
                  <input
                    type="text"
                    required
                    value={datasetForm.title || ''}
                    onChange={(e) => setDatasetForm({ ...datasetForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Parameter *</label>
                    <input
                      type="text"
                      required
                      value={datasetForm.parameter || ''}
                      onChange={(e) => setDatasetForm({ ...datasetForm, parameter: e.target.value })}
                      placeholder="e.g. Surface Temperature, Sea Ice Extent"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      value={datasetForm.location || ''}
                      onChange={(e) => setDatasetForm({ ...datasetForm, location: e.target.value })}
                      placeholder="e.g. Maitri Station, East Antarctica"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={datasetForm.description || ''}
                    onChange={(e) => setDatasetForm({ ...datasetForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Timeframe</label>
                    <input
                      type="text"
                      value={datasetForm.timeframe || ''}
                      onChange={(e) => setDatasetForm({ ...datasetForm, timeframe: e.target.value })}
                      placeholder="1990–2025"
                      className="w-full px-3 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Format</label>
                    <input
                      type="text"
                      value={datasetForm.format || ''}
                      onChange={(e) => setDatasetForm({ ...datasetForm, format: e.target.value })}
                      placeholder="CSV / NetCDF-4"
                      className="w-full px-3 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">File Size</label>
                    <input
                      type="text"
                      value={datasetForm.fileSize || ''}
                      onChange={(e) => setDatasetForm({ ...datasetForm, fileSize: e.target.value })}
                      placeholder="25 MB"
                      className="w-full px-3 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-cyan-950">
                  <button
                    type="button"
                    onClick={() => setIsDatasetModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                  >
                    Save Dataset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL: REPORT ADD / EDIT */}
        {/* ================================================================= */}
        {isReportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#081528] border border-cyan-500/40 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  {editingReportId ? 'Edit Research Paper' : 'Publish Research Paper'}
                </h3>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveReport} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Paper Title *</label>
                  <input
                    type="text"
                    required
                    value={reportForm.title || ''}
                    onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Research Area</label>
                    <input
                      type="text"
                      value={reportForm.researchArea || ''}
                      onChange={(e) => setReportForm({ ...reportForm, researchArea: e.target.value })}
                      placeholder="e.g. Climate Science, Glaciology"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Region</label>
                    <input
                      type="text"
                      value={reportForm.region || ''}
                      onChange={(e) => setReportForm({ ...reportForm, region: e.target.value })}
                      placeholder="Antarctica / Arctic"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Abstract *</label>
                  <textarea
                    rows={4}
                    required
                    value={reportForm.abstract || ''}
                    onChange={(e) => setReportForm({ ...reportForm, abstract: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Hero Image URL</label>
                  <input
                    type="url"
                    value={reportForm.imageUrl || ''}
                    onChange={(e) => setReportForm({ ...reportForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                  />
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Saving will automatically execute multi-model AI consensus verification.</span>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-cyan-950">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    Save & AI Cross-Audit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL: EXPEDITION ADD / EDIT */}
        {/* ================================================================= */}
        {isExpeditionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg rounded-3xl bg-[#081528] border border-cyan-500/40 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  {editingExpeditionId ? 'Edit Expedition' : 'Register Polar Expedition'}
                </h3>
                <button
                  onClick={() => setIsExpeditionModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveExpedition} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Expedition Title *</label>
                  <input
                    type="text"
                    required
                    value={expeditionForm.title || ''}
                    onChange={(e) => setExpeditionForm({ ...expeditionForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Expedition Number</label>
                    <input
                      type="number"
                      value={expeditionForm.number || 44}
                      onChange={(e) => setExpeditionForm({ ...expeditionForm, number: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Season</label>
                    <input
                      type="text"
                      value={expeditionForm.season || ''}
                      onChange={(e) => setExpeditionForm({ ...expeditionForm, season: e.target.value })}
                      placeholder="2024–2025"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Leader *</label>
                    <input
                      type="text"
                      required
                      value={expeditionForm.leader || ''}
                      onChange={(e) => setExpeditionForm({ ...expeditionForm, leader: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Vessel</label>
                    <input
                      type="text"
                      value={expeditionForm.vessel || ''}
                      onChange={(e) => setExpeditionForm({ ...expeditionForm, vessel: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-cyan-950">
                  <button
                    type="button"
                    onClick={() => setIsExpeditionModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                  >
                    Save Expedition
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL: MEDIA ADD / EDIT */}
        {/* ================================================================= */}
        {isMediaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-md rounded-3xl bg-[#081528] border border-cyan-500/40 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  {editingMediaId ? 'Edit Media Visual' : 'Upload Media Visual'}
                </h3>
                <button
                  onClick={() => setIsMediaModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMedia} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={mediaForm.title || ''}
                    onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Image / Video URL *</label>
                  <input
                    type="url"
                    required
                    value={mediaForm.url || ''}
                    onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Caption</label>
                  <textarea
                    rows={2}
                    value={mediaForm.caption || ''}
                    onChange={(e) => setMediaForm({ ...mediaForm, caption: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Location</label>
                    <input
                      type="text"
                      value={mediaForm.location || ''}
                      onChange={(e) => setMediaForm({ ...mediaForm, location: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Credit</label>
                    <input
                      type="text"
                      value={mediaForm.credit || ''}
                      onChange={(e) => setMediaForm({ ...mediaForm, credit: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-cyan-950">
                  <button
                    type="button"
                    onClick={() => setIsMediaModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                  >
                    Save Media
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL: FACT ADD / EDIT */}
        {/* ================================================================= */}
        {isFactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-md rounded-3xl bg-[#081528] border border-cyan-500/40 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  {editingFactId ? 'Edit Fact / Myth' : 'Add Polar Fact / Myth'}
                </h3>
                <button
                  onClick={() => setIsFactModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveFact} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Statement *</label>
                  <input
                    type="text"
                    required
                    value={factForm.statement || ''}
                    onChange={(e) => setFactForm({ ...factForm, statement: e.target.value })}
                    placeholder="e.g. Polar bears live in Antarctica."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold text-slate-300">Is this a Fact?</label>
                  <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={factForm.isFact === true}
                        onChange={() => setFactForm({ ...factForm, isFact: true })}
                      />
                      <span>Fact</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={factForm.isFact === false}
                        onChange={() => setFactForm({ ...factForm, isFact: false })}
                      />
                      <span>Myth (To Debunk)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Scientific Explanation *</label>
                  <textarea
                    rows={3}
                    required
                    value={factForm.explanation || ''}
                    onChange={(e) => setFactForm({ ...factForm, explanation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                    <input
                      type="text"
                      value={factForm.category || 'Climate'}
                      onChange={(e) => setFactForm({ ...factForm, category: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Verified Source</label>
                    <input
                      type="text"
                      value={factForm.verifiedSource || ''}
                      onChange={(e) => setFactForm({ ...factForm, verifiedSource: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#040e1c] border border-cyan-900 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-cyan-950">
                  <button
                    type="button"
                    onClick={() => setIsFactModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                  >
                    Save Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
