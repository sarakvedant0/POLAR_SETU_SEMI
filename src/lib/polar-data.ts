/**
 * PolarSetu demonstration knowledge base.
 *
 * IMPORTANT: every record here is illustrative DEMO data created for the
 * PolarSetu prototype. Titles, authors, datasets and figures are fictional
 * and must not be cited as real scientific literature. Each record carries
 * `demo: true` so the UI can label it honestly.
 */

export type VerificationStatus =
  | "VERIFIED"
  | "PARTIALLY_SUPPORTED"
  | "UNVERIFIED"
  | "CONTRADICTED"
  | "UNDER_REVIEW";

export type ProvenanceKind =
  | "SCIENTIFICALLY_VERIFIED"
  | "AI_GENERATED"
  | "COMMUNITY_CONTRIBUTION"
  | "UNDER_REVIEW";

export type NodeType =
  | "research"
  | "dataset"
  | "expedition"
  | "evidence"
  | "claim"
  | "ai"
  | "media"
  | "learning"
  | "community"
  | "station"
  | "scientist";

export interface Scientist {
  id: string;
  name: string;
  institution: string;
  verified: boolean;
  bio: string;
  researchAreas: string[];
  followers: number;
  demo: true;
}

export interface Research {
  id: string;
  title: string;
  authors: string[];
  institution: string;
  year: number;
  publicationDate: string;
  researchArea: string;
  region: "Antarctic" | "Arctic" | "Southern Ocean" | "Himalaya";
  abstract: string;
  aiSummary: {
    about: string;
    matters: string;
    discovered: string;
    important: string;
    uncertain: string;
  };
  keyFindings: string[];
  expeditionId?: string;
  datasetIds: string[];
  claimIds: string[];
  scientistIds: string[];
  views: number;
  reactions: number;
  comments: number;
  status: VerificationStatus;
  demo: true;
}

export interface Expedition {
  id: string;
  name: string;
  year: number;
  region: string;
  location: string;
  description: string;
  timeline: { date: string; event: string }[];
  scientistIds: string[];
  researchIds: string[];
  datasetIds: string[];
  demo: true;
}

export interface Dataset {
  id: string;
  title: string;
  description: string;
  source: string;
  location: string;
  timePeriod: string;
  parameters: string[];
  unit: string;
  series: { label: string; value: number }[];
  relatedResearch: string[];
  relatedExpedition?: string;
  demo: true;
}

export interface Claim {
  id: string;
  claimText: string;
  status: VerificationStatus;
  explanation: string;
  confidence: "Low" | "Moderate" | "High";
  reviewer: string;
  reviewDate: string;
  evidence: Evidence[];
  supportingResearch: string[];
  conflictingResearch: string[];
  datasetIds: string[];
  alternativeViews?: {
    mainFinding: string;
    alternativeFinding: string;
    agreement: string;
    uncertain: string;
    reason: string;
  };
  history: { date: string; action: string; status: VerificationStatus; actor: string }[];
  demo: true;
}

export interface Evidence {
  id: string;
  evidenceType:
    | "Research paper"
    | "Dataset"
    | "Satellite observation"
    | "Field observation"
    | "Expedition report"
    | "Scientific measurement";
  relationship: "SUPPORTS" | "PARTIALLY_SUPPORTS" | "CONTRADICTS" | "CONTEXT";
  summary: string;
  sourceLabel: string;
  sourceId?: string;
  reviewerStatus: "Reviewed" | "Pending review";
}

export interface Fact {
  id: string;
  statement: string;
  category: string;
  status: VerificationStatus;
  source: string;
  relatedResearch?: string;
  quizId?: string;
  demo: true;
}

export interface MediaItem {
  id: string;
  title: string;
  type: "Photo" | "Video" | "Audio" | "Infographic" | "AI Educational Video";
  category: string;
  description: string;
  provenance: ProvenanceKind;
  relatedResearch?: string;
  relatedExpedition?: string;
  demo: true;
}

export interface VoicePost {
  id: string;
  authorId: string;
  type:
    | "Research Idea"
    | "Fact"
    | "Myth / Claim"
    | "Observation"
    | "Expedition Experience"
    | "Research Update"
    | "Question"
    | "Educational Content";
  title: string;
  content: string;
  status:
    | "DRAFT"
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "PUBLISHED"
    | "FLAGGED"
    | "EVIDENCE_FOUND"
    | "VERIFIED"
    | "REJECTED";
  createdAt: string;
  helpful: number;
  notHelpful: number;
  comments: { author: string; content: string; date: string }[];
  relatedResearch?: string;
  relatedDataset?: string;
  relatedExpedition?: string;
  evidenceNote?: string;
  demo: true;
}

export interface LearningModule {
  id: string;
  title: string;
  category: string;
  description: string;
  lessons: {
    id: string;
    title: string;
    simple: string;
    keyConcepts: string[];
    realResearch?: string;
    fact?: string;
  }[];
  quizId?: string;
  demo: true;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  sourceResearch?: string;
  approvalStatus: "APPROVED" | "PENDING_EXPERT_REVIEW";
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    sourceReference: string;
  }[];
  demo: true;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  criteria: string;
}

/* ------------------------------------------------------------------ */

export const scientists: Scientist[] = [
  {
    id: "sci-anaya",
    name: "Dr. Anaya Rao",
    institution: "National Centre for Polar and Ocean Research (demo record)",
    verified: true,
    bio: "Glaciologist working on ice-shelf mass balance in the Indian sector of Antarctica.",
    researchAreas: ["Glaciology", "Ice shelves", "Remote sensing"],
    followers: 1284,
    demo: true,
  },
  {
    id: "sci-imran",
    name: "Dr. Imran Qureshi",
    institution: "Indian Institute of Polar Sciences (demo record)",
    verified: true,
    bio: "Physical oceanographer studying Southern Ocean heat transport and water masses.",
    researchAreas: ["Oceanography", "Climate dynamics"],
    followers: 942,
    demo: true,
  },
  {
    id: "sci-meera",
    name: "Dr. Meera Iyer",
    institution: "Polar Biology Laboratory (demo record)",
    verified: true,
    bio: "Marine biologist tracking penguin colony dynamics and krill availability.",
    researchAreas: ["Polar biology", "Ecology"],
    followers: 1610,
    demo: true,
  },
  {
    id: "sci-tenzin",
    name: "Dr. Tenzin Bhutia",
    institution: "Arctic Observation Group (demo record)",
    verified: true,
    bio: "Atmospheric scientist at the Himadri station studying aerosols and radiation.",
    researchAreas: ["Atmospheric science", "Arctic"],
    followers: 703,
    demo: true,
  },
  {
    id: "sci-community",
    name: "Rhea Menon",
    institution: "MSc student, Earth Sciences (demo record)",
    verified: false,
    bio: "Student contributor interested in sea ice and science communication.",
    researchAreas: ["Sea ice", "Science communication"],
    followers: 88,
    demo: true,
  },
];

export const expeditions: Expedition[] = [
  {
    id: "exp-42",
    name: "42nd Indian Scientific Expedition to Antarctica",
    year: 2023,
    region: "Antarctic",
    location: "Bharati & Maitri stations, East Antarctica",
    description:
      "A multi-disciplinary summer campaign covering glaciology, oceanography and atmospheric measurements across the Indian sector of East Antarctica.",
    timeline: [
      { date: "Nov 2022", event: "Team assembly and departure from Cape Town" },
      { date: "Dec 2022", event: "Arrival at Bharati station, instrument deployment" },
      { date: "Jan 2023", event: "Ice-shelf drilling and GPS network survey" },
      { date: "Feb 2023", event: "Ocean mooring recovery in Prydz Bay" },
      { date: "Mar 2023", event: "Return voyage, sample handover to laboratories" },
    ],
    scientistIds: ["sci-anaya", "sci-imran"],
    researchIds: ["res-iceshelf", "res-ocean-heat"],
    datasetIds: ["ds-ice-thickness", "ds-ocean-temp"],
    demo: true,
  },
  {
    id: "exp-himadri",
    name: "Himadri Arctic Campaign",
    year: 2024,
    region: "Arctic",
    location: "Ny-Ålesund, Svalbard",
    description:
      "Year-round atmospheric and glaciological observations at the Indian Arctic research base.",
    timeline: [
      { date: "Apr 2024", event: "Spring aerosol sampling begins" },
      { date: "Jun 2024", event: "Glacier mass-balance stake survey" },
      { date: "Sep 2024", event: "Radiation budget instrument recalibration" },
    ],
    scientistIds: ["sci-tenzin"],
    researchIds: ["res-arctic-aerosol"],
    datasetIds: ["ds-arctic-radiation"],
    demo: true,
  },
  {
    id: "exp-southern-ocean",
    name: "Southern Ocean Biology Cruise",
    year: 2025,
    region: "Southern Ocean",
    location: "Weddell Sea sector",
    description:
      "Ship-based survey of penguin colonies, krill density and deep-sea biodiversity.",
    timeline: [
      { date: "Jan 2025", event: "Colony counts along the ice edge" },
      { date: "Feb 2025", event: "Deep-sea trawl and eDNA sampling" },
    ],
    scientistIds: ["sci-meera"],
    researchIds: ["res-penguins", "res-deepsea"],
    datasetIds: ["ds-penguin-counts"],
    demo: true,
  },
];

export const datasets: Dataset[] = [
  {
    id: "ds-ice-thickness",
    title: "East Antarctic ice-shelf thickness transects",
    description:
      "Radar-derived ice thickness along nine transects surveyed during the 42nd Indian expedition.",
    source: "PolarSetu demo repository",
    location: "Prydz Bay, East Antarctica",
    timePeriod: "2015 – 2024",
    parameters: ["Ice thickness", "Surface elevation", "Basal melt rate"],
    unit: "metres",
    series: [
      { label: "2015", value: 412 },
      { label: "2017", value: 405 },
      { label: "2019", value: 397 },
      { label: "2021", value: 388 },
      { label: "2023", value: 379 },
      { label: "2024", value: 374 },
    ],
    relatedResearch: ["res-iceshelf"],
    relatedExpedition: "exp-42",
    demo: true,
  },
  {
    id: "ds-ocean-temp",
    title: "Prydz Bay upper-ocean temperature moorings",
    description: "Mooring temperature records at 200 m depth in the Indian sector.",
    source: "PolarSetu demo repository",
    location: "Prydz Bay",
    timePeriod: "2016 – 2024",
    parameters: ["Temperature", "Salinity", "Current speed"],
    unit: "°C",
    series: [
      { label: "2016", value: -1.4 },
      { label: "2018", value: -1.25 },
      { label: "2020", value: -1.1 },
      { label: "2022", value: -0.95 },
      { label: "2024", value: -0.82 },
    ],
    relatedResearch: ["res-ocean-heat", "res-iceshelf"],
    relatedExpedition: "exp-42",
    demo: true,
  },
  {
    id: "ds-penguin-counts",
    title: "Weddell Sea Adélie colony counts",
    description: "Annual breeding-pair counts across six monitored colonies.",
    source: "PolarSetu demo repository",
    location: "Weddell Sea",
    timePeriod: "2018 – 2025",
    parameters: ["Breeding pairs", "Chick survival"],
    unit: "thousand pairs",
    series: [
      { label: "2018", value: 48 },
      { label: "2020", value: 44 },
      { label: "2022", value: 45 },
      { label: "2024", value: 41 },
      { label: "2025", value: 39 },
    ],
    relatedResearch: ["res-penguins"],
    relatedExpedition: "exp-southern-ocean",
    demo: true,
  },
  {
    id: "ds-arctic-radiation",
    title: "Himadri surface radiation budget",
    description: "Downwelling shortwave and longwave radiation at the Arctic base.",
    source: "PolarSetu demo repository",
    location: "Ny-Ålesund, Svalbard",
    timePeriod: "2019 – 2024",
    parameters: ["Shortwave", "Longwave", "Aerosol optical depth"],
    unit: "W/m²",
    series: [
      { label: "2019", value: 96 },
      { label: "2020", value: 101 },
      { label: "2021", value: 99 },
      { label: "2022", value: 106 },
      { label: "2023", value: 109 },
      { label: "2024", value: 112 },
    ],
    relatedResearch: ["res-arctic-aerosol"],
    relatedExpedition: "exp-himadri",
    demo: true,
  },
];

export const research: Research[] = [
  {
    id: "res-iceshelf",
    title: "Accelerated ice-shelf thinning in the Indian sector of Antarctica",
    authors: ["Dr. Anaya Rao", "Dr. Imran Qureshi"],
    institution: "National Centre for Polar and Ocean Research (demo record)",
    year: 2025,
    publicationDate: "2025-03-12",
    researchArea: "Glaciology",
    region: "Antarctic",
    abstract:
      "Combining radar transects from nine field seasons with mooring records, this demo study reconstructs ice-shelf thickness change in Prydz Bay and relates thinning to warmer water intrusion at depth.",
    aiSummary: {
      about:
        "It measures how thick a floating ice shelf in East Antarctica is, and how that thickness has changed over roughly a decade.",
      matters:
        "Ice shelves act as a brake on the glaciers behind them. If they thin, land ice can flow to the ocean faster and raise sea level.",
      discovered:
        "The surveyed transects thinned by about 38 metres between 2015 and 2024, and thinning tracks warmer water measured at 200 m depth.",
      important:
        "It links an ocean process to an ice process using measurements from the same expedition, which strengthens the causal argument.",
      uncertain:
        "The transects cover a small part of the shelf, and the mooring record is short, so long-term trends and the role of natural variability remain open.",
    },
    keyFindings: [
      "Mean thickness along monitored transects declined from 412 m (2015) to 374 m (2024).",
      "Thinning is strongest where the sea floor allows warm water to reach the ice base.",
      "Upper-ocean temperature at 200 m warmed by ~0.6 °C over the same period.",
      "No significant change was detected in surface accumulation, pointing to ocean-driven melt.",
    ],
    expeditionId: "exp-42",
    datasetIds: ["ds-ice-thickness", "ds-ocean-temp"],
    claimIds: ["claim-iceshelf", "claim-antarctica-warming"],
    scientistIds: ["sci-anaya", "sci-imran"],
    views: 2412,
    reactions: 342,
    comments: 68,
    status: "VERIFIED",
    demo: true,
  },
  {
    id: "res-ocean-heat",
    title: "Heat transport pathways into Prydz Bay",
    authors: ["Dr. Imran Qureshi"],
    institution: "Indian Institute of Polar Sciences (demo record)",
    year: 2024,
    publicationDate: "2024-11-02",
    researchArea: "Oceanography",
    region: "Southern Ocean",
    abstract:
      "A demo analysis of mooring and hydrographic data describing how modified circumpolar deep water reaches the continental shelf.",
    aiSummary: {
      about: "How warm deep ocean water finds its way onto the Antarctic continental shelf.",
      matters: "That warm water is the main heat source melting ice shelves from below.",
      discovered:
        "Warm water intrusions became more frequent after 2019 and follow deep troughs in the sea floor.",
      important: "It identifies where to place future moorings to monitor melt risk.",
      uncertain: "Only two moorings were available, so the spatial picture is incomplete.",
    },
    keyFindings: [
      "Warm intrusions occurred in 4 of 5 summers after 2019, versus 1 of 4 before.",
      "Intrusions follow bathymetric troughs rather than the open shelf.",
      "Salinity signatures identify modified circumpolar deep water as the source.",
    ],
    expeditionId: "exp-42",
    datasetIds: ["ds-ocean-temp"],
    claimIds: ["claim-iceshelf"],
    scientistIds: ["sci-imran"],
    views: 1810,
    reactions: 210,
    comments: 45,
    status: "VERIFIED",
    demo: true,
  },
  {
    id: "res-penguins",
    title: "Adélie penguin population trends in the Weddell Sea",
    authors: ["Dr. Meera Iyer"],
    institution: "Polar Biology Laboratory (demo record)",
    year: 2025,
    publicationDate: "2025-03-08",
    researchArea: "Polar biology",
    region: "Antarctic",
    abstract:
      "Colony counts across six sites over eight seasons, examined against sea-ice extent and krill availability in a demo dataset.",
    aiSummary: {
      about: "How many Adélie penguins breed in a set of monitored colonies, and whether that is changing.",
      matters: "Penguins integrate changes in sea ice and food supply, so they are a useful ecosystem indicator.",
      discovered: "Counts fell about 19% since 2018, with the sharpest decline at the two northernmost colonies.",
      important: "It separates colony-level variation from a regional signal.",
      uncertain:
        "Eight seasons is short for a species with high natural variability, and some birds may have relocated rather than died.",
    },
    keyFindings: [
      "Total counted pairs fell from 48k (2018) to 39k (2025).",
      "Northern colonies declined fastest; two southern colonies were stable.",
      "Decline correlates with earlier sea-ice breakup but causation is not established.",
    ],
    expeditionId: "exp-southern-ocean",
    datasetIds: ["ds-penguin-counts"],
    claimIds: ["claim-penguins"],
    scientistIds: ["sci-meera"],
    views: 1520,
    reactions: 180,
    comments: 32,
    status: "PARTIALLY_SUPPORTED",
    demo: true,
  },
  {
    id: "res-deepsea",
    title: "Diversity of deep-sea species in the Southern Ocean",
    authors: ["Dr. Meera Iyer", "Dr. Anaya Rao"],
    institution: "Polar Biology Laboratory (demo record)",
    year: 2025,
    publicationDate: "2025-03-10",
    researchArea: "Marine biology",
    region: "Southern Ocean",
    abstract:
      "Environmental DNA and trawl sampling describing benthic biodiversity below 800 m in a demo survey.",
    aiSummary: {
      about: "What lives on the deep sea floor of the Southern Ocean.",
      matters: "Deep-sea communities are poorly mapped and vulnerable to change.",
      discovered: "eDNA detected 37 taxa that trawling missed entirely.",
      important: "It shows eDNA can extend biodiversity surveys at low cost.",
      uncertain: "eDNA cannot yet reliably estimate abundance.",
    },
    keyFindings: [
      "37 taxa detected by eDNA only.",
      "Benthic diversity peaks near the shelf break.",
      "Two suspected new amphipod lineages await taxonomic confirmation.",
    ],
    expeditionId: "exp-southern-ocean",
    datasetIds: [],
    claimIds: [],
    scientistIds: ["sci-meera"],
    views: 1180,
    reactions: 156,
    comments: 28,
    status: "VERIFIED",
    demo: true,
  },
  {
    id: "res-arctic-aerosol",
    title: "Aerosol influence on the Arctic surface radiation budget",
    authors: ["Dr. Tenzin Bhutia"],
    institution: "Arctic Observation Group (demo record)",
    year: 2024,
    publicationDate: "2024-09-21",
    researchArea: "Atmospheric science",
    region: "Arctic",
    abstract:
      "Five years of demo radiation and aerosol observations from the Himadri base at Ny-Ålesund.",
    aiSummary: {
      about: "How tiny airborne particles change the amount of energy reaching the Arctic surface.",
      matters: "Small radiation changes accumulate into large melt differences over a season.",
      discovered: "Downwelling longwave radiation rose ~16 W/m² across the record on hazy days.",
      important: "It quantifies a local amplifier of Arctic warming.",
      uncertain: "Cloud and aerosol effects are hard to separate with surface instruments alone.",
    },
    keyFindings: [
      "Hazy days show consistently higher longwave radiation.",
      "Spring transport episodes dominate the aerosol signal.",
      "Instrument recalibration in 2022 explains part of the step change.",
    ],
    expeditionId: "exp-himadri",
    datasetIds: ["ds-arctic-radiation"],
    claimIds: ["claim-arctic-warming"],
    scientistIds: ["sci-tenzin"],
    views: 990,
    reactions: 121,
    comments: 19,
    status: "VERIFIED",
    demo: true,
  },
];

export const claims: Claim[] = [
  {
    id: "claim-antarctica-warming",
    claimText: "Antarctica is getting warmer everywhere.",
    status: "PARTIALLY_SUPPORTED",
    explanation:
      "Antarctica is not warming uniformly. The Antarctic Peninsula and parts of West Antarctica show clear warming, while much of the East Antarctic plateau shows little trend or even slight cooling in some records. Ocean-driven melting beneath ice shelves can occur without a matching rise in air temperature.",
    confidence: "High",
    reviewer: "PolarSetu review panel (demo)",
    reviewDate: "2025-04-18",
    evidence: [
      {
        id: "ev-1",
        evidenceType: "Research paper",
        relationship: "PARTIALLY_SUPPORTS",
        summary:
          "Demo study finds strong sub-surface ocean warming in Prydz Bay with no matching surface air-temperature trend.",
        sourceLabel: "Accelerated ice-shelf thinning in the Indian sector of Antarctica",
        sourceId: "res-iceshelf",
        reviewerStatus: "Reviewed",
      },
      {
        id: "ev-2",
        evidenceType: "Dataset",
        relationship: "CONTEXT",
        summary: "Mooring temperature record showing +0.6 °C at 200 m depth since 2016.",
        sourceLabel: "Prydz Bay upper-ocean temperature moorings",
        sourceId: "ds-ocean-temp",
        reviewerStatus: "Reviewed",
      },
    ],
    supportingResearch: ["res-iceshelf"],
    conflictingResearch: [],
    datasetIds: ["ds-ocean-temp"],
    alternativeViews: {
      mainFinding: "Warming is regionally concentrated and largely ocean-driven in the Indian sector.",
      alternativeFinding:
        "Some analyses emphasise strong decadal variability in East Antarctic records rather than a warming trend.",
      agreement: "Sub-surface ocean heat in specific troughs has increased over the observed period.",
      uncertain: "Whether that increase is a long-term trend or part of a multi-decadal cycle.",
      reason: "Different time periods and different station networks.",
    },
    history: [
      { date: "2024-06-02", action: "Claim submitted from community discussion", status: "UNVERIFIED", actor: "Community" },
      { date: "2024-09-14", action: "Mooring dataset attached as context evidence", status: "UNVERIFIED", actor: "Data team" },
      { date: "2025-03-12", action: "Ice-shelf study linked as partial support", status: "UNDER_REVIEW", actor: "AI evidence matching" },
      { date: "2025-04-18", action: "Expert review completed", status: "PARTIALLY_SUPPORTED", actor: "Review panel" },
    ],
    demo: true,
  },
  {
    id: "claim-iceshelf",
    claimText: "Warm ocean water is thinning ice shelves in the Indian sector of Antarctica.",
    status: "VERIFIED",
    explanation:
      "Radar thickness transects and mooring temperature records from the same expedition show coincident thinning and sub-surface warming, with no matching change in surface accumulation.",
    confidence: "High",
    reviewer: "PolarSetu review panel (demo)",
    reviewDate: "2025-05-02",
    evidence: [
      {
        id: "ev-3",
        evidenceType: "Research paper",
        relationship: "SUPPORTS",
        summary: "Thinning of ~38 m along monitored transects between 2015 and 2024.",
        sourceLabel: "Accelerated ice-shelf thinning in the Indian sector of Antarctica",
        sourceId: "res-iceshelf",
        reviewerStatus: "Reviewed",
      },
      {
        id: "ev-4",
        evidenceType: "Scientific measurement",
        relationship: "SUPPORTS",
        summary: "Radar transect measurements repeated over nine field seasons.",
        sourceLabel: "East Antarctic ice-shelf thickness transects",
        sourceId: "ds-ice-thickness",
        reviewerStatus: "Reviewed",
      },
      {
        id: "ev-5",
        evidenceType: "Research paper",
        relationship: "SUPPORTS",
        summary: "Identifies bathymetric pathways carrying warm deep water onto the shelf.",
        sourceLabel: "Heat transport pathways into Prydz Bay",
        sourceId: "res-ocean-heat",
        reviewerStatus: "Reviewed",
      },
    ],
    supportingResearch: ["res-iceshelf", "res-ocean-heat"],
    conflictingResearch: [],
    datasetIds: ["ds-ice-thickness", "ds-ocean-temp"],
    history: [
      { date: "2024-11-02", action: "Claim created from research finding", status: "UNVERIFIED", actor: "Editorial" },
      { date: "2025-03-12", action: "New study added as supporting evidence", status: "UNDER_REVIEW", actor: "AI evidence matching" },
      { date: "2025-05-02", action: "Expert review completed", status: "VERIFIED", actor: "Review panel" },
    ],
    demo: true,
  },
  {
    id: "claim-penguins",
    claimText: "Penguin numbers are collapsing across Antarctica.",
    status: "CONTRADICTED",
    explanation:
      "Monitored colonies in the Weddell Sea sector show a decline, but other regions in the demo repository show stable or increasing counts. A regional decline is not a continent-wide collapse.",
    confidence: "Moderate",
    reviewer: "PolarSetu review panel (demo)",
    reviewDate: "2025-05-20",
    evidence: [
      {
        id: "ev-6",
        evidenceType: "Dataset",
        relationship: "PARTIALLY_SUPPORTS",
        summary: "19% decline across six monitored Weddell Sea colonies since 2018.",
        sourceLabel: "Weddell Sea Adélie colony counts",
        sourceId: "ds-penguin-counts",
        reviewerStatus: "Reviewed",
      },
      {
        id: "ev-7",
        evidenceType: "Field observation",
        relationship: "CONTRADICTS",
        summary: "Two southern colonies in the same survey remained stable across all seasons.",
        sourceLabel: "Southern Ocean Biology Cruise field notes",
        sourceId: "exp-southern-ocean",
        reviewerStatus: "Reviewed",
      },
    ],
    supportingResearch: [],
    conflictingResearch: ["res-penguins"],
    datasetIds: ["ds-penguin-counts"],
    alternativeViews: {
      mainFinding: "Regional decline in the northern Weddell Sea colonies.",
      alternativeFinding: "Relocation between colonies could explain part of the observed decline.",
      agreement: "The northern colonies host fewer breeding pairs than in 2018.",
      uncertain: "Whether birds died or moved to unmonitored sites.",
      reason: "Different locations and incomplete colony coverage.",
    },
    history: [
      { date: "2025-01-11", action: "Claim submitted by community member", status: "UNVERIFIED", actor: "Community" },
      { date: "2025-03-08", action: "Colony dataset attached", status: "UNDER_REVIEW", actor: "Data team" },
      { date: "2025-05-20", action: "Expert review found contradicting regional evidence", status: "CONTRADICTED", actor: "Review panel" },
    ],
    demo: true,
  },
  {
    id: "claim-arctic-warming",
    claimText: "Airborne particles transported to the Arctic can increase surface warming.",
    status: "VERIFIED",
    explanation:
      "Five years of demo radiation observations at Ny-Ålesund show consistently higher downwelling longwave radiation on hazy days.",
    confidence: "Moderate",
    reviewer: "PolarSetu review panel (demo)",
    reviewDate: "2025-02-09",
    evidence: [
      {
        id: "ev-8",
        evidenceType: "Research paper",
        relationship: "SUPPORTS",
        summary: "Quantifies a ~16 W/m² increase in downwelling longwave radiation on hazy days.",
        sourceLabel: "Aerosol influence on the Arctic surface radiation budget",
        sourceId: "res-arctic-aerosol",
        reviewerStatus: "Reviewed",
      },
    ],
    supportingResearch: ["res-arctic-aerosol"],
    conflictingResearch: [],
    datasetIds: ["ds-arctic-radiation"],
    history: [
      { date: "2024-09-21", action: "Claim created from research finding", status: "UNVERIFIED", actor: "Editorial" },
      { date: "2025-02-09", action: "Expert review completed", status: "VERIFIED", actor: "Review panel" },
    ],
    demo: true,
  },
  {
    id: "claim-sea-level",
    claimText: "Melting sea ice directly raises global sea level.",
    status: "CONTRADICTED",
    explanation:
      "Sea ice already floats, so its melting displaces the water it occupies and does not meaningfully change sea level. Land ice — glaciers and ice sheets — is what raises sea level when it melts.",
    confidence: "High",
    reviewer: "PolarSetu review panel (demo)",
    reviewDate: "2025-01-30",
    evidence: [
      {
        id: "ev-9",
        evidenceType: "Scientific measurement",
        relationship: "CONTRADICTS",
        summary: "Buoyancy principle: floating ice displaces its own mass of water.",
        sourceLabel: "Basic physical principle (Archimedes)",
        reviewerStatus: "Reviewed",
      },
    ],
    supportingResearch: [],
    conflictingResearch: [],
    datasetIds: [],
    history: [
      { date: "2025-01-05", action: "Claim submitted from community myth report", status: "UNVERIFIED", actor: "Community" },
      { date: "2025-01-30", action: "Expert review completed", status: "CONTRADICTED", actor: "Review panel" },
    ],
    demo: true,
  },
];

export const facts: Fact[] = [
  {
    id: "fact-freshwater",
    statement: "Antarctica holds about 70% of the world's freshwater, locked in its ice sheet.",
    category: "Ice",
    status: "VERIFIED",
    source: "PolarSetu demo knowledge base",
    relatedResearch: "res-iceshelf",
    quizId: "quiz-antarctica",
    demo: true,
  },
  {
    id: "fact-coldest",
    statement: "The lowest natural surface temperature ever recorded on Earth was measured on the East Antarctic plateau.",
    category: "Climate",
    status: "VERIFIED",
    source: "PolarSetu demo knowledge base",
    quizId: "quiz-antarctica",
    demo: true,
  },
  {
    id: "fact-krill",
    statement: "Antarctic krill form some of the largest animal aggregations on the planet and underpin the Southern Ocean food web.",
    category: "Wildlife",
    status: "VERIFIED",
    source: "PolarSetu demo knowledge base",
    relatedResearch: "res-penguins",
    demo: true,
  },
  {
    id: "fact-india-station",
    statement: "India operates research stations in both polar regions, including Maitri and Bharati in Antarctica and Himadri in the Arctic.",
    category: "India & Polar Research",
    status: "VERIFIED",
    source: "PolarSetu demo knowledge base",
    relatedResearch: "res-arctic-aerosol",
    demo: true,
  },
  {
    id: "fact-seaice",
    statement: "Sea ice roughly doubles the area of Antarctica each winter and shrinks back each summer.",
    category: "Ice",
    status: "VERIFIED",
    source: "PolarSetu demo knowledge base",
    demo: true,
  },
  {
    id: "fact-ocean",
    statement: "The Southern Ocean absorbs a disproportionate share of the excess heat added to the world's oceans.",
    category: "Oceans",
    status: "VERIFIED",
    source: "PolarSetu demo knowledge base",
    relatedResearch: "res-ocean-heat",
    demo: true,
  },
];

export const media: MediaItem[] = [
  {
    id: "med-station",
    title: "Bharati station under low summer sun",
    type: "Photo",
    category: "Research stations",
    description: "Illustrative render of an Indian Antarctic research station during the summer campaign.",
    provenance: "COMMUNITY_CONTRIBUTION",
    relatedExpedition: "exp-42",
    demo: true,
  },
  {
    id: "med-drill",
    title: "Ice-shelf drilling operations",
    type: "Video",
    category: "Expeditions",
    description: "Field footage placeholder showing hot-water drilling through a floating ice shelf.",
    provenance: "COMMUNITY_CONTRIBUTION",
    relatedResearch: "res-iceshelf",
    relatedExpedition: "exp-42",
    demo: true,
  },
  {
    id: "med-ai-video",
    title: "How warm water melts ice shelves — AI explainer",
    type: "AI Educational Video",
    category: "Ice",
    description: "Script and narration generated by Polar AI from the ice-shelf study, reviewed before publication.",
    provenance: "AI_GENERATED",
    relatedResearch: "res-iceshelf",
    demo: true,
  },
  {
    id: "med-penguins",
    title: "Adélie colony count survey",
    type: "Photo",
    category: "Wildlife",
    description: "Survey photograph placeholder used for colony counting.",
    provenance: "COMMUNITY_CONTRIBUTION",
    relatedResearch: "res-penguins",
    demo: true,
  },
  {
    id: "med-infographic",
    title: "Anatomy of an ice shelf",
    type: "Infographic",
    category: "Glaciers",
    description: "Diagram of grounding line, ice shelf and basal melt zone.",
    provenance: "SCIENTIFICALLY_VERIFIED",
    relatedResearch: "res-iceshelf",
    demo: true,
  },
  {
    id: "med-audio",
    title: "Under-ice hydrophone recording",
    type: "Audio",
    category: "Ocean",
    description: "Placeholder audio capture of ice cracking and marine mammal calls.",
    provenance: "COMMUNITY_CONTRIBUTION",
    relatedExpedition: "exp-southern-ocean",
    demo: true,
  },
];

export const voicePosts: VoicePost[] = [
  {
    id: "voice-1",
    authorId: "sci-community",
    type: "Observation",
    title: "Earlier sea-ice breakup noticed in satellite imagery near monitored colonies",
    content:
      "Comparing publicly available imagery for the last four seasons, breakup near the two northern colonies looks about ten days earlier than the 2018 baseline. Sharing in case it is useful context for the colony count work.",
    status: "EVIDENCE_FOUND",
    createdAt: "2025-04-02",
    helpful: 64,
    notHelpful: 3,
    comments: [
      { author: "Dr. Meera Iyer", content: "This lines up with our field notes — worth formalising.", date: "2025-04-04" },
    ],
    relatedResearch: "res-penguins",
    relatedDataset: "ds-penguin-counts",
    evidenceNote: "A dataset was later linked to this contribution and it is queued for expert review.",
    demo: true,
  },
  {
    id: "voice-2",
    authorId: "sci-anaya",
    type: "Research Update",
    title: "Next season we are extending the radar transects further west",
    content:
      "The current transects miss the deep trough on the western flank. Extending coverage should tell us whether the thinning pattern continues beyond the surveyed area.",
    status: "PUBLISHED",
    createdAt: "2025-05-11",
    helpful: 121,
    notHelpful: 1,
    comments: [],
    relatedResearch: "res-iceshelf",
    relatedExpedition: "exp-42",
    demo: true,
  },
  {
    id: "voice-3",
    authorId: "sci-community",
    type: "Myth / Claim",
    title: "Someone told me melting sea ice will flood coastal cities",
    content: "Is this true? I keep seeing it repeated online and I am not sure how to answer it.",
    status: "PUBLISHED",
    createdAt: "2025-01-05",
    helpful: 88,
    notHelpful: 4,
    comments: [
      { author: "Dr. Tenzin Bhutia", content: "Floating ice already displaces its own mass — see the linked claim check.", date: "2025-01-06" },
    ],
    demo: true,
  },
  {
    id: "voice-4",
    authorId: "sci-tenzin",
    type: "Educational Content",
    title: "A simple way to explain the polar radiation budget to students",
    content:
      "Think of the surface as a bank account: sunlight is income, infrared loss is spending. Haze reduces the spending, so the balance grows even without more income.",
    status: "PUBLISHED",
    createdAt: "2025-02-20",
    helpful: 156,
    notHelpful: 2,
    comments: [],
    relatedResearch: "res-arctic-aerosol",
    demo: true,
  },
  {
    id: "voice-5",
    authorId: "sci-community",
    type: "Question",
    title: "How do researchers tell ocean-driven melt from surface melt?",
    content: "Is it just about where the thinning happens, or are there chemical signatures too?",
    status: "UNDER_REVIEW",
    createdAt: "2025-06-01",
    helpful: 22,
    notHelpful: 0,
    comments: [],
    demo: true,
  },
];

export const learningModules: LearningModule[] = [
  {
    id: "learn-basics",
    title: "Polar Science Basics",
    category: "Foundations",
    description: "What the polar regions are, why they matter, and how scientists study them.",
    lessons: [
      {
        id: "l1",
        title: "The two polar regions",
        simple:
          "The Arctic is an ocean surrounded by land. Antarctica is a continent surrounded by ocean. That single difference shapes almost everything else about them.",
        keyConcepts: ["Arctic Ocean", "Antarctic continent", "Sea ice vs land ice"],
        fact: "fact-seaice",
      },
      {
        id: "l2",
        title: "Why India studies the poles",
        simple:
          "Polar processes drive monsoon-relevant ocean circulation and global sea level, so polar observation is directly relevant to India.",
        keyConcepts: ["Southern Ocean", "Sea level", "International science"],
        fact: "fact-india-station",
        realResearch: "res-arctic-aerosol",
      },
    ],
    quizId: "quiz-antarctica",
    demo: true,
  },
  {
    id: "learn-glaciers",
    title: "Glaciers & Ice",
    category: "Cryosphere",
    description: "How ice sheets, glaciers and ice shelves work — and why thinning matters.",
    lessons: [
      {
        id: "l1",
        title: "What an ice shelf does",
        simple:
          "An ice shelf is the floating edge of an ice sheet. It acts like a doorstop, slowing the glaciers behind it.",
        keyConcepts: ["Grounding line", "Buttressing", "Basal melt"],
        realResearch: "res-iceshelf",
      },
      {
        id: "l2",
        title: "Melting from below",
        simple:
          "Warm ocean water can slide under an ice shelf and melt it from underneath, even when the air above stays freezing.",
        keyConcepts: ["Circumpolar deep water", "Bathymetric troughs", "Thinning"],
        realResearch: "res-ocean-heat",
      },
    ],
    quizId: "quiz-glaciers",
    demo: true,
  },
  {
    id: "learn-climate",
    title: "Climate Change & the Poles",
    category: "Climate",
    description: "Regional warming patterns, common myths, and what the evidence actually shows.",
    lessons: [
      {
        id: "l1",
        title: "Warming is not uniform",
        simple:
          "Some parts of Antarctica warm quickly while others barely change. Averaging the whole continent hides that.",
        keyConcepts: ["Regional variability", "Peninsula warming", "Ocean-driven change"],
        realResearch: "res-iceshelf",
      },
    ],
    quizId: "quiz-myths",
    demo: true,
  },
  {
    id: "learn-oceans",
    title: "Polar Oceans",
    category: "Oceanography",
    description: "Water masses, heat transport and the Southern Ocean's role in the climate system.",
    lessons: [
      {
        id: "l1",
        title: "Layers of the polar ocean",
        simple:
          "Cold fresh water sits on top of warmer, saltier water. Where that warm layer reaches the coast, ice melts.",
        keyConcepts: ["Stratification", "Water masses", "Heat transport"],
        realResearch: "res-ocean-heat",
      },
    ],
    demo: true,
  },
];

export const quizzes: Quiz[] = [
  {
    id: "quiz-antarctica",
    title: "Antarctica essentials",
    category: "Antarctica",
    approvalStatus: "APPROVED",
    questions: [
      {
        id: "q1",
        question: "Roughly how much of the world's freshwater is stored in Antarctica?",
        options: ["About 10%", "About 30%", "About 70%", "About 95%"],
        correctIndex: 2,
        explanation: "Antarctica's ice sheet holds roughly 70% of Earth's freshwater.",
        sourceReference: "PolarSetu fact: Antarctic freshwater store",
      },
      {
        id: "q2",
        question: "Which statement describes the Arctic correctly?",
        options: [
          "A continent surrounded by ocean",
          "An ocean surrounded by land",
          "A permanently ice-free sea",
          "A freshwater lake system",
        ],
        correctIndex: 1,
        explanation: "The Arctic is an ocean basin ringed by continents; Antarctica is the opposite.",
        sourceReference: "Learning module: Polar Science Basics",
      },
    ],
    demo: true,
  },
  {
    id: "quiz-glaciers",
    title: "Ice shelves and glaciers",
    category: "Glaciology",
    sourceResearch: "res-iceshelf",
    approvalStatus: "APPROVED",
    questions: [
      {
        id: "q1",
        question: "In the demo study, what drove ice-shelf thinning in Prydz Bay?",
        options: [
          "Reduced snowfall at the surface",
          "Warm water reaching the ice base",
          "Increased iceberg calving only",
          "Volcanic heat from below the bedrock",
        ],
        correctIndex: 1,
        explanation:
          "Surface accumulation showed no significant change; thinning tracked sub-surface ocean warming.",
        sourceReference: "Research: Accelerated ice-shelf thinning in the Indian sector of Antarctica",
      },
      {
        id: "q2",
        question: "Why does an ice shelf matter for sea level even though it floats?",
        options: [
          "Its melting directly raises sea level",
          "It buttresses land ice behind it",
          "It reflects all incoming sunlight",
          "It stores liquid freshwater inside",
        ],
        correctIndex: 1,
        explanation:
          "Floating ice does not raise sea level when it melts, but losing it lets grounded land ice flow faster.",
        sourceReference: "Learning module: Glaciers & Ice",
      },
    ],
    demo: true,
  },
  {
    id: "quiz-myths",
    title: "Polar myth buster",
    category: "Myth Buster",
    approvalStatus: "APPROVED",
    questions: [
      {
        id: "q1",
        question: "Does melting sea ice meaningfully raise global sea level?",
        options: ["Yes, dramatically", "No — it already floats", "Only in the Arctic", "Only in winter"],
        correctIndex: 1,
        explanation: "Floating ice displaces its own mass of water; land ice is what raises sea level.",
        sourceReference: "Claim check: Melting sea ice directly raises global sea level",
      },
      {
        id: "q2",
        question: "What does an 'unverified' status mean on PolarSetu?",
        options: [
          "The claim is false",
          "The claim is proven",
          "Evidence has not yet been established either way",
          "The claim was removed",
        ],
        correctIndex: 2,
        explanation: "Unverified means evidence is not yet sufficient — it does not mean false.",
        sourceReference: "PolarSetu scientific trust rules",
      },
    ],
    demo: true,
  },
];

export const badges: Badge[] = [
  { id: "b-polar", name: "Polar Contributor", description: "Published a reviewed contribution.", criteria: "1 published post" },
  { id: "b-research", name: "Research Contributor", description: "Contributed a research-linked update.", criteria: "Post linked to research" },
  { id: "b-data", name: "Data Contributor", description: "Contributed or improved a dataset record.", criteria: "Dataset accepted" },
  { id: "b-knowledge", name: "Knowledge Contributor", description: "Authored reviewed educational content.", criteria: "Lesson or explainer approved" },
  {
    id: "b-evidence",
    name: "Evidence Contributor",
    description:
      "Awarded only when an original contribution is supported by verified scientific evidence and confirmed by expert review. Never awarded for likes, followers or views.",
    criteria: "Original contribution + verified evidence + expert verification",
  },
];

/* ------------------------- lookups & graph ------------------------- */

export const byId = <T extends { id: string }>(list: T[], id?: string) =>
  list.find((item) => item.id === id);

export const researchById = (id?: string) => byId(research, id);
export const datasetById = (id?: string) => byId(datasets, id);
export const expeditionById = (id?: string) => byId(expeditions, id);
export const claimById = (id?: string) => byId(claims, id);
export const scientistById = (id?: string) => byId(scientists, id);
export const factById = (id?: string) => byId(facts, id);
export const mediaById = (id?: string) => byId(media, id);
export const voiceById = (id?: string) => byId(voicePosts, id);
export const moduleById = (id?: string) => byId(learningModules, id);
export const quizById = (id?: string) => byId(quizzes, id);

export const statusLabel: Record<VerificationStatus, string> = {
  VERIFIED: "Scientifically verified",
  PARTIALLY_SUPPORTED: "Partially supported",
  UNVERIFIED: "Unverified",
  CONTRADICTED: "Contradicted",
  UNDER_REVIEW: "Under review",
};

export interface SearchResult {
  id: string;
  kind:
    | "Research"
    | "Expedition"
    | "Scientist"
    | "Dataset"
    | "Claim"
    | "Media"
    | "Learning"
    | "Fact"
    | "Voice";
  title: string;
  description: string;
  to: string;
  params?: Record<string, string>;
  nodeType?: NodeType;
}

export function searchAll(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const match = (...fields: (string | undefined)[]) =>
    fields.some((f) => f?.toLowerCase().includes(q));

  const results: SearchResult[] = [];

  research.forEach((r) => {
    if (match(r.title, r.abstract, r.researchArea, r.authors.join(" ")))
      results.push({
        id: r.id,
        kind: "Research",
        title: r.title,
        description: `${r.researchArea} · ${r.year} · ${r.institution}`,
        to: "/research/$researchId",
        params: { researchId: r.id },
        nodeType: "research",
      });
  });
  expeditions.forEach((e) => {
    if (match(e.name, e.description, e.region, e.location))
      results.push({
        id: e.id,
        kind: "Expedition",
        title: e.name,
        description: `${e.region} · ${e.year}`,
        to: "/expeditions/$expeditionId",
        params: { expeditionId: e.id },
        nodeType: "expedition",
      });
  });
  scientists.forEach((s) => {
    if (match(s.name, s.bio, s.institution, s.researchAreas.join(" ")))
      results.push({
        id: s.id,
        kind: "Scientist",
        title: s.name,
        description: s.institution,
        to: "/scientists/$scientistId",
        params: { scientistId: s.id },
        nodeType: "scientist",
      });
  });
  datasets.forEach((d) => {
    if (match(d.title, d.description, d.parameters.join(" "), d.location))
      results.push({
        id: d.id,
        kind: "Dataset",
        title: d.title,
        description: `${d.location} · ${d.timePeriod}`,
        to: "/datasets/$datasetId",
        params: { datasetId: d.id },
        nodeType: "dataset",
      });
  });
  claims.forEach((c) => {
    if (match(c.claimText, c.explanation))
      results.push({
        id: c.id,
        kind: "Claim",
        title: c.claimText,
        description: statusLabel[c.status],
        to: "/claims/$claimId",
        params: { claimId: c.id },
        nodeType: "claim",
      });
  });
  media.forEach((m) => {
    if (match(m.title, m.description, m.category))
      results.push({
        id: m.id,
        kind: "Media",
        title: m.title,
        description: `${m.type} · ${m.category}`,
        to: "/media",
        nodeType: "media",
      });
  });
  learningModules.forEach((m) => {
    if (match(m.title, m.description, m.category))
      results.push({
        id: m.id,
        kind: "Learning",
        title: m.title,
        description: m.description,
        to: "/learning/$moduleId",
        params: { moduleId: m.id },
        nodeType: "learning",
      });
  });
  facts.forEach((f) => {
    if (match(f.statement, f.category))
      results.push({
        id: f.id,
        kind: "Fact",
        title: f.statement,
        description: `${f.category} · ${statusLabel[f.status]}`,
        to: "/facts",
      });
  });
  voicePosts.forEach((v) => {
    if (match(v.title, v.content, v.type))
      results.push({
        id: v.id,
        kind: "Voice",
        title: v.title,
        description: `${v.type} · ${v.status}`,
        to: "/voices/$postId",
        params: { postId: v.id },
        nodeType: "community",
      });
  });

  return results;
}
