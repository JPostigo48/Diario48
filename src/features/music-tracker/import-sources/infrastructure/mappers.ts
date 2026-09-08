import type {
  ImportedPlaylistSource,
  ImportedTrackSource,
  SongPlaylistOccurrence,
} from "@/lib/music-tracker/types";
import type { ImportedPlaylistSourceDocument } from "@/lib/models/ImportedPlaylistSource";
import type { ImportedTrackSourceDocument } from "@/lib/models/ImportedTrackSource";
import type { SongPlaylistOccurrenceDocument } from "@/lib/models/SongPlaylistOccurrence";

export function mapImportedPlaylistSourceDocumentToEntity(
  document: ImportedPlaylistSourceDocument,
): ImportedPlaylistSource {
  return {
    id: String(document._id),
    ownerId: document.ownerId,
    provider: document.provider,
    externalPlaylistId: document.externalPlaylistId,
    originalName: document.originalName,
    sourceUrl: document.sourceUrl,
    snapshotVersion: document.snapshotVersion,
    importedAt: document.importedAt,
    itemCount: document.itemCount,
    sourcePayload: document.sourcePayload,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}

export function mapImportedTrackSourceDocumentToEntity(
  document: ImportedTrackSourceDocument,
): ImportedTrackSource {
  return {
    id: String(document._id),
    ownerId: document.ownerId,
    provider: document.provider,
    playlistSourceId: document.playlistSourceId,
    songId: document.songId,
    externalTrackId: document.externalTrackId,
    originalUrl: document.originalUrl,
    originalTitle: document.originalTitle,
    originalVisibleArtist: document.originalVisibleArtist,
    originalChannelName: document.originalChannelName,
    playlistPosition: document.playlistPosition,
    importedAt: document.importedAt,
    sourcePayload: document.sourcePayload,
    normalizedTitle: document.normalizedTitle,
    normalizedArtist: document.normalizedArtist,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}

export function mapSongPlaylistOccurrenceDocumentToEntity(
  document: SongPlaylistOccurrenceDocument,
): SongPlaylistOccurrence {
  return {
    id: String(document._id),
    ownerId: document.ownerId,
    songId: document.songId,
    playlistSourceId: document.playlistSourceId,
    importedTrackSourceId: document.importedTrackSourceId,
    occurrencesCount: document.occurrencesCount,
    positions: document.positions,
    duplicateWithinPlaylist: document.duplicateWithinPlaylist,
    firstImportedAt: document.firstImportedAt,
    lastImportedAt: document.lastImportedAt,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}
