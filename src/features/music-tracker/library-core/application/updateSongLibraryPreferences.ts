import type { Song } from "@/lib/music-tracker/types";
import type { SongRepositoryPort } from "@/features/music-tracker/library-core/application/ports/SongRepositoryPort";

export interface UpdateSongLibraryPreferencesInput {
  rating?: number | null;
  isRealFavorite?: boolean;
  personalNote?: string;
}

export async function updateSongLibraryPreferences(params: {
  ownerId: string;
  songId: string;
  input: UpdateSongLibraryPreferencesInput;
  songRepository: SongRepositoryPort;
}): Promise<Song> {
  const song = await params.songRepository.getById(params.ownerId, params.songId);

  if (!song) {
    throw new Error("Canción no encontrada.");
  }

  const nextRating = normalizeRating(params.input.rating, song.rating);
  const nextFavorite =
    typeof params.input.isRealFavorite === "boolean"
      ? params.input.isRealFavorite
      : song.isRealFavorite;
  const nextNote =
    typeof params.input.personalNote === "string"
      ? params.input.personalNote.trim()
      : song.personalNote;

  return params.songRepository.save({
    ownerId: params.ownerId,
    song: {
      ...song,
      rating: nextRating,
      isRealFavorite: nextFavorite,
      personalNote: nextNote,
    },
  });
}

function normalizeRating(nextRating: number | null | undefined, fallback?: number) {
  if (nextRating === undefined) {
    return fallback;
  }

  if (nextRating === null) {
    return undefined;
  }

  if (!Number.isInteger(nextRating) || nextRating < 1 || nextRating > 5) {
    throw new Error("El rating debe ser un entero entre 1 y 5.");
  }

  return nextRating;
}
