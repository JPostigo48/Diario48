import type { ImportedTrackSource, Song, SongPlaylistOccurrence } from "@/lib/music-tracker/types";
import type { ImportedSourceRepositoryPort } from "@/features/music-tracker/import-sources/application/ports/ImportedSourceRepositoryPort";

export async function attachTrackOccurrenceToPlaylist(params: {
  ownerId: string;
  song: Song;
  track: ImportedTrackSource;
  playlistSourceId: string;
  importedSourceRepository: ImportedSourceRepositoryPort;
}): Promise<SongPlaylistOccurrence> {
  const { ownerId, song, track, playlistSourceId, importedSourceRepository } = params;

  const songId = song.id;
  if (!songId) {
    throw new Error("La canción debe existir antes de asociar ocurrencias a playlists.");
  }

  const existingOccurrence = await importedSourceRepository.findOccurrenceBySongAndPlaylist(
    ownerId,
    songId,
    playlistSourceId,
  );

  const nextPositions = mergePositions(existingOccurrence?.positions ?? [], track.playlistPosition);

  return importedSourceRepository.saveOccurrence({
    ownerId,
    occurrence: {
      id: existingOccurrence?.id,
      songId,
      playlistSourceId,
      importedTrackSourceId: track.id,
      occurrencesCount: nextPositions.length,
      positions: nextPositions,
      duplicateWithinPlaylist: nextPositions.length > 1,
      firstImportedAt: existingOccurrence?.firstImportedAt || track.importedAt,
      lastImportedAt: track.importedAt,
    },
  });
}

function mergePositions(currentPositions: number[], nextPosition?: number) {
  if (typeof nextPosition !== "number") {
    return currentPositions;
  }

  return Array.from(new Set([...currentPositions, nextPosition])).sort((left, right) => left - right);
}
