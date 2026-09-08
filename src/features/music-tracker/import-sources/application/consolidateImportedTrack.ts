import type { ImportedTrackSource, Song } from "@/lib/music-tracker/types";
import type { ImportedSourceRepositoryPort } from "@/features/music-tracker/import-sources/application/ports/ImportedSourceRepositoryPort";
import type { SongRepositoryPort } from "@/features/music-tracker/library-core/application/ports/SongRepositoryPort";
import type { SongReviewTaskRepositoryPort } from "@/features/music-tracker/review-queue/application/ports/SongReviewTaskRepositoryPort";
import { createCanonicalSongFromImport } from "@/features/music-tracker/import-sources/application/createCanonicalSongFromImport";
import { createReviewTaskForUncertainMetadata } from "@/features/music-tracker/import-sources/application/createReviewTaskForUncertainMetadata";
import { attachTrackOccurrenceToPlaylist } from "@/features/music-tracker/import-sources/application/attachTrackOccurrenceToPlaylist";
import { matchImportedTrackToSong } from "@/features/music-tracker/import-sources/application/matchImportedTrackToSong";

export async function consolidateImportedTrack(params: {
  ownerId: string;
  track: ImportedTrackSource;
  playlistSourceId?: string;
  importedSourceRepository: ImportedSourceRepositoryPort;
  songRepository: SongRepositoryPort;
  songReviewTaskRepository: SongReviewTaskRepositoryPort;
}): Promise<{ song: Song; track: ImportedTrackSource }> {
  const {
    ownerId,
    track,
    playlistSourceId,
    importedSourceRepository,
    songRepository,
    songReviewTaskRepository,
  } = params;

  let song = await matchImportedTrackToSong({
    ownerId,
    track,
    songRepository,
  });

  if (!song) {
    song = await songRepository.save({
      ownerId,
      song: createCanonicalSongFromImport(track),
    });
  } else {
    const nextSong = mergeTrackSourceIntoSong(song, track);
    const hasChanges = JSON.stringify(nextSong.externalLinks) !== JSON.stringify(song.externalLinks);

    if (hasChanges) {
      song = await songRepository.save({
        ownerId,
        song: nextSong,
      });
    }
  }

  const linkedTrack =
    track.songId === song.id
      ? track
      : await importedSourceRepository.saveTrack({
          ownerId,
          track: {
            ...track,
            songId: song.id,
          },
        });

  if (playlistSourceId) {
    await attachTrackOccurrenceToPlaylist({
      ownerId,
      song,
      track: linkedTrack,
      playlistSourceId,
      importedSourceRepository,
    });
  }

  if (shouldCreateReviewTask(linkedTrack)) {
    await songReviewTaskRepository.save(
      ownerId,
      createReviewTaskForUncertainMetadata({
        songId: song.id ?? "",
        track: linkedTrack,
      }),
    );
  }

  return {
    song,
    track: linkedTrack,
  };
}

function shouldCreateReviewTask(track: ImportedTrackSource) {
  if (!track.normalizedTitle.trim() || !track.normalizedArtist.trim()) {
    return true;
  }

  if (!track.originalVisibleArtist?.trim() && !track.originalTitle.includes(" - ")) {
    return true;
  }

  return false;
}

function mergeTrackSourceIntoSong(song: Song, track: ImportedTrackSource): Song {
  if (!track.originalUrl.trim()) {
    return song;
  }

  const hasSameLink = song.externalLinks.some(
    (link) =>
      link.provider === track.provider &&
      link.url === track.originalUrl &&
      (link.externalId ?? "") === track.externalTrackId,
  );

  if (hasSameLink) {
    return song;
  }

  return {
    ...song,
    externalLinks: [
      ...song.externalLinks,
      {
        provider: track.provider,
        externalId: track.externalTrackId,
        url: track.originalUrl,
        label: "source",
      },
    ],
  };
}
