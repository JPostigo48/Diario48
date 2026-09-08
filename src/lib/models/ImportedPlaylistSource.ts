import "server-only";
import mongoose, { Model, Schema } from "mongoose";
import type { MusicSourceProvider } from "@/lib/music-tracker/types";

const ImportedPlaylistSourceSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true, trim: true },
    provider: { type: String, required: true, trim: true },
    externalPlaylistId: { type: String, required: true, trim: true },
    originalName: { type: String, required: true, trim: true },
    sourceUrl: { type: String, default: "", trim: true },
    snapshotVersion: { type: String, default: "", trim: true },
    importedAt: { type: String, required: true, trim: true },
    itemCount: { type: Number, required: false },
    sourcePayload: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    collection: "music_tracker_playlist_sources_v1",
  },
);

ImportedPlaylistSourceSchema.index(
  { ownerId: 1, provider: 1, externalPlaylistId: 1, snapshotVersion: 1 },
  { unique: true },
);

export interface ImportedPlaylistSourceDocument extends mongoose.Document {
  ownerId: string;
  provider: MusicSourceProvider;
  externalPlaylistId: string;
  originalName: string;
  sourceUrl: string;
  snapshotVersion: string;
  importedAt: string;
  itemCount?: number;
  sourcePayload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ImportedPlaylistSourceModel =
  (mongoose.models.ImportedPlaylistSource as Model<ImportedPlaylistSourceDocument> | undefined) ??
  mongoose.model<ImportedPlaylistSourceDocument>(
    "ImportedPlaylistSource",
    ImportedPlaylistSourceSchema,
  );

export default ImportedPlaylistSourceModel;
