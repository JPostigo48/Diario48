import {
  createEmptyImportedPlaylistSource,
  createEmptyImportedTrackSource,
} from "@/lib/music-tracker/defaults";
import type {
  ImportedPlaylistSource,
  ImportedTrackSource,
  MusicSourceProvider,
  Song,
} from "@/lib/music-tracker/types";
import type { ImportedSourceRepositoryPort } from "@/features/music-tracker/import-sources/application/ports/ImportedSourceRepositoryPort";
import type { SongRepositoryPort } from "@/features/music-tracker/library-core/application/ports/SongRepositoryPort";
import type { SongReviewTaskRepositoryPort } from "@/features/music-tracker/review-queue/application/ports/SongReviewTaskRepositoryPort";
import { consolidateImportedTrack } from "@/features/music-tracker/import-sources/application/consolidateImportedTrack";
import {
  normalizeImportedTrack,
  type NormalizedImportedTrack,
} from "@/features/music-tracker/title-normalization/application/normalizeImportedTrack";

export interface PlaylistTrackSnapshotInput {
  externalTrackId: string;
  originalUrl: string;
  originalTitle: string;
  originalVisibleArtist?: string;
  originalChannelName?: string;
  playlistPosition?: number;
  sourcePayload?: Record<string, unknown>;
}

export interface PlaylistSnapshotInput {
  provider: MusicSourceProvider;
  externalPlaylistId: string;
  originalName: string;
  sourceUrl?: string;
  snapshotVersion?: string;
  importedAt?: string;
  sourcePayload?: Record<string, unknown>;
  tracks: PlaylistTrackSnapshotInput[];
}

export interface ImportPlaylistSnapshotDependencies {
  songRepository: SongRepositoryPort;
  importedSourceRepository: ImportedSourceRepositoryPort;
  songReviewTaskRepository: SongReviewTaskRepositoryPort;
}

export interface ImportedPlaylistSnapshotResult {
  playlist: ImportedPlaylistSource;
  songs: Song[];
  importedTracks: ImportedTrackSource[];
}

export async function importPlaylistSnapshot(params: {
  ownerId: string;
  snapshot: PlaylistSnapshotInput;
  dependencies: ImportPlaylistSnapshotDependencies;
}): Promise<ImportedPlaylistSnapshotResult> {
  const { ownerId, snapshot, dependencies } = params;

  const importedAt = snapshot.importedAt || new Date().toISOString();

  const existingPlaylist = await dependencies.importedSourceRepository.findPlaylistByExternalRef(
    ownerId,
    snapshot.provider,
    snapshot.externalPlaylistId,
  );

  const playlist = await dependencies.importedSourceRepository.savePlaylist({
    ownerId,
    playlist: {
      ...createEmptyImportedPlaylistSource(),
      id: existingPlaylist?.id,
      provider: snapshot.provider,
      externalPlaylistId: snapshot.externalPlaylistId,
      originalName: snapshot.originalName,
      sourceUrl: snapshot.sourceUrl ?? "",
      snapshotVersion: snapshot.snapshotVersion ?? "",
      importedAt,
      itemCount: snapshot.tracks.length,
      sourcePayload: snapshot.sourcePayload ?? {},
    },
  });

  const songs: Song[] = [];
  const importedTracks: ImportedTrackSource[] = [];

  for (const trackSnapshot of snapshot.tracks) {
    const normalized = normalizeImportedTrack({
      originalTitle: trackSnapshot.originalTitle,
      originalVisibleArtist: trackSnapshot.originalVisibleArtist ?? "",
      originalChannelName: trackSnapshot.originalChannelName ?? "",
    });

    const existingTrack = await dependencies.importedSourceRepository.findTrackByExternalRef(
      ownerId,
      snapshot.provider,
      trackSnapshot.externalTrackId,
      playlist.id,
    );

    const importedTrack = await dependencies.importedSourceRepository.saveTrack({
      ownerId,
      track: buildImportedTrack({
        id: existingTrack?.id,
        existingSongId: existingTrack?.songId,
        playlistSourceId: playlist.id,
        provider: snapshot.provider,
        importedAt,
        trackSnapshot,
        normalized,
      }),
    });

    const { song, track: linkedTrack } = await consolidateImportedTrack({
      ownerId,
      track: importedTrack,
      playlistSourceId: playlist.id ?? "",
      importedSourceRepository: dependencies.importedSourceRepository,
      songRepository: dependencies.songRepository,
      songReviewTaskRepository: dependencies.songReviewTaskRepository,
    });

    songs.push(song);
    importedTracks.push(linkedTrack);
  }

  return {
    playlist,
    songs,
    importedTracks,
  };
}

function buildImportedTrack(params: {
  id?: string;
  existingSongId?: string;
  playlistSourceId?: string;
  provider: MusicSourceProvider;
  importedAt: string;
  trackSnapshot: PlaylistTrackSnapshotInput;
  normalized: NormalizedImportedTrack;
}): ImportedTrackSource {
  const { playlistSourceId, provider, importedAt, trackSnapshot, normalized } = params;

  return {
    ...createEmptyImportedTrackSource(),
    id: params.id,
    provider,
    playlistSourceId,
    songId: params.existingSongId,
    externalTrackId: trackSnapshot.externalTrackId,
    originalUrl: trackSnapshot.originalUrl,
    originalTitle: trackSnapshot.originalTitle,
    originalVisibleArtist: trackSnapshot.originalVisibleArtist ?? "",
    originalChannelName: trackSnapshot.originalChannelName ?? "",
    playlistPosition: trackSnapshot.playlistPosition,
    importedAt,
    sourcePayload: trackSnapshot.sourcePayload ?? {},
    normalizedTitle: normalized.normalizedTitle,
    normalizedArtist: normalized.normalizedArtist,
  };
}
