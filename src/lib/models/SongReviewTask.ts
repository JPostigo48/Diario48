import "server-only";
import mongoose, { Model, Schema } from "mongoose";
import type {
  SongReviewTaskAction,
  SongReviewTaskPriority,
  SongReviewTaskStatus,
} from "@/lib/music-tracker/types";

const SongReviewTaskSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true, trim: true },
    songId: { type: String, required: true, index: true, trim: true },
    importedTrackSourceId: { type: String, required: false, trim: true },
    duplicateCaseId: { type: String, required: false, trim: true },
    reason: { type: String, required: true, trim: true },
    action: {
      type: String,
      enum: [
        "confirm-metadata",
        "review-title",
        "review-artist",
        "review-duplicate",
        "assign-tags",
        "assign-mood",
        "assign-usage",
        "assign-playlist",
        "general-review",
      ],
      default: "general-review",
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "ignored"],
      default: "pending",
      trim: true,
    },
    notes: { type: String, default: "", trim: true },
  },
  {
    timestamps: true,
    collection: "music_tracker_song_review_tasks_v1",
  },
);

SongReviewTaskSchema.index({ ownerId: 1, status: 1, priority: 1, updatedAt: -1 });

export interface SongReviewTaskDocument extends mongoose.Document {
  ownerId: string;
  songId: string;
  importedTrackSourceId?: string;
  duplicateCaseId?: string;
  reason: string;
  action: SongReviewTaskAction;
  priority: SongReviewTaskPriority;
  status: SongReviewTaskStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const SongReviewTaskModel =
  (mongoose.models.SongReviewTask as Model<SongReviewTaskDocument> | undefined) ??
  mongoose.model<SongReviewTaskDocument>("SongReviewTask", SongReviewTaskSchema);

export default SongReviewTaskModel;
