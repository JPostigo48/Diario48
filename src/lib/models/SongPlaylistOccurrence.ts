import "server-only";
import mongoose, { Model, Schema } from "mongoose";

const SongPlaylistOccurrenceSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true, trim: true },
    songId: { type: String, required: true, index: true, trim: true },
    playlistSourceId: { type: String, required: true, index: true, trim: true },
    importedTrackSourceId: { type: String, required: false, trim: true },
    occurrencesCount: { type: Number, default: 1, min: 1 },
    positions: { type: [Number], default: [] },
    duplicateWithinPlaylist: { type: Boolean, default: false },
    firstImportedAt: { type: String, default: "", trim: true },
    lastImportedAt: { type: String, default: "", trim: true },
  },
  {
    timestamps: true,
    collection: "music_tracker_song_playlist_occurrences_v1",
  },
);

SongPlaylistOccurrenceSchema.index({ ownerId: 1, songId: 1, playlistSourceId: 1 }, { unique: true });

export interface SongPlaylistOccurrenceDocument extends mongoose.Document {
  ownerId: string;
  songId: string;
  playlistSourceId: string;
  importedTrackSourceId?: string;
  occurrencesCount: number;
  positions: number[];
  duplicateWithinPlaylist: boolean;
  firstImportedAt?: string;
  lastImportedAt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SongPlaylistOccurrenceModel =
  (mongoose.models.SongPlaylistOccurrence as Model<SongPlaylistOccurrenceDocument> | undefined) ??
  mongoose.model<SongPlaylistOccurrenceDocument>(
    "SongPlaylistOccurrence",
    SongPlaylistOccurrenceSchema,
  );

export default SongPlaylistOccurrenceModel;
