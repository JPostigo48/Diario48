import type { ImportSourcePort } from "@/features/music-tracker/import-sources/application/ports/ImportSourcePort";
import {
  importPlaylistSnapshot,
  type ImportPlaylistSnapshotDependencies,
  type ImportedPlaylistSnapshotResult,
} from "@/features/music-tracker/import-sources/application/importPlaylistSnapshot";

export async function importPlaylistFromProvider(params: {
  ownerId: string;
  providerSource: ImportSourcePort;
  sourceRef: string;
  dependencies: ImportPlaylistSnapshotDependencies;
}): Promise<ImportedPlaylistSnapshotResult> {
  const snapshot = await params.providerSource.importPlaylist({
    ownerId: params.ownerId,
    provider: "ytmusic",
    sourceRef: params.sourceRef,
  });

  return importPlaylistSnapshot({
    ownerId: params.ownerId,
    snapshot,
    dependencies: params.dependencies,
  });
}
