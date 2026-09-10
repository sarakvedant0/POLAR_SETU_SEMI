export type ViewMode =
  | 'home'
  | 'explore'
  | 'reports'
  | 'report-detail'
  | 'expeditions'
  | 'expedition-detail'
  | 'research'
  | 'research-detail'
  | 'datasets'
  | 'dataset-detail'
  | 'media'
  | 'facts'
  | 'claims'
  | 'claim-detail'
  | 'voices'
  | 'voices-create'
  | 'scientists'
  | 'scientist-detail'
  | 'learning'
  | 'learning-detail'
  | 'quiz'
  | 'ai'
  | 'profile'
  | 'feed'
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
  views: string;
  comments: number;
  citations: number;
  expedition: string;
  researchArea: 'Climate Science' | 'Marine Biology' | 'Ecology' | 'Earth Science' | 'Atmospheric Physics' | 'Glaciology';
  region: 'Antarctica' | 'Arctic' | 'Southern Ocean' | 'Himalaya (Third Pole)';
  imageUrl: string;
  readTime: string;
  doi: string;
  footerLinkType: 'expedition' | 'station' | 'dataset';
  footerLinkLabel: string;
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
    type: 'Satellite' | 'Ice Core' | 'CTD Profiler' | 'Field Census';
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
    anomaly?: number;
    unit?: string;
  }[];
  relatedResearchId?: string;
  relatedExpeditionId?: string;
}

export interface ClaimVerification {
  id: string;
  claimText: string;
  status: ClaimStatus;
  explanation: string;
  confidenceScore: number;
  reviewer: string;
  reviewDate: string;
  supportingResearch: string[];
  conflictingResearch: string[];
  evidenceList: {
    title: string;
    type: string;
    source: string;
    date: string;
    verified: boolean;
  }[];
  scientificHistory: {
    year: string;
    stage: string;
    status: ClaimStatus;
    notes: string;
  }[];
  watchCount: number;
  category: string;
}

export interface PolarFact {
  id: string;
  statement: string;
  category: 'Freshwater' | 'Climate' | 'Ice' | 'Oceans' | 'Wildlife' | 'India & Polar Research';
  source: string;
  verified: boolean;
  explanation: string;
  relatedResearchId: string;
  quizQuestionId?: string;
}

export interface Scientist {
  id: string;
  name: string;
  title: string;
  institution: string;
  verified: boolean;
  avatar: string;
  bio: string;
  specialization: string[];
  expeditions: string[];
  publicationsCount: number;
  citationsCount: number;
  followersCount: number;
  isFollowing?: boolean;
}

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
}
