import {
  createEmptyImportedTrackSource,
} from "@/lib/music-tracker/defaults";
import type { ImportedTrackSource } from "@/lib/music-tracker/types";
import { consolidateImportedTrack } from "@/features/music-tracker/import-sources/application/consolidateImportedTrack";
import type {
  ImportedSourceRepositoryPort,
} from "@/features/music-tracker/import-sources/application/ports/ImportedSourceRepositoryPort";
import type {
  SearchableTrackSummary,
} from "@/features/music-tracker/import-sources/application/ports/ImportSourcePort";
import type { SongRepositoryPort } from "@/features/music-tracker/library-core/application/ports/SongRepositoryPort";
import type { SongReviewTaskRepositoryPort } from "@/features/music-tracker/review-queue/application/ports/SongReviewTaskRepositoryPort";
import { normalizeImportedTrack } from "@/features/music-tracker/title-normalization/application/normalizeImportedTrack";

export async function importSingleTrackFromSource(params: {
  ownerId: string;
  track: SearchableTrackSummary;
  importedSourceRepository: ImportedSourceRepositoryPort;
  songRepository: SongRepositoryPort;
  songReviewTaskRepository: SongReviewTaskRepositoryPort;
}) {
  const normalized = normalizeImportedTrack({
    originalTitle: params.track.title,
    originalVisibleArtist: params.track.artistDisplayName,
    originalChannelName: params.track.artists[0] ?? "",
  });

  const existingTrack = await params.importedSourceRepository.findTrackByExternalRef(
    params.ownerId,
    params.track.provider,
    params.track.externalTrackId,
  );

  const importedTrack: ImportedTrackSource = await params.importedSourceRepository.saveTrack({
    ownerId: params.ownerId,
    track: {
      ...createEmptyImportedTrackSource(),
      id: existingTrack?.id,
      provider: params.track.provider,
      songId: existingTrack?.songId,
      externalTrackId: params.track.externalTrackId,
      originalUrl: params.track.sourceUrl,
      originalTitle: params.track.title,
      originalVisibleArtist: params.track.artistDisplayName,
      originalChannelName: params.track.artists[0] ?? "",
      importedAt: new Date().toISOString(),
      sourcePayload: {
        albumName: params.track.albumName,
        durationText: params.track.durationText,
        thumbnails: params.track.thumbnails,
        provider: params.track.sourcePayload ?? {},
      },
      normalizedTitle: normalized.normalizedTitle,
      normalizedArtist: normalized.normalizedArtist,
    },
  });

  return consolidateImportedTrack({
    ownerId: params.ownerId,
    track: importedTrack,
    importedSourceRepository: params.importedSourceRepository,
    songRepository: params.songRepository,
    songReviewTaskRepository: params.songReviewTaskRepository,
  });
}
