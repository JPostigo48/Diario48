export interface YtMusicThumbnailDto {
  url: string;
  width?: number;
  height?: number;
}

export interface YtMusicImportableSourceDto {
  sourceRef: string;
  kind: "liked-songs" | "playlist";
  externalPlaylistId: string;
  title: string;
  description: string;
  itemCount?: number;
  sourceUrl: string;
  thumbnails: YtMusicThumbnailDto[];
  providerPayload?: Record<string, unknown>;
}

export interface YtMusicTrackDto {
  externalTrackId: string;
  title: string;
  artists: string[];
  artistDisplayName: string;
  channelName: string;
  albumName: string;
  durationText: string;
  durationSeconds?: number;
  isAvailable: boolean;
  isExplicit: boolean;
  thumbnails: YtMusicThumbnailDto[];
  url: string;
  providerPayload?: Record<string, unknown>;
}

export type YtMusicSearchTrackDto = YtMusicTrackDto;

export interface YtMusicPlaylistDto {
  sourceRef: string;
  externalPlaylistId: string;
  title: string;
  description: string;
  trackCount?: number;
  privacy: string;
  year: string;
  thumbnails: YtMusicThumbnailDto[];
  sourceUrl: string;
  tracks: YtMusicTrackDto[];
  providerPayload?: Record<string, unknown>;
}
