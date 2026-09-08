import type {
  ImportSourcePort,
  SearchableTrackSummary,
} from "@/features/music-tracker/import-sources/application/ports/ImportSourcePort";

export async function searchSongsInYtMusic(params: {
  ownerId: string;
  query: string;
  limit?: number;
  providerSource: ImportSourcePort;
}): Promise<SearchableTrackSummary[]> {
  const query = params.query.trim();

  if (!query) {
    return [];
  }

  return params.providerSource.searchTracks(params.ownerId, query, params.limit ?? 10);
}
