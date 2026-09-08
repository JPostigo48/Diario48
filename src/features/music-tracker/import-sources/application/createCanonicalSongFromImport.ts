import { createEmptySong } from "@/lib/music-tracker/defaults";
import type { ImportedTrackSource, Song } from "@/lib/music-tracker/types";

export function createCanonicalSongFromImport(track: ImportedTrackSource): Song {
  const baseSong = createEmptySong();

  return {
    ...baseSong,
    canonicalTitle: track.normalizedTitle || track.originalTitle,
    canonicalArtist:
      track.normalizedArtist || track.originalVisibleArtist || track.originalChannelName,
    metadataConfidence:
      track.normalizedTitle && track.normalizedArtist
        ? "metadata-probable"
        : "metadata-doubtful",
    organizationState: "imported",
    reviewState: "pending",
    externalLinks: track.originalUrl
      ? [
          {
            provider: track.provider,
            externalId: track.externalTrackId,
            url: track.originalUrl,
            label: "source",
          },
        ]
      : [],
  };
}
