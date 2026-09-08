import "server-only";
import mongoose, { Model, Schema } from "mongoose";

const ResearchLayerRecordSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true, trim: true },
    workspaceId: { type: String, required: true, index: true },
    layerId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
    description: { type: String, default: "", trim: true },
    createdAtText: { type: String, default: "" },
    updatedAtText: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "research_layers_v2",
  },
);

ResearchLayerRecordSchema.index({ workspaceId: 1, layerId: 1 }, { unique: true });

export interface ResearchLayerRecordDocument extends mongoose.Document {
  ownerId: string;
  workspaceId: string;
  layerId: string;
  name: string;
  order: number;
  description?: string;
  createdAtText?: string;
  updatedAtText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResearchLayerRecordModel =
  (mongoose.models.ResearchLayerRecord as Model<ResearchLayerRecordDocument> | undefined) ??
  mongoose.model<ResearchLayerRecordDocument>("ResearchLayerRecord", ResearchLayerRecordSchema);

export default ResearchLayerRecordModel;
