import type { SongReviewTask } from "@/lib/music-tracker/types";
import type { SongReviewTaskDocument } from "@/lib/models/SongReviewTask";

export function mapSongReviewTaskDocumentToEntity(document: SongReviewTaskDocument): SongReviewTask {
  return {
    id: String(document._id),
    ownerId: document.ownerId,
    songId: document.songId,
    importedTrackSourceId: document.importedTrackSourceId,
    duplicateCaseId: document.duplicateCaseId,
    reason: document.reason,
    action: document.action,
    priority: document.priority,
    status: document.status,
    notes: document.notes,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}
