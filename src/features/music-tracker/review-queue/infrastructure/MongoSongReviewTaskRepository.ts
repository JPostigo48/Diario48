import "server-only";

import { connectToDatabase } from "@/lib/db/mongodb";
import SongReviewTaskModel from "@/lib/models/SongReviewTask";
import type {
  SongReviewTaskQuery,
  SongReviewTaskRepositoryPort,
} from "@/features/music-tracker/review-queue/application/ports/SongReviewTaskRepositoryPort";
import { mapSongReviewTaskDocumentToEntity } from "@/features/music-tracker/review-queue/infrastructure/mappers";

function buildReviewTaskFilter(query: SongReviewTaskQuery) {
  const filter: Record<string, unknown> = { ownerId: query.ownerId };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if (query.action) {
    filter.action = query.action;
  }

  if (query.songId) {
    filter.songId = query.songId;
  }

  return filter;
}

export class MongoSongReviewTaskRepository implements SongReviewTaskRepositoryPort {
  async list(query: SongReviewTaskQuery) {
    await connectToDatabase();

    const documents = await SongReviewTaskModel.find(buildReviewTaskFilter(query))
      .sort({ priority: -1, updatedAt: -1 })
      .exec();

    return documents.map(mapSongReviewTaskDocumentToEntity);
  }

  async save(ownerId: string, task: import("@/lib/music-tracker/types").SongReviewTask) {
    await connectToDatabase();

    const payload = {
      ownerId,
      songId: task.songId,
      importedTrackSourceId: task.importedTrackSourceId,
      duplicateCaseId: task.duplicateCaseId,
      reason: task.reason,
      action: task.action,
      priority: task.priority,
      status: task.status,
      notes: task.notes,
    };

    const document = task.id
      ? await SongReviewTaskModel.findOneAndUpdate({ _id: task.id, ownerId }, payload, {
          new: true,
          runValidators: true,
        }).exec()
      : await SongReviewTaskModel.create(payload);

    if (!document) {
      throw new Error("No se pudo persistir la tarea de revisión.");
    }

    return mapSongReviewTaskDocumentToEntity(document);
  }
}
