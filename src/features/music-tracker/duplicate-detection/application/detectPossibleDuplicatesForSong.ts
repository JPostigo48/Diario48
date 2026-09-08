import { createEmptySongDuplicateCase } from "@/lib/music-tracker/defaults";
import type { Song, SongDuplicateCase } from "@/lib/music-tracker/types";
import type { SongRepositoryPort } from "@/features/music-tracker/library-core/application/ports/SongRepositoryPort";
import type {
  DuplicateDetectionPort,
  SongDuplicateCaseRepositoryPort,
} from "@/features/music-tracker/duplicate-detection/application/ports/DuplicateDetectionPort";

export async function detectPossibleDuplicatesForSong(params: {
  ownerId: string;
  song: Song;
  songRepository: SongRepositoryPort;
  duplicateDetectionService: DuplicateDetectionPort;
  duplicateCaseRepository: SongDuplicateCaseRepositoryPort;
}): Promise<SongDuplicateCase[]> {
  const { ownerId, song, songRepository, duplicateDetectionService, duplicateCaseRepository } = params;

  if (!song.id) {
    throw new Error("La canción debe existir antes de buscar duplicados.");
  }

  const candidates = await songRepository.list({
    ownerId,
    searchText: `${song.canonicalArtist} ${song.canonicalTitle}`.trim(),
  });

  const suggestions = await duplicateDetectionService.detect({
    ownerId,
    baseSong: song,
    candidates,
  });

  const duplicateCases: SongDuplicateCase[] = [];

  for (const suggestion of suggestions) {
    const duplicateCase = await duplicateCaseRepository.save(ownerId, {
      ...createEmptySongDuplicateCase(),
      primarySongId: song.id,
      candidateSongIds: suggestion.candidateSongIds,
      suspicionScore: suggestion.suspicionScore,
      reasons: suggestion.reasons,
      status: "possible-duplicate",
    });

    duplicateCases.push(duplicateCase);
  }

  if (suggestions.length > 0) {
    await songRepository.save({
      ownerId,
      song: {
        ...song,
        duplicateStatus: "possible-duplicate",
      },
    });
  }

  return duplicateCases;
}
