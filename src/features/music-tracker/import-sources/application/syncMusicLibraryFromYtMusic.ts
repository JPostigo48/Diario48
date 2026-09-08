import type { MusicProviderCredentialRepositoryPort } from "@/features/music-tracker/provider-credentials/application/ports/MusicProviderCredentialRepositoryPort";
import type { ImportableSourceSummary, ImportSourcePort } from "@/features/music-tracker/import-sources/application/ports/ImportSourcePort";
import { importPlaylistFromProvider } from "@/features/music-tracker/import-sources/application/importPlaylistFromProvider";
import type { ImportPlaylistSnapshotDependencies } from "@/features/music-tracker/import-sources/application/importPlaylistSnapshot";

export type YtMusicSyncMode = "all" | "likes" | "playlists";

export interface SyncMusicLibraryFromYtMusicResult {
  mode: YtMusicSyncMode;
  syncedSources: Array<{
    sourceRef: string;
    title: string;
    importedTracks: number;
    songs: number;
  }>;
  failedSources: Array<{
    sourceRef: string;
    title: string;
    error: string;
  }>;
  totalImportedTracks: number;
  totalSongs: number;
  syncedAt: string;
}

export async function syncMusicLibraryFromYtMusic(params: {
  ownerId: string;
  mode: YtMusicSyncMode;
  providerSource: ImportSourcePort;
  credentialRepository: MusicProviderCredentialRepositoryPort;
  dependencies: ImportPlaylistSnapshotDependencies;
}): Promise<SyncMusicLibraryFromYtMusicResult> {
  const syncedAt = new Date().toISOString();
  const allSources = await params.providerSource.listSources(params.ownerId);
  const targetSources = selectSourcesForMode(allSources, params.mode);

  const syncedSources: SyncMusicLibraryFromYtMusicResult["syncedSources"] = [];
  const failedSources: SyncMusicLibraryFromYtMusicResult["failedSources"] = [];

  for (const source of targetSources) {
    try {
      const result = await importPlaylistFromProvider({
        ownerId: params.ownerId,
        providerSource: params.providerSource,
        sourceRef: source.sourceRef,
        dependencies: params.dependencies,
      });

      syncedSources.push({
        sourceRef: source.sourceRef,
        title: source.title,
        importedTracks: result.importedTracks.length,
        songs: result.songs.length,
      });
    } catch (error) {
      failedSources.push({
        sourceRef: source.sourceRef,
        title: source.title,
        error: error instanceof Error ? error.message : "No se pudo sincronizar la fuente.",
      });
    }
  }

  const credential = await params.credentialRepository.getByOwnerAndProvider(params.ownerId, "ytmusic");
  if (credential) {
    await params.credentialRepository.save({
      ownerId: params.ownerId,
      credential: {
        ...credential,
        status: failedSources.length ? "needs-refresh" : "valid",
        lastSyncAt: syncedAt,
        lastError: failedSources.map((item) => `${item.title}: ${item.error}`).join(" | "),
      },
    });
  }

  return {
    mode: params.mode,
    syncedSources,
    failedSources,
    totalImportedTracks: syncedSources.reduce((total, item) => total + item.importedTracks, 0),
    totalSongs: syncedSources.reduce((total, item) => total + item.songs, 0),
    syncedAt,
  };
}

function selectSourcesForMode(sources: ImportableSourceSummary[], mode: YtMusicSyncMode) {
  if (mode === "likes") {
    return sources.filter((source) => source.sourceKind === "liked-songs");
  }

  if (mode === "playlists") {
    return sources.filter((source) => source.sourceKind === "playlist");
  }

  return sources;
}
