import "server-only";
import mongoose, { Model, Schema } from "mongoose";
import type {
  PaperAnalyticalClassification,
  PaperMetric,
  PaperPriority,
  PaperSelectionDecision,
  PaperSelectionEvaluation,
  PaperSynthesisPromotion,
  PaperSectionNode,
  PaperWorkflowStatus,
  ReadingStatus,
} from "@/lib/research/types";

const PaperMetricSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, default: "", trim: true },
    value: { type: String, default: "", trim: true },
    unit: { type: String, default: "", trim: true },
    observation: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const PaperSectionNodeSchema: Schema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, default: "", trim: true },
    level: { type: Number, default: 1 },
    notes: { type: String, default: "", trim: true },
    highlight: { type: Boolean, default: false },
    children: { type: [] as unknown as typeof Schema.Types.Mixed, default: [] },
  },
  { _id: false },
);

PaperSectionNodeSchema.add({
  children: { type: [PaperSectionNodeSchema], default: [] },
});

const SelectionCriterionSchema = new Schema(
  {
    criterionKey: { type: String, required: true, trim: true },
    score: { type: Number, default: 0 },
    comment: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const SelectionEvaluationSchema = new Schema(
  {
    criteria: { type: [SelectionCriterionSchema], default: [] },
    totalScore: { type: Number, default: 0 },
    maxScore: { type: Number, default: 25 },
    decision: { type: String, default: null, trim: true },
    overallComment: { type: String, default: "", trim: true },
    evaluatedAt: { type: String, default: "" },
  },
  { _id: false },
);

const SynthesisPromotionSchema = new Schema(
  {
    promotedAt: { type: String, required: true, trim: true },
    justification: { type: String, default: "", trim: true },
    sourceDecision: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const AnalyticalClassificationSchema = new Schema(
  {
    role: { type: String, default: null, trim: true },
    note: { type: String, default: "", trim: true },
    classifiedAt: { type: String, default: "" },
  },
  { _id: false },
);

const ResearchPaperRecordSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true, trim: true },
    workspaceId: { type: String, required: true, index: true },
    paperId: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    authors: { type: [String], default: [] },
    year: { type: Number, required: false },
    venue: { type: String, default: "", trim: true },
    doi: { type: String, default: "", trim: true },
    paperUrl: { type: String, default: "", trim: true },
    pdfUrl: { type: String, default: "", trim: true },
    abstract: { type: String, default: "", trim: true },
    personalSummary: { type: String, default: "", trim: true },
    keywords: { type: [String], default: [] },
    generalCategory: { type: String, default: "", trim: true },
    subcategory: { type: String, default: "", trim: true },
    layerIds: { type: [String], default: [] },
    objective: { type: String, default: "", trim: true },
    methods: { type: [String], default: [] },
    datasets: { type: [String], default: [] },
    performanceMetrics: { type: [PaperMetricSchema], default: [] },
    limitations: { type: [String], default: [] },
    futureChallenges: { type: [String], default: [] },
    researchUsefulness: { type: String, default: "", trim: true },
    personalNotes: { type: String, default: "", trim: true },
    structure: { type: [PaperSectionNodeSchema], default: [] },
    workflowStatus: { type: String, default: "registered", trim: true },
    selectionEvaluation: { type: SelectionEvaluationSchema, default: () => ({}) },
    synthesisPromotion: { type: SynthesisPromotionSchema, default: null },
    analyticalClassification: { type: AnalyticalClassificationSchema, default: () => ({}) },
    readingStatus: { type: String, default: "unread", trim: true },
    priority: { type: String, default: "medium", trim: true },
    createdAtText: { type: String, default: "" },
    updatedAtText: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "research_papers_v2",
  },
);

ResearchPaperRecordSchema.index({ workspaceId: 1, paperId: 1 }, { unique: true });

export interface ResearchPaperRecordDocument extends mongoose.Document {
  ownerId: string;
  workspaceId: string;
  paperId: string;
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
  workflowStatus: PaperWorkflowStatus;
  selectionEvaluation: PaperSelectionEvaluation & {
    decision: PaperSelectionDecision | null;
  };
  synthesisPromotion: PaperSynthesisPromotion | null;
  analyticalClassification: PaperAnalyticalClassification;
  readingStatus: ReadingStatus;
  priority: PaperPriority;
  createdAtText?: string;
  updatedAtText?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ResearchPaperRecordModel =
  (mongoose.models.ResearchPaperRecord as Model<ResearchPaperRecordDocument> | undefined) ??
  mongoose.model<ResearchPaperRecordDocument>("ResearchPaperRecord", ResearchPaperRecordSchema);

export default ResearchPaperRecordModel;
