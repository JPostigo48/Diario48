import "server-only";

import { connectToDatabase } from "@/lib/db/mongodb";
import SongDuplicateCaseModel from "@/lib/models/SongDuplicateCase";
import type {
  SongDuplicateCaseRepositoryPort,
} from "@/features/music-tracker/duplicate-detection/application/ports/DuplicateDetectionPort";
import { mapSongDuplicateCaseDocumentToEntity } from "@/features/music-tracker/duplicate-detection/infrastructure/mappers";

export class MongoSongDuplicateCaseRepository implements SongDuplicateCaseRepositoryPort {
  async save(ownerId: string, duplicateCase: import("@/lib/music-tracker/types").SongDuplicateCase) {
    await connectToDatabase();

    const payload = {
      ownerId,
      primarySongId: duplicateCase.primarySongId,
      candidateSongIds: duplicateCase.candidateSongIds,
      status: duplicateCase.status,
      suspicionScore: duplicateCase.suspicionScore,
      reasons: duplicateCase.reasons,
      decisionNotes: duplicateCase.decisionNotes,
      mergedIntoSongId: duplicateCase.mergedIntoSongId,
      resolvedByUserId: duplicateCase.resolvedByUserId,
      resolvedAt: duplicateCase.resolvedAt,
    };

    const document = duplicateCase.id
      ? await SongDuplicateCaseModel.findOneAndUpdate(
          { _id: duplicateCase.id, ownerId },
          payload,
          { new: true, runValidators: true },
        ).exec()
      : await SongDuplicateCaseModel.create(payload);

    if (!document) {
      throw new Error("No se pudo persistir el caso de duplicado.");
    }

    return mapSongDuplicateCaseDocumentToEntity(document);
  }

  async list(ownerId: string, status?: import("@/lib/music-tracker/types").SongDuplicateCase["status"]) {
    await connectToDatabase();

    const filter: Record<string, unknown> = { ownerId };
    if (status) {
      filter.status = status;
    }

    const documents = await SongDuplicateCaseModel.find(filter)
      .sort({ updatedAt: -1, suspicionScore: -1 })
      .exec();

    return documents.map(mapSongDuplicateCaseDocumentToEntity);
  }
}
