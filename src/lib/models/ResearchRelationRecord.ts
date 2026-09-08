import "server-only";
import mongoose, { Model, Schema } from "mongoose";
import type { PaperRelationType } from "@/lib/research/types";

const ResearchRelationRecordSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true, trim: true },
    workspaceId: { type: String, required: true, index: true },
    relationId: { type: String, required: true, trim: true },
    fromPaperId: { type: String, required: true, trim: true },
    toPaperId: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    note: { type: String, default: "", trim: true },
  },
  {
    timestamps: true,
    collection: "research_relations_v2",
  },
);

ResearchRelationRecordSchema.index({ workspaceId: 1, relationId: 1 }, { unique: true });

export interface ResearchRelationRecordDocument extends mongoose.Document {
  ownerId: string;
  workspaceId: string;
  relationId: string;
  fromPaperId: string;
  toPaperId: string;
  type: PaperRelationType;
  note?: string;
}

const ResearchRelationRecordModel =
  (mongoose.models.ResearchRelationRecord as Model<ResearchRelationRecordDocument> | undefined) ??
  mongoose.model<ResearchRelationRecordDocument>("ResearchRelationRecord", ResearchRelationRecordSchema);

export default ResearchRelationRecordModel;
