import type { Song } from "@/lib/music-tracker/types";
import type { SongRepositoryPort } from "@/features/music-tracker/library-core/application/ports/SongRepositoryPort";
import { getLibraryHealthSummary } from "@/features/music-tracker/library-core/application/queries/getLibraryHealthSummary";
import type { ImportedSourceRepositoryPort } from "@/features/music-tracker/import-sources/application/ports/ImportedSourceRepositoryPort";
import type { SongReviewTaskRepositoryPort } from "@/features/music-tracker/review-queue/application/ports/SongReviewTaskRepositoryPort";

export interface MusicTrackerDashboard {
  totalImportedSongs: number;
  totalUniqueSongs: number;
  pendingReviewSongs: number;
  possibleDuplicateSongs: number;
  metadataDoubtfulSongs: number;
  importedPlaylists: number;
  topArtists: Array<{ artist: string; count: number }>;
  topGenres: Array<{ genre: string; count: number }>;
  ratedSongsCount: number;
  averageRating: number;
  realFavoritesCount: number;
  songsWithPersonalNoteCount: number;
  healthSummary: Awaited<ReturnType<typeof getLibraryHealthSummary>>;
  pendingReviewTasks: number;
}

export async function getMusicTrackerDashboard(params: {
  ownerId: string;
  songRepository: SongRepositoryPort;
  importedSourceRepository: ImportedSourceRepositoryPort;
  songReviewTaskRepository: SongReviewTaskRepositoryPort;
}): Promise<MusicTrackerDashboard> {
  const { ownerId, songRepository, importedSourceRepository, songReviewTaskRepository } = params;

  const [songs, playlists, importedTracks, pendingReviewTasks, healthSummary] = await Promise.all([
    songRepository.list({ ownerId }),
    importedSourceRepository.listPlaylists(ownerId),
    importedSourceRepository.listTracks({ ownerId }),
    songReviewTaskRepository.list({ ownerId, status: "pending" }),
    getLibraryHealthSummary({ ownerId, songRepository }),
  ]);

  return {
    totalImportedSongs: importedTracks.length,
    totalUniqueSongs: songs.length,
    pendingReviewSongs: getPendingReviewSongCount(pendingReviewTasks),
    possibleDuplicateSongs: songs.filter((song) =>
      song.duplicateStatus === "possible-duplicate" ||
      song.duplicateStatus === "pending-duplicate-review",
    ).length,
    metadataDoubtfulSongs: songs.filter((song) =>
      song.metadataConfidence === "metadata-doubtful" ||
      song.metadataConfidence === "metadata-not-found",
    ).length,
    importedPlaylists: playlists.length,
    topArtists: getTopArtists(songs),
    topGenres: getTopGenres(songs),
    ratedSongsCount: songs.filter((song) => typeof song.rating === "number").length,
    averageRating: getAverageRating(songs),
    realFavoritesCount: songs.filter((song) => song.isRealFavorite).length,
    songsWithPersonalNoteCount: songs.filter((song) => song.personalNote.trim().length > 0).length,
    healthSummary,
    pendingReviewTasks: pendingReviewTasks.length,
  };
}

function getTopArtists(songs: Song[]) {
  const counts = countTextValues(songs.map((song) => song.canonicalArtist));
  return counts.slice(0, 5).map(([artist, count]) => ({ artist, count }));
}

function getTopGenres(songs: Song[]) {
  const counts = countTextValues(songs.flatMap((song) => song.tags.automaticGenres));
  return counts.slice(0, 5).map(([genre, count]) => ({ genre, count }));
}

function countTextValues(values: string[]) {
  return Object.entries(
    values.reduce<Record<string, number>>((accumulator, value) => {
      const key = value.trim();
      if (!key) {
        return accumulator;
      }

      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    }, {}),
  ).sort((left, right) => right[1] - left[1]);
}

function getAverageRating(songs: Song[]) {
  const ratedSongs = songs.filter((song) => typeof song.rating === "number");

  if (!ratedSongs.length) {
    return 0;
  }

  const total = ratedSongs.reduce((sum, song) => sum + (song.rating ?? 0), 0);
  return Number((total / ratedSongs.length).toFixed(2));
}

function getPendingReviewSongCount(
  pendingReviewTasks: Awaited<ReturnType<SongReviewTaskRepositoryPort["list"]>>,
) {
  return new Set(pendingReviewTasks.map((task) => task.songId)).size;
}
