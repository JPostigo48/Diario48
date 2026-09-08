export type MusicSourceProvider =
  | "ytmusic"
  | "youtube"
  | "spotify"
  | "apple-music"
  | "soundcloud"
  | "deezer"
  | "json"
  | "csv"
  | "manual"
  | "unknown";

export type SongOrganizationState =
  | "imported"
  | "needs-review"
  | "clean"
  | "enriched"
  | "classified"
  | "archived"
  | "discarded";

export type SongReviewState =
  | "pending"
  | "in-review"
  | "reviewed"
  | "ignored";

export type SongMetadataConfidence =
  | "metadata-reliable"
  | "metadata-probable"
  | "metadata-doubtful"
  | "metadata-not-found";

export type SongDuplicateStatus =
  | "possible-duplicate"
  | "confirmed-duplicate"
  | "not-duplicate"
  | "merged"
  | "pending-duplicate-review";

export type SongReviewTaskPriority = "low" | "medium" | "high";

export type SongReviewTaskStatus = "pending" | "in-progress" | "resolved" | "ignored";

export type MusicProviderCredentialProvider = "ytmusic";

export type MusicProviderCredentialStatus =
  | "configured"
  | "valid"
  | "invalid"
  | "needs-refresh";

export type MusicProviderCredentialSummaryStatus =
  | MusicProviderCredentialStatus
  | "not-configured";

export type SongReviewTaskAction =
  | "confirm-metadata"
  | "review-title"
  | "review-artist"
  | "review-duplicate"
  | "assign-tags"
  | "assign-mood"
  | "assign-usage"
  | "assign-playlist"
  | "general-review";

export interface SongExternalLink {
  provider: MusicSourceProvider;
  externalId?: string;
  url: string;
  label?: string;
}

export interface SongTagSet {
  automaticTags: string[];
  personalTags: string[];
  automaticGenres: string[];
  automaticMoods: string[];
  personalMoods: string[];
  personalUses: string[];
}

export interface Song {
  id?: string;
  canonicalTitle: string;
  canonicalArtist: string;
  manualTitle: string;
  manualArtist: string;
  album: string;
  year?: number;
  rating?: number;
  personalNote: string;
  isRealFavorite: boolean;
  organizationState: SongOrganizationState;
  reviewState: SongReviewState;
  metadataConfidence: SongMetadataConfidence;
  duplicateStatus: SongDuplicateStatus;
  externalLinks: SongExternalLink[];
  tags: SongTagSet;
  createdAt?: string;
  updatedAt?: string;
}

export interface ImportedPlaylistSource {
  id?: string;
  ownerId?: string;
  provider: MusicSourceProvider;
  externalPlaylistId: string;
  originalName: string;
  sourceUrl: string;
  snapshotVersion: string;
  importedAt: string;
  itemCount?: number;
  sourcePayload?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ImportedTrackSource {
  id?: string;
  ownerId?: string;
  provider: MusicSourceProvider;
  playlistSourceId?: string;
  songId?: string;
  externalTrackId: string;
  originalUrl: string;
  originalTitle: string;
  originalVisibleArtist: string;
  originalChannelName: string;
  playlistPosition?: number;
  importedAt: string;
  sourcePayload?: Record<string, unknown>;
  normalizedTitle: string;
  normalizedArtist: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SongPlaylistOccurrence {
  id?: string;
  ownerId?: string;
  songId: string;
  playlistSourceId: string;
  importedTrackSourceId?: string;
  occurrencesCount: number;
  positions: number[];
  duplicateWithinPlaylist: boolean;
  firstImportedAt?: string;
  lastImportedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SongMetadataEvidence {
  id?: string;
  ownerId?: string;
  songId: string;
  provider: MusicSourceProvider;
  suggestedTitle: string;
  suggestedArtist: string;
  suggestedAlbum: string;
  suggestedYear?: number;
  suggestedGenres: string[];
  suggestedTags: string[];
  suggestedMoods: string[];
  confidence: SongMetadataConfidence;
  acceptedFields: string[];
  rejectedFields: string[];
  collectedAt: string;
  sourcePayload?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface SongDuplicateCase {
  id?: string;
  ownerId?: string;
  primarySongId?: string;
  candidateSongIds: string[];
  status: SongDuplicateStatus;
  suspicionScore: number;
  reasons: string[];
  decisionNotes: string;
  mergedIntoSongId?: string;
  resolvedByUserId?: string;
  resolvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SongReviewTask {
  id?: string;
  ownerId?: string;
  songId: string;
  importedTrackSourceId?: string;
  duplicateCaseId?: string;
  reason: string;
  action: SongReviewTaskAction;
  priority: SongReviewTaskPriority;
  status: SongReviewTaskStatus;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MusicProviderCredential {
  id?: string;
  ownerId?: string;
  provider: MusicProviderCredentialProvider;
  encryptedSecret: string;
  status: MusicProviderCredentialStatus;
  lastValidatedAt?: string;
  lastSyncAt?: string;
  lastError: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MusicProviderCredentialSummary {
  provider: MusicProviderCredentialProvider;
  hasCredential: boolean;
  status: MusicProviderCredentialSummaryStatus;
  lastValidatedAt?: string;
  lastSyncAt?: string;
  lastError: string;
  updatedAt?: string;
}
