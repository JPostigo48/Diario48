import type {
  ImportedPlaylistSource,
  ImportedTrackSource,
  MusicSourceProvider,
  SongPlaylistOccurrence,
} from "@/lib/music-tracker/types";

export interface SaveImportedPlaylistInput {
  ownerId: string;
  playlist: ImportedPlaylistSource;
}

export interface SaveImportedTrackInput {
  ownerId: string;
  track: ImportedTrackSource;
}

export interface SaveSongPlaylistOccurrenceInput {
  ownerId: string;
  occurrence: SongPlaylistOccurrence;
}

export interface ImportedTrackQuery {
  ownerId: string;
  songId?: string;
  playlistSourceId?: string;
}

export interface SongPlaylistOccurrenceQuery {
  ownerId: string;
  songId?: string;
  playlistSourceId?: string;
}

export interface ImportedSourceRepositoryPort {
  savePlaylist(input: SaveImportedPlaylistInput): Promise<ImportedPlaylistSource>;
  saveTrack(input: SaveImportedTrackInput): Promise<ImportedTrackSource>;
  saveOccurrence(input: SaveSongPlaylistOccurrenceInput): Promise<SongPlaylistOccurrence>;
  listPlaylists(ownerId: string): Promise<ImportedPlaylistSource[]>;
  listTracks(query: ImportedTrackQuery): Promise<ImportedTrackSource[]>;
  listOccurrences(query: SongPlaylistOccurrenceQuery): Promise<SongPlaylistOccurrence[]>;
  findOccurrenceBySongAndPlaylist(
    ownerId: string,
    songId: string,
    playlistSourceId: string,
  ): Promise<SongPlaylistOccurrence | null>;
  findPlaylistByExternalRef(
    ownerId: string,
    provider: MusicSourceProvider,
    externalPlaylistId: string,
  ): Promise<ImportedPlaylistSource | null>;
  findTrackByExternalRef(
    ownerId: string,
    provider: MusicSourceProvider,
    externalTrackId: string,
    playlistSourceId?: string,
  ): Promise<ImportedTrackSource | null>;
}
