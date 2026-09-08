import type { ImportedTrackSource, Song } from "@/lib/music-tracker/types";
import type { SongRepositoryPort } from "@/features/music-tracker/library-core/application/ports/SongRepositoryPort";

export async function matchImportedTrackToSong(params: {
  ownerId: string;
  track: ImportedTrackSource;
  songRepository: SongRepositoryPort;
}): Promise<Song | null> {
  const { ownerId, track, songRepository } = params;

  if (track.externalTrackId.trim()) {
    const byExternalTrack = await songRepository.findByExternalTrack(
      ownerId,
      track.provider,
      track.externalTrackId,
    );
    if (byExternalTrack) {
      return byExternalTrack;
    }
  }

  if (track.originalUrl.trim()) {
    const bySourceUrl = await songRepository.findBySourceUrl(ownerId, track.originalUrl);
    if (bySourceUrl) {
      return bySourceUrl;
    }
  }

  if (track.normalizedTitle.trim() && track.normalizedArtist.trim()) {
    return songRepository.findByCanonicalIdentity(
      ownerId,
      track.normalizedTitle,
      track.normalizedArtist,
    );
  }

  return null;
}
