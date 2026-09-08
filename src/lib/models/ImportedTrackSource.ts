import "server-only";
import mongoose, { Model, Schema } from "mongoose";
import type { MusicSourceProvider } from "@/lib/music-tracker/types";

const ImportedTrackSourceSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true, trim: true },
    provider: { type: String, required: true, trim: true },
    playlistSourceId: { type: String, required: false, index: true, trim: true },
    songId: { type: String, required: false, index: true, trim: true },
    externalTrackId: { type: String, required: true, trim: true },
    originalUrl: { type: String, default: "", trim: true },
    originalTitle: { type: String, required: true, trim: true },
    originalVisibleArtist: { type: String, default: "", trim: true },
    originalChannelName: { type: String, default: "", trim: true },
    playlistPosition: { type: Number, required: false },
    importedAt: { type: String, required: true, trim: true },
    sourcePayload: { type: Schema.Types.Mixed, default: {} },
    normalizedTitle: { type: String, default: "", trim: true },
    normalizedArtist: { type: String, default: "", trim: true },
  },
  {
    timestamps: true,
    collection: "music_tracker_track_sources_v1",
  },
);

ImportedTrackSourceSchema.index(
  { ownerId: 1, provider: 1, externalTrackId: 1, playlistSourceId: 1 },
  { unique: true },
);

export interface ImportedTrackSourceDocument extends mongoose.Document {
  ownerId: string;
  provider: MusicSourceProvider;
  playlistSourceId?: string;
  songId?: string;
  externalTrackId: string;
  originalUrl: string;
  originalTitle: string;
  originalVisibleArtist: string;
  originalChannelName: string;
  playlistPosition?: number;
  importedAt: string;
  sourcePayload?: Record<string, unknown>;
  normalizedTitle: string;
  normalizedArtist: string;
  createdAt: Date;
  updatedAt: Date;
}

const ImportedTrackSourceModel =
  (mongoose.models.ImportedTrackSource as Model<ImportedTrackSourceDocument> | undefined) ??
  mongoose.model<ImportedTrackSourceDocument>("ImportedTrackSource", ImportedTrackSourceSchema);

export default ImportedTrackSourceModel;
