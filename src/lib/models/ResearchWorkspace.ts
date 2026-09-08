import "server-only";
import mongoose, { Schema } from "mongoose";

const ResearchProjectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    createdAt: { type: String, default: "" },
    updatedAt: { type: String, default: "" },
  },
  { _id: false },
);

const ResearchLayerSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
    description: { type: String, default: "", trim: true },
    createdAt: { type: String, default: "" },
    updatedAt: { type: String, default: "" },
  },
  { _id: false },
);

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

const ResearchPaperSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
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
    readingStatus: { type: String, default: "unread", trim: true },
    priority: { type: String, default: "medium", trim: true },
    createdAt: { type: String, default: "" },
    updatedAt: { type: String, default: "" },
  },
  { _id: false },
);

const PaperRelationSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    fromPaperId: { type: String, required: true, trim: true },
    toPaperId: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    note: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const ResearchWorkspaceSchema = new Schema(
  {
    ownerId: { type: String, default: "", trim: true, index: true },
    visibility: {
      type: String,
      enum: ["private", "link-readonly"],
      default: "private",
      trim: true,
    },
    project: { type: ResearchProjectSchema, required: true },
    layers: { type: [ResearchLayerSchema], default: [] },
    papers: { type: [ResearchPaperSchema], default: [] },
    relations: { type: [PaperRelationSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

export interface ResearchWorkspaceDocument extends mongoose.Document {
  ownerId?: string;
  visibility?: "private" | "link-readonly";
  project: {
    name: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
  };
  layers: Array<{
    id: string;
    name: string;
    order: number;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  papers: Array<{
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
    performanceMetrics: Array<{
      id: string;
      name: string;
      value: string;
      unit: string;
      observation: string;
    }>;
    limitations: string[];
    futureChallenges: string[];
    researchUsefulness: string;
    personalNotes: string;
    structure: Array<{
      id: string;
      title: string;
      level: number;
      notes: string;
      highlight: boolean;
      children: unknown[];
    }>;
    readingStatus: string;
    priority: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  relations: Array<{
    id: string;
    fromPaperId: string;
    toPaperId: string;
    type: string;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

if (mongoose.models.ResearchWorkspace) {
  delete mongoose.models.ResearchWorkspace;
}

const ResearchWorkspaceModel = mongoose.model<ResearchWorkspaceDocument>(
  "ResearchWorkspace",
  ResearchWorkspaceSchema,
);

export default ResearchWorkspaceModel;
