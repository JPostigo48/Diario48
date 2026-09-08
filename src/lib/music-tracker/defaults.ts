import type {
  ImportedPlaylistSource,
  ImportedTrackSource,
  Song,
  SongDuplicateCase,
  SongMetadataEvidence,
  SongPlaylistOccurrence,
  SongReviewTask,
} from "@/lib/music-tracker/types";

export function createEmptySong(): Song {
  return {
    canonicalTitle: "",
    canonicalArtist: "",
    manualTitle: "",
    manualArtist: "",
    album: "",
    personalNote: "",
    isRealFavorite: false,
    organizationState: "imported",
    reviewState: "pending",
    metadataConfidence: "metadata-doubtful",
    duplicateStatus: "not-duplicate",
    externalLinks: [],
    tags: {
      automaticTags: [],
      personalTags: [],
      automaticGenres: [],
      automaticMoods: [],
      personalMoods: [],
      personalUses: [],
    },
  };
}

export function createEmptyImportedPlaylistSource(): ImportedPlaylistSource {
  return {
    provider: "unknown",
    externalPlaylistId: "",
    originalName: "",
    sourceUrl: "",
    snapshotVersion: "",
    importedAt: new Date().toISOString(),
    sourcePayload: {},
  };
}

export function createEmptyImportedTrackSource(): ImportedTrackSource {
  return {
    provider: "unknown",
    externalTrackId: "",
    originalUrl: "",
    originalTitle: "",
    originalVisibleArtist: "",
    originalChannelName: "",
    importedAt: new Date().toISOString(),
    sourcePayload: {},
    normalizedTitle: "",
    normalizedArtist: "",
  };
}

export function createEmptySongPlaylistOccurrence(): SongPlaylistOccurrence {
  return {
    songId: "",
    playlistSourceId: "",
    occurrencesCount: 1,
    positions: [],
    duplicateWithinPlaylist: false,
  };
}

export function createEmptySongMetadataEvidence(): SongMetadataEvidence {
  return {
    songId: "",
    provider: "unknown",
    suggestedTitle: "",
    suggestedArtist: "",
    suggestedAlbum: "",
    suggestedGenres: [],
    suggestedTags: [],
    suggestedMoods: [],
    confidence: "metadata-doubtful",
    acceptedFields: [],
    rejectedFields: [],
    collectedAt: new Date().toISOString(),
    sourcePayload: {},
  };
}

export function createEmptySongDuplicateCase(): SongDuplicateCase {
  return {
    candidateSongIds: [],
    status: "possible-duplicate",
    suspicionScore: 0,
    reasons: [],
    decisionNotes: "",
  };
}

export function createEmptySongReviewTask(): SongReviewTask {
  return {
    songId: "",
    reason: "",
    action: "general-review",
    priority: "medium",
    status: "pending",
    notes: "",
  };
}
