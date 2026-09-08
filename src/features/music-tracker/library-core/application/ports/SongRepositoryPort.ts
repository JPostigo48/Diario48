import type { MusicSourceProvider, Song } from "@/lib/music-tracker/types";

export interface ListSongsQuery {
  ownerId: string;
  organizationState?: Song["organizationState"];
  reviewState?: Song["reviewState"];
  metadataConfidence?: Song["metadataConfidence"];
  duplicateStatus?: Song["duplicateStatus"];
  searchText?: string;
}

export interface SaveSongInput {
  ownerId: string;
  song: Song;
}

export interface SongRepositoryPort {
  getById(ownerId: string, songId: string): Promise<Song | null>;
  findByExternalTrack(
    ownerId: string,
    provider: MusicSourceProvider,
    externalTrackId: string,
  ): Promise<Song | null>;
  findBySourceUrl(ownerId: string, sourceUrl: string): Promise<Song | null>;
  findByCanonicalIdentity(
    ownerId: string,
    canonicalTitle: string,
    canonicalArtist: string,
  ): Promise<Song | null>;
  list(query: ListSongsQuery): Promise<Song[]>;
  save(input: SaveSongInput): Promise<Song>;
}
