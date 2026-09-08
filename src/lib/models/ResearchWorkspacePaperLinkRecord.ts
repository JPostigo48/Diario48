import "server-only";
import mongoose, { Model, Schema } from "mongoose";
import type {
  PaperAnalyticalClassification,
  PaperPriority,
  PaperSelectionDecision,
  PaperSelectionEvaluation,
  PaperSynthesisPromotion,
  PaperWorkflowStatus,
  ReadingStatus,
} from "@/lib/research/types";

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

const ResearchWorkspacePaperLinkRecordSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true, trim: true },
    workspaceId: { type: String, required: true, index: true },
    paperId: { type: String, required: true, trim: true },
    paperRefId: { type: String, required: true, trim: true, index: true },
    layerIds: { type: [String], default: [] },
    personalSummary: { type: String, default: "", trim: true },
    researchUsefulness: { type: String, default: "", trim: true },
    personalNotes: { type: String, default: "", trim: true },
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
    collection: "research_workspace_paper_links_v1",
  },
);

ResearchWorkspacePaperLinkRecordSchema.index(
  { workspaceId: 1, paperId: 1 },
  { unique: true },
);

export interface ResearchWorkspacePaperLinkRecordDocument extends mongoose.Document {
  ownerId: string;
  workspaceId: string;
  paperId: string;
  paperRefId: string;
  layerIds: string[];
  personalSummary: string;
  researchUsefulness: string;
  personalNotes: string;
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

const ResearchWorkspacePaperLinkRecordModel =
  (mongoose.models.ResearchWorkspacePaperLinkRecord as
    | Model<ResearchWorkspacePaperLinkRecordDocument>
    | undefined) ??
  mongoose.model<ResearchWorkspacePaperLinkRecordDocument>(
    "ResearchWorkspacePaperLinkRecord",
    ResearchWorkspacePaperLinkRecordSchema,
  );

export default ResearchWorkspacePaperLinkRecordModel;
