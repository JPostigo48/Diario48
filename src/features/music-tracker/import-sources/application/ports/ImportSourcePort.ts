import type { MusicSourceProvider } from "@/lib/music-tracker/types";
import type { PlaylistSnapshotInput } from "@/features/music-tracker/import-sources/application/importPlaylistSnapshot";

export interface ImportPlaylistRequest {
  ownerId: string;
  provider: MusicSourceProvider;
  sourceRef: string;
}

export interface ImportableSourceSummary {
  provider: MusicSourceProvider;
  sourceRef: string;
  sourceKind: "liked-songs" | "playlist";
  externalPlaylistId: string;
  title: string;
  description: string;
  itemCount?: number;
  sourceUrl: string;
  thumbnails: Array<{ url: string; width?: number; height?: number }>;
  sourcePayload?: Record<string, unknown>;
}

export interface SearchableTrackSummary {
  provider: MusicSourceProvider;
  externalTrackId: string;
  title: string;
  artists: string[];
  artistDisplayName: string;
  albumName: string;
  durationText: string;
  sourceUrl: string;
  thumbnails: Array<{ url: string; width?: number; height?: number }>;
  sourcePayload?: Record<string, unknown>;
}

export interface ImportSourcePort {
  listSources(ownerId: string): Promise<ImportableSourceSummary[]>;
  searchTracks(ownerId: string, query: string, limit?: number): Promise<SearchableTrackSummary[]>;
  importPlaylist(request: ImportPlaylistRequest): Promise<PlaylistSnapshotInput>;
}
