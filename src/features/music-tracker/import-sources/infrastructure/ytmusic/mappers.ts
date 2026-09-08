import type { PlaylistSnapshotInput } from "@/features/music-tracker/import-sources/application/importPlaylistSnapshot";
import type {
  ImportableSourceSummary,
  SearchableTrackSummary,
} from "@/features/music-tracker/import-sources/application/ports/ImportSourcePort";
import type {
  YtMusicImportableSourceDto,
  YtMusicPlaylistDto,
  YtMusicSearchTrackDto,
} from "@/features/music-tracker/import-sources/infrastructure/ytmusic/dtos";

export function mapYtMusicSourceDtoToSummary(
  source: YtMusicImportableSourceDto,
): ImportableSourceSummary {
  return {
    provider: "ytmusic",
    sourceRef: source.sourceRef,
    sourceKind: source.kind,
    externalPlaylistId: source.externalPlaylistId,
    title: source.title,
    description: source.description,
    itemCount: source.itemCount,
    sourceUrl: source.sourceUrl,
    thumbnails: source.thumbnails,
    sourcePayload: source.providerPayload,
  };
}

export function mapYtMusicPlaylistDtoToSnapshot(
  playlist: YtMusicPlaylistDto,
): PlaylistSnapshotInput {
  const importedAt = new Date().toISOString();

  return {
    provider: "ytmusic",
    externalPlaylistId: playlist.externalPlaylistId,
    originalName: playlist.title,
    sourceUrl: playlist.sourceUrl,
    snapshotVersion: `${playlist.sourceRef}:${importedAt}`,
    importedAt,
    sourcePayload: {
      sourceRef: playlist.sourceRef,
      description: playlist.description,
      privacy: playlist.privacy,
      year: playlist.year,
      thumbnails: playlist.thumbnails,
      provider: playlist.providerPayload ?? {},
    },
    tracks: playlist.tracks.map((track, index) => ({
      externalTrackId: track.externalTrackId,
      originalUrl: track.url,
      originalTitle: track.title,
      originalVisibleArtist: track.artistDisplayName,
      originalChannelName: track.channelName,
      playlistPosition: index + 1,
      sourcePayload: {
        artists: track.artists,
        albumName: track.albumName,
        durationText: track.durationText,
        durationSeconds: track.durationSeconds,
        isAvailable: track.isAvailable,
        isExplicit: track.isExplicit,
        thumbnails: track.thumbnails,
        provider: track.providerPayload ?? {},
      },
    })),
  };
}

export function mapYtMusicSearchTrackDtoToSummary(
  track: YtMusicSearchTrackDto,
): SearchableTrackSummary {
  return {
    provider: "ytmusic",
    externalTrackId: track.externalTrackId,
    title: track.title,
    artists: track.artists,
    artistDisplayName: track.artistDisplayName,
    albumName: track.albumName,
    durationText: track.durationText,
    sourceUrl: track.url,
    thumbnails: track.thumbnails,
    sourcePayload: track.providerPayload,
  };
}
