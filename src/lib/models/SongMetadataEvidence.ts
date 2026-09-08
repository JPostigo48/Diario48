import "server-only";
import mongoose, { Model, Schema } from "mongoose";
import type { MusicSourceProvider, SongMetadataConfidence } from "@/lib/music-tracker/types";

const SongMetadataEvidenceSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true, trim: true },
    songId: { type: String, required: true, index: true, trim: true },
    provider: { type: String, required: true, trim: true },
    suggestedTitle: { type: String, default: "", trim: true },
    suggestedArtist: { type: String, default: "", trim: true },
    suggestedAlbum: { type: String, default: "", trim: true },
    suggestedYear: { type: Number, required: false },
    suggestedGenres: { type: [String], default: [] },
    suggestedTags: { type: [String], default: [] },
    suggestedMoods: { type: [String], default: [] },
    confidence: {
      type: String,
      enum: [
        "metadata-reliable",
        "metadata-probable",
        "metadata-doubtful",
        "metadata-not-found",
      ],
      default: "metadata-doubtful",
      trim: true,
    },
    acceptedFields: { type: [String], default: [] },
    rejectedFields: { type: [String], default: [] },
    collectedAt: { type: String, required: true, trim: true },
    sourcePayload: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    collection: "music_tracker_song_metadata_evidence_v1",
  },
);

SongMetadataEvidenceSchema.index({ ownerId: 1, songId: 1, provider: 1, collectedAt: 1 });

export interface SongMetadataEvidenceDocument extends mongoose.Document {
  ownerId: string;
  songId: string;
  provider: MusicSourceProvider;
  suggestedTitle: string;
  suggestedArtist: string;
  suggestedAlbum: string;
  suggestedYear?: number;
  suggestedGenres: string[];
  suggestedTags: string[];
  suggestedMoods: string[];
  confidence: SongMetadataConfidence;
  acceptedFields: string[];
  rejectedFields: string[];
  collectedAt: string;
  sourcePayload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const SongMetadataEvidenceModel =
  (mongoose.models.SongMetadataEvidence as Model<SongMetadataEvidenceDocument> | undefined) ??
  mongoose.model<SongMetadataEvidenceDocument>(
    "SongMetadataEvidence",
    SongMetadataEvidenceSchema,
  );

export default SongMetadataEvidenceModel;
