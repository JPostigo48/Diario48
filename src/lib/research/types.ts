export type ReadingStatus = "unread" | "partial" | "read";

export type PaperPriority = "high" | "medium" | "low";

export type PaperWorkflowStatus =
  | "registered"
  | "screening"
  | "selected"
  | "discarded"
  | "contextual"
  | "promoted-to-synthesis";

export type PaperSelectionCriterionKey =
  | "topic-relevance"
  | "source-quality"
  | "recency"
  | "reproducibility"
  | "project-utility";

export type PaperSelectionDecision =
  | "discarded"
  | "contextual"
  | "selected"
  | "promoted-to-synthesis";

export interface PaperSelectionCriterionEvaluation {
  criterionKey: PaperSelectionCriterionKey;
  score: number;
  comment: string;
}

export interface PaperSelectionEvaluation {
  criteria: PaperSelectionCriterionEvaluation[];
  totalScore: number;
  maxScore: number;
  decision: PaperSelectionDecision | null;
  overallComment: string;
  evaluatedAt?: string;
}

export interface PaperSynthesisPromotion {
  promotedAt: string;
  justification: string;
  sourceDecision: PaperSelectionDecision;
}

export type PaperAnalyticalRole =
  | "core"
  | "methodological"
  | "context"
  | "frontier"
  | "seminal"
  | "benchmark"
  | "bridge"
  | "pivot";

export interface PaperAnalyticalClassification {
  role: PaperAnalyticalRole | null;
  note: string;
  classifiedAt?: string;
}

export type PaperRelationType =
  | "extends"
  | "critiques"
  | "same-dataset"
  | "compares-with"
  | "same-problem"
  | "base-paper"
  | "derived-paper";

export interface ResearchProject {
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResearchLayer {
  id: string;
  name: string;
  order: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaperMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  observation: string;
}

export interface PaperSectionNode {
  id: string;
  title: string;
  level: number;
  notes: string;
  highlight: boolean;
  children: PaperSectionNode[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  year?: number;
  venue: string;
  doi: string;
  paperUrl: string;
  pdfUrl: string;
  abstract: string;
  personalSummary: string;
  keywords: string[];
  generalCategory: string;
  subcategory: string;
  layerIds: string[];
  objective: string;
  methods: string[];
  datasets: string[];
  performanceMetrics: PaperMetric[];
  limitations: string[];
  futureChallenges: string[];
  researchUsefulness: string;
  personalNotes: string;
  structure: PaperSectionNode[];
  readingStatus: ReadingStatus;
  priority: PaperPriority;
  workflowStatus: PaperWorkflowStatus;
  selectionEvaluation: PaperSelectionEvaluation;
  synthesisPromotion: PaperSynthesisPromotion | null;
  analyticalClassification: PaperAnalyticalClassification;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaperRelation {
  id: string;
  fromPaperId: string;
  toPaperId: string;
  type: PaperRelationType;
  note?: string;
}

export interface ResearchWorkspace {
  id?: string;
  visibility?: "private" | "link-readonly";
  project: ResearchProject;
  layers: ResearchLayer[];
  papers: ResearchPaper[];
  relations: PaperRelation[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ResearchWorkspaceListItem {
  id: string;
  name: string;
  description: string;
  visibility?: "private" | "link-readonly";
  paperCount: number;
  layerCount: number;
  updatedAt?: string;
}
