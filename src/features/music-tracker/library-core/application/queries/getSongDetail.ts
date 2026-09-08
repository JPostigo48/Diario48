import type {
  ImportedPlaylistSource,
  ImportedTrackSource,
  Song,
  SongDuplicateCase,
  SongPlaylistOccurrence,
  SongReviewTask,
} from "@/lib/music-tracker/types";
import type { SongRepositoryPort } from "@/features/music-tracker/library-core/application/ports/SongRepositoryPort";
import type { ImportedSourceRepositoryPort } from "@/features/music-tracker/import-sources/application/ports/ImportedSourceRepositoryPort";
import type { SongReviewTaskRepositoryPort } from "@/features/music-tracker/review-queue/application/ports/SongReviewTaskRepositoryPort";
import type { SongDuplicateCaseRepositoryPort } from "@/features/music-tracker/duplicate-detection/application/ports/DuplicateDetectionPort";

export interface SongDetail {
  song: Song;
  importedTracks: ImportedTrackSource[];
  occurrences: Array<
    SongPlaylistOccurrence & {
      playlist?: ImportedPlaylistSource | null;
    }
  >;
  reviewTasks: SongReviewTask[];
  duplicateCases: SongDuplicateCase[];
}

export async function getSongDetail(params: {
  ownerId: string;
  songId: string;
  songRepository: SongRepositoryPort;
  importedSourceRepository: ImportedSourceRepositoryPort;
  songReviewTaskRepository: SongReviewTaskRepositoryPort;
  duplicateCaseRepository: SongDuplicateCaseRepositoryPort;
}): Promise<SongDetail | null> {
  const {
    ownerId,
    songId,
    songRepository,
    importedSourceRepository,
    songReviewTaskRepository,
    duplicateCaseRepository,
  } = params;

  const song = await songRepository.getById(ownerId, songId);
  if (!song) {
    return null;
  }

  const [importedTracks, occurrences, playlists, reviewTasks, duplicateCases] = await Promise.all([
    importedSourceRepository.listTracks({ ownerId, songId }),
    importedSourceRepository.listOccurrences({ ownerId, songId }),
    importedSourceRepository.listPlaylists(ownerId),
    songReviewTaskRepository.list({ ownerId, songId }),
    duplicateCaseRepository.list(ownerId),
  ]);

  const playlistMap = new Map(playlists.map((playlist) => [playlist.id, playlist]));

  return {
    song,
    importedTracks,
    occurrences: occurrences.map((occurrence) => ({
      ...occurrence,
      playlist: occurrence.playlistSourceId
        ? (playlistMap.get(occurrence.playlistSourceId) ?? null)
        : null,
    })),
    reviewTasks,
    duplicateCases: duplicateCases.filter((duplicateCase) =>
      duplicateCase.candidateSongIds.includes(songId),
    ),
  };
}
