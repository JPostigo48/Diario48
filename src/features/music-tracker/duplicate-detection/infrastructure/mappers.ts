import type { SongDuplicateCase } from "@/lib/music-tracker/types";
import type { SongDuplicateCaseDocument } from "@/lib/models/SongDuplicateCase";

export function mapSongDuplicateCaseDocumentToEntity(
  document: SongDuplicateCaseDocument,
): SongDuplicateCase {
  return {
    id: String(document._id),
    ownerId: document.ownerId,
    primarySongId: document.primarySongId,
    candidateSongIds: document.candidateSongIds,
    status: document.status,
    suspicionScore: document.suspicionScore,
    reasons: document.reasons,
    decisionNotes: document.decisionNotes,
    mergedIntoSongId: document.mergedIntoSongId,
    resolvedByUserId: document.resolvedByUserId,
    resolvedAt: document.resolvedAt,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}
