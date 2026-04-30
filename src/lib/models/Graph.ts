import "server-only";
import mongoose, { Model, Schema } from "mongoose";

const GraphNodeSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    heuristic: { type: Number, required: false },
  },
  { _id: false },
);

const GraphEdgeSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    source: { type: String, required: true, trim: true },
    target: { type: String, required: true, trim: true },
    weight: { type: Number, required: false },
  },
  { _id: false },
);

const GraphSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    isPublic: { type: Boolean, default: true },
    isDirected: { type: Boolean, default: false },
    nodes: { type: [GraphNodeSchema], required: true, default: [] },
    edges: { type: [GraphEdgeSchema], required: true, default: [] },
    startNode: { type: String, required: false, trim: true },
    goalNode: { type: String, required: false, trim: true },
  },
  {
    timestamps: true,
  },
);

export interface GraphDocument extends mongoose.Document {
  name: string;
  description?: string;
  isPublic: boolean;
  isDirected: boolean;
  nodes: {
    id: string;
    label: string;
    x: number;
    y: number;
    heuristic?: number;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    weight?: number;
  }[];
  startNode?: string;
  goalNode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GraphModel =
  (mongoose.models.Graph as Model<GraphDocument> | undefined) ??
  mongoose.model<GraphDocument>("Graph", GraphSchema);

export default GraphModel;
