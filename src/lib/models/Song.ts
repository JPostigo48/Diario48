import "server-only";
import mongoose, { Model, Schema } from "mongoose";
import type {
  MusicSourceProvider,
  SongDuplicateStatus,
  SongMetadataConfidence,
  SongOrganizationState,
  SongReviewState,
} from "@/lib/music-tracker/types";

const SongExternalLinkSchema = new Schema(
  {
    provider: { type: String, required: true, trim: true },
    externalId: { type: String, default: "", trim: true },
    url: { type: String, required: true, trim: true },
    label: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const SongTagSetSchema = new Schema(
  {
    automaticTags: { type: [String], default: [] },
    personalTags: { type: [String], default: [] },
    automaticGenres: { type: [String], default: [] },
    automaticMoods: { type: [String], default: [] },
    personalMoods: { type: [String], default: [] },
    personalUses: { type: [String], default: [] },
  },
  { _id: false },
);

const SongSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true, trim: true },
    canonicalTitle: { type: String, required: true, trim: true },
    canonicalArtist: { type: String, required: true, trim: true },
    manualTitle: { type: String, default: "", trim: true },
    manualArtist: { type: String, default: "", trim: true },
    album: { type: String, default: "", trim: true },
    year: { type: Number, required: false },
    rating: { type: Number, required: false, min: 1, max: 5 },
    personalNote: { type: String, default: "", trim: true },
    isRealFavorite: { type: Boolean, default: false },
    organizationState: {
      type: String,
      enum: ["imported", "needs-review", "clean", "enriched", "classified", "archived", "discarded"],
      default: "imported",
      trim: true,
    },
    reviewState: {
      type: String,
      enum: ["pending", "in-review", "reviewed", "ignored"],
      default: "pending",
      trim: true,
    },
    metadataConfidence: {
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
    duplicateStatus: {
      type: String,
      enum: [
        "possible-duplicate",
        "confirmed-duplicate",
        "not-duplicate",
        "merged",
        "pending-duplicate-review",
      ],
      default: "not-duplicate",
      trim: true,
    },
    externalLinks: { type: [SongExternalLinkSchema], default: [] },
    tags: {
      type: SongTagSetSchema,
      default: () => ({
        automaticTags: [],
        personalTags: [],
        automaticGenres: [],
        automaticMoods: [],
        personalMoods: [],
        personalUses: [],
      }),
    },
  },
  {
    timestamps: true,
    collection: "music_tracker_songs_v1",
  },
);

SongSchema.index({ ownerId: 1, canonicalTitle: 1, canonicalArtist: 1 });

export interface SongDocument extends mongoose.Document {
  ownerId: string;
  canonicalTitle: string;
  canonicalArtist: string;
  manualTitle: string;
  manualArtist: string;
  album: string;
  year?: number;
  rating?: number;
  personalNote: string;
  isRealFavorite: boolean;
  organizationState: SongOrganizationState;
  reviewState: SongReviewState;
  metadataConfidence: SongMetadataConfidence;
  duplicateStatus: SongDuplicateStatus;
  externalLinks: Array<{
    provider: MusicSourceProvider;
    externalId?: string;
    url: string;
    label?: string;
  }>;
  tags: {
    automaticTags: string[];
    personalTags: string[];
    automaticGenres: string[];
    automaticMoods: string[];
    personalMoods: string[];
    personalUses: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const SongModel =
  (mongoose.models.Song as Model<SongDocument> | undefined) ??
  mongoose.model<SongDocument>("Song", SongSchema);

export default SongModel;
