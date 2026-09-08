import "server-only";
import mongoose, { Model, Schema } from "mongoose";
import type { SongDuplicateStatus } from "@/lib/music-tracker/types";

const SongDuplicateCaseSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true, trim: true },
    primarySongId: { type: String, required: false, trim: true },
    candidateSongIds: { type: [String], required: true, default: [] },
    status: {
      type: String,
      enum: [
        "possible-duplicate",
        "confirmed-duplicate",
        "not-duplicate",
        "merged",
        "pending-duplicate-review",
      ],
      default: "possible-duplicate",
      trim: true,
    },
    suspicionScore: { type: Number, default: 0, min: 0, max: 1 },
    reasons: { type: [String], default: [] },
    decisionNotes: { type: String, default: "", trim: true },
    mergedIntoSongId: { type: String, required: false, trim: true },
    resolvedByUserId: { type: String, required: false, trim: true },
    resolvedAt: { type: String, default: "", trim: true },
  },
  {
    timestamps: true,
    collection: "music_tracker_song_duplicate_cases_v1",
  },
);

SongDuplicateCaseSchema.index({ ownerId: 1, status: 1, updatedAt: -1 });

export interface SongDuplicateCaseDocument extends mongoose.Document {
  ownerId: string;
  primarySongId?: string;
  candidateSongIds: string[];
  status: SongDuplicateStatus;
  suspicionScore: number;
  reasons: string[];
  decisionNotes: string;
  mergedIntoSongId?: string;
  resolvedByUserId?: string;
  resolvedAt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SongDuplicateCaseModel =
  (mongoose.models.SongDuplicateCase as Model<SongDuplicateCaseDocument> | undefined) ??
  mongoose.model<SongDuplicateCaseDocument>("SongDuplicateCase", SongDuplicateCaseSchema);

export default SongDuplicateCaseModel;
