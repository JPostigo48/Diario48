import { createEmptySongReviewTask } from "@/lib/music-tracker/defaults";
import type { ImportedTrackSource, SongReviewTask } from "@/lib/music-tracker/types";

export function createReviewTaskForUncertainMetadata(params: {
  songId: string;
  track: ImportedTrackSource;
}): SongReviewTask {
  const { songId, track } = params;

  return {
    ...createEmptySongReviewTask(),
    songId,
    importedTrackSourceId: track.id,
    reason: "La metadata importada necesita validación manual.",
    action: "confirm-metadata",
    priority: "high",
    status: "pending",
    notes: [
      `title="${track.originalTitle}"`,
      `artist="${track.originalVisibleArtist || track.originalChannelName}"`,
    ].join(" | "),
  };
}
