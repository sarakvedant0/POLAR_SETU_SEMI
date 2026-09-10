export type ViewMode =
  | 'home'
  | 'explore'
  | 'reports'
  | 'report-detail'
  | 'expeditions'
  | 'expedition-detail'
  | 'datasets'
  | 'dataset-detail'
  | 'claims'
  | 'claim-detail'
  | 'facts'
  | 'voices'
  | 'voices-create'
  | 'learning'
  | 'learning-detail'
  | 'quiz'
  | 'ai'
  | 'database'
  | 'research'
  | 'research-detail'
  | 'timeline'
  | 'game'
  | 'scientists'
  | 'media'
  | 'profile'
  | 'feed'
  | 'saved'
  | 'admin';

export type ClaimStatus = 'VERIFIED' | 'PARTIALLY_SUPPORTED' | 'UNVERIFIED' | 'CONTRADICTED';

export interface ScientificNode {
  id: string;
  type: 'research' | 'station' | 'dataset' | 'expedition' | 'ai' | 'media' | 'evidence' | 'learning';
  label: string;
  subtitle?: string;
  position: [number, number, number]; // 3D coordinates
  screenPos?: { x: number; y: number }; // Relative screen placement for 2D/3D pinning
  route: ViewMode;
  targetId?: string;
  description: string;
  category: string;
  connectedTo: string[];
}

export interface ResearchReport {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  institution: string;
  date: string;
  views?: string | number;
  comments?: number;
  citations?: number;
  expedition: string;
  researchArea: 'Climate Science' | 'Marine Biology' | 'Ecology' | 'Earth Science' | 'Atmospheric Physics' | 'Glaciology' | string;
  region: 'Antarctica' | 'Arctic' | 'Southern Ocean' | 'Himalaya (Third Pole)' | string;
  imageUrl: string;
  readTime: string;
  doi: string;
  footerLinkType: 'expedition' | 'station' | 'dataset';
  footerLinkLabel: string;
  publicationDate?: string;
  journal?: string;
  affiliation?: string;
  aiVerification?: AIVerificationSummary;
  aiSummary: {
    overview: string;
    whyItMatters: string;
    keyFindings: string[];
    whatRemainsUncertain: string;
  };
  evidenceChain: {
    claim: string;
    evidence: string;
    source: string;
    type: 'Satellite' | 'Ice Core' | 'CTD Profiler' | 'Field Census' | string;
  }[];
  alternativeViews?: {
    perspective: string;
    rationale: string;
    status: string;
  };
}

export interface Expedition {
  id: string;
  name: string;
  code: string;
  year: string;
  region: string;
  vessel: string;
  leader: string;
  institution: string;
  description: string;
  imageUrl: string;
  stations: string[];
  coordinates: string;
  status: 'Completed' | 'Ongoing' | 'Planned';
  objectives: string[];
  achievements: string[];
  timeline: {
    date: string;
    event: string;
  }[];
  relatedResearchIds: string[];
  relatedDatasetIds: string[];
}

export interface Dataset {
  id: string;
  title: string;
  description: string;
  parameter: string;
  timeframe: string;
  location: string;
  coordinates: string;
  samplesCount: number;
  fileSize: string;
  format: string;
  institution: string;
  doi: string;
  dataPoints: {
    label: string;
    value: number;
    uncertainty?: number;
    anomaly?: number;
    unit?: string;
  }[];
  relatedResearchId?: string;
  relatedResearchIds?: string[];
  relatedExpeditionId?: string;
}

export interface ClaimVerification {
  id: string;
  claimText: string;
  status: ClaimStatus | string;
  explanation: string;
  confidenceScore?: number;
  reviewer?: string;
  reviewDate?: string;
  category: string;
  supportingResearch?: string[];
  conflictingResearch?: string[];
  evidenceList?: {
    title: string;
    type: string;
    source: string;
    date: string;
    verified: boolean;
  }[];
  scientificHistory?: {
    year: string;
    event?: string;
    stage?: string;
    source?: string;
    status?: string;
    notes?: string;
  }[];
  watchCount?: number;
}

export interface PolarClaim {
  id: string;
  claim: string;
  popularSource: string;
  status: ClaimStatus;
  verdictSummary: string;
  consensusScore: number; // 0 - 100
  evidenceChain: {
    id: string;
    type: 'Satellite Telemetry' | 'Ice Core' | 'Historical Log' | 'CTD Profiling';
    observation: string;
    source: string;
    verifiedBy: string;
  }[];
  counterEvidence?: string[];
  scientificConsensus: string;
  lastUpdated: string;
  watchedCount?: number;
  isWatched?: boolean;
}

export interface PolarFact {
  id: string;
  title?: string;
  fact?: string;
  statement?: string;
  explanation?: string;
  source?: string;
  verified?: boolean;
  relatedResearchId?: string;
  quizQuestionId?: string;
  region?: 'Antarctica' | 'Arctic' | 'Himalayas';
  category: string;
  icon?: string;
  verifiedSource?: string;
  doiReference?: string;
  aiVerification?: AIVerificationSummary;
}

export interface PolarScientist {
  id: string;
  name: string;
  title?: string;
  designation?: string;
  institution: string;
  avatar?: string;
  photoUrl?: string;
  specialization: string[];
  expeditions?: number | string[];
  expeditionsCount?: number;
  publicationsCount: number;
  citationsCount: number;
  hIndex?: number;
  recentPaperTitle?: string;
  recentPaperDoi?: string;
  bio: string;
  isFollowing?: boolean;
  followersCount?: number;
  verified?: boolean;
}

export type Scientist = PolarScientist;

export interface CommunityVoicePost {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  institution?: string;
  verified: boolean;
  type: 'Observation' | 'Research Idea' | 'Claim / Myth' | 'Expedition Story' | 'Question';
  title: string;
  content: string;
  status: 'PUBLISHED' | 'EVIDENCE_FOUND' | 'VERIFIED' | 'UNDER_REVIEW';
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  createdAt: string;
  relatedResearch?: string;
  relatedExpedition?: string;
  evidenceWatchers?: number;
  isWatched?: boolean;
  tags?: string[];
  followers?: number;
  aiVerification?: AIVerificationSummary;
}

export interface LearningModule {
  id: string;
  title: string;
  category: 'Polar Science Basics' | 'Climate Change' | 'Glaciers & Ice' | 'Antarctica Ecology' | 'Indian Polar Legacy';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
  thumbnail: string;
  has3DExperience?: boolean;
  lessonsCount: number;
  lessons: {
    id: string;
    title: string;
    duration: string;
    content: string;
    keyTakeaways: string[];
  }[];
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  sourceCitation: string;
  xpReward: number;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  unlocked: boolean;
  awardedAt?: string;
  evidenceReference?: string;
}

export interface ExpeditionMedia {
  id: string;
  title: string;
  caption: string;
  type: 'photo' | 'video';
  url: string;
  location: string;
  year: string;
  credit: string;
  expeditionId?: string;
  likes?: number;
  commentsCount?: number;
  aiVerification?: AIVerificationSummary;
}

export type VerificationBatchStatus = 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNVERIFIED';

export interface AIModelAudit {
  model: 'Google Gemini' | 'Anthropic Claude' | 'OpenAI GPT-4o' | 'DeepSeek Reasoner' | string;
  status: VerificationBatchStatus;
  confidenceScore: number;
  reasoning: string;
  citations: string[];
}

export interface AIVerificationSummary {
  batchStatus: VerificationBatchStatus;
  overallStatus?: VerificationBatchStatus; // alias
  overallConfidence?: number;
  consensusScore: number;
  verifiedAt: string;
  summary: string;
  modelAudits: AIModelAudit[];
  models?: Record<string, { status: VerificationBatchStatus; confidence: number; keyFinding: string }>;
  safetyFlags?: string[];
  auditedAt?: string;
}

export interface UserReportTicket {
  id: string;
  targetId: string;
  targetType: 'research' | 'post' | 'media' | 'dataset' | 'expedition';
  targetTitle: string;
  reportedByUsername: string;
  reason: string;
  details: string;
  timestamp: string;
  status: 'PENDING_REVIEW' | 'VERIFIED_ACCURATE' | 'CONTENT_REMOVED' | 'WARNING_ISSUED';
  aiAudit: AIVerificationSummary;
  adminNotes?: string;
}

export interface CyberWarningLog {
  id: string;
  username: string;
  reason: string;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  blockedTextSnippet: string;
  timestamp: string;
  actionTaken: string;
}

export interface SavedItemRecord {
  id: string;
  itemId: string;
  itemType: 'research' | 'post' | 'media' | 'dataset' | 'expedition';
  title: string;
  subtitle?: string;
  imageUrl?: string;
  dateSaved: string;
  metadata?: Record<string, any>;
  // Optional convenience fields for views
  type?: 'research' | 'post' | 'media' | 'dataset' | 'expedition' | string;
  author?: string;
  category?: string;
  thumbnail?: string;
  date?: string;
}

export type SavedItem = SavedItemRecord;
