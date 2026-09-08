import "server-only";
import mongoose, { Model, Schema } from "mongoose";
import type { PaperMetric, PaperSectionNode } from "@/lib/research/types";

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

const ResearchPaperCatalogRecordSchema = new Schema(
  {
    normalizedDoi: { type: String, trim: true, index: true, sparse: true },
    title: { type: String, required: true, trim: true },
    authors: { type: [String], default: [] },
    year: { type: Number, required: false },
    venue: { type: String, default: "", trim: true },
    doi: { type: String, default: "", trim: true },
    paperUrl: { type: String, default: "", trim: true },
    pdfUrl: { type: String, default: "", trim: true },
    abstract: { type: String, default: "", trim: true },
    keywords: { type: [String], default: [] },
    generalCategory: { type: String, default: "", trim: true },
    subcategory: { type: String, default: "", trim: true },
    objective: { type: String, default: "", trim: true },
    methods: { type: [String], default: [] },
    datasets: { type: [String], default: [] },
    performanceMetrics: { type: [PaperMetricSchema], default: [] },
    limitations: { type: [String], default: [] },
    futureChallenges: { type: [String], default: [] },
    structure: { type: [PaperSectionNodeSchema], default: [] },
    createdAtText: { type: String, default: "" },
    updatedAtText: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "research_paper_catalog_v1",
  },
);

ResearchPaperCatalogRecordSchema.index(
  { normalizedDoi: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { normalizedDoi: { $type: "string", $ne: "" } },
  },
);

export interface ResearchPaperCatalogRecordDocument extends mongoose.Document {
  normalizedDoi?: string;
  title: string;
  authors: string[];
  year?: number;
  venue: string;
  doi: string;
  paperUrl: string;
  pdfUrl: string;
  abstract: string;
  keywords: string[];
  generalCategory: string;
  subcategory: string;
  objective: string;
  methods: string[];
  datasets: string[];
  performanceMetrics: PaperMetric[];
  limitations: string[];
  futureChallenges: string[];
  structure: PaperSectionNode[];
  createdAtText?: string;
  updatedAtText?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ResearchPaperCatalogRecordModel =
  (mongoose.models.ResearchPaperCatalogRecord as
    | Model<ResearchPaperCatalogRecordDocument>
    | undefined) ??
  mongoose.model<ResearchPaperCatalogRecordDocument>(
    "ResearchPaperCatalogRecord",
    ResearchPaperCatalogRecordSchema,
  );

export default ResearchPaperCatalogRecordModel;
