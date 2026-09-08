import type {
  ImportedPlaylistSource,
  ImportedTrackSource,
  Song,
  SongDuplicateCase,
  SongReviewTask,
} from "@/lib/music-tracker/types";

export interface ExportLibrarySnapshot {
  songs: Song[];
  playlists: ImportedPlaylistSource[];
  importedTracks: ImportedTrackSource[];
  duplicateCases: SongDuplicateCase[];
  reviewTasks: SongReviewTask[];
}

export interface ExportLibraryRequest {
  ownerId: string;
  format: "json" | "csv" | "excel";
  snapshot: ExportLibrarySnapshot;
}

export interface ExportLibraryResult {
  fileName: string;
  mimeType: string;
  content: string | Buffer;
}

export interface ExportLibraryPort {
  exportLibrary(request: ExportLibraryRequest): Promise<ExportLibraryResult>;
}
