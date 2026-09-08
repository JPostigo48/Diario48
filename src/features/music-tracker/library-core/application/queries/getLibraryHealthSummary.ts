import type { Song } from "@/lib/music-tracker/types";
import type { SongRepositoryPort } from "@/features/music-tracker/library-core/application/ports/SongRepositoryPort";

export interface LibraryHealthSummary {
  totalSongs: number;
  byOrganizationState: Record<Song["organizationState"], number>;
  byMetadataConfidence: Record<Song["metadataConfidence"], number>;
  byDuplicateStatus: Record<Song["duplicateStatus"], number>;
  byReviewState: Record<Song["reviewState"], number>;
}

export async function getLibraryHealthSummary(params: {
  ownerId: string;
  songRepository: SongRepositoryPort;
}): Promise<LibraryHealthSummary> {
  const songs = await params.songRepository.list({ ownerId: params.ownerId });

  return {
    totalSongs: songs.length,
    byOrganizationState: countBy(songs, "organizationState"),
    byMetadataConfidence: countBy(songs, "metadataConfidence"),
    byDuplicateStatus: countBy(songs, "duplicateStatus"),
    byReviewState: countBy(songs, "reviewState"),
  };
}

function countBy<T, K extends keyof T>(
  items: T[],
  field: K,
): Record<string, number> {
  return items.reduce<Record<string, number>>((accumulator, item) => {
    const key = String(item[field]);
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
}
