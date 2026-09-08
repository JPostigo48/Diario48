import "server-only";
import mongoose, { Model, Schema } from "mongoose";

const ResearchWorkspaceRecordSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true, trim: true },
    visibility: {
      type: String,
      enum: ["private", "link-readonly"],
      default: "private",
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    createdAtText: { type: String, default: "" },
    updatedAtText: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "research_workspaces_v2",
  },
);

export interface ResearchWorkspaceRecordDocument extends mongoose.Document {
  ownerId: string;
  visibility: "private" | "link-readonly";
  name: string;
  description: string;
  createdAtText?: string;
  updatedAtText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResearchWorkspaceRecordModel =
  (mongoose.models.ResearchWorkspaceRecord as Model<ResearchWorkspaceRecordDocument> | undefined) ??
  mongoose.model<ResearchWorkspaceRecordDocument>(
    "ResearchWorkspaceRecord",
    ResearchWorkspaceRecordSchema,
  );

export default ResearchWorkspaceRecordModel;
