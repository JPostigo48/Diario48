import type { SongDuplicateCase, SongDuplicateStatus } from "@/lib/music-tracker/types";
import type { SongRepositoryPort } from "@/features/music-tracker/library-core/application/ports/SongRepositoryPort";
import type { SongReviewTaskRepositoryPort } from "@/features/music-tracker/review-queue/application/ports/SongReviewTaskRepositoryPort";
import type { SongDuplicateCaseRepositoryPort } from "@/features/music-tracker/duplicate-detection/application/ports/DuplicateDetectionPort";

export async function resolveDuplicateCase(params: {
  ownerId: string;
  duplicateCase: SongDuplicateCase;
  resolution: SongDuplicateStatus;
  resolvedByUserId: string;
  decisionNotes?: string;
  mergedIntoSongId?: string;
  songRepository: SongRepositoryPort;
  duplicateCaseRepository: SongDuplicateCaseRepositoryPort;
  songReviewTaskRepository?: SongReviewTaskRepositoryPort;
}) {
  const {
    ownerId,
    duplicateCase,
    resolution,
    resolvedByUserId,
    decisionNotes,
    mergedIntoSongId,
    songRepository,
    duplicateCaseRepository,
    songReviewTaskRepository,
  } = params;

  const resolvedAt = new Date().toISOString();

  const savedCase = await duplicateCaseRepository.save(ownerId, {
    ...duplicateCase,
    status: resolution,
    decisionNotes: decisionNotes ?? duplicateCase.decisionNotes,
    mergedIntoSongId,
    resolvedByUserId,
    resolvedAt,
  });

  for (const songId of duplicateCase.candidateSongIds) {
    const song = await songRepository.getById(ownerId, songId);
    if (!song) {
      continue;
    }

    let nextDuplicateStatus = song.duplicateStatus;
    if (resolution === "merged") {
      nextDuplicateStatus = songId === mergedIntoSongId ? "not-duplicate" : "merged";
    } else if (resolution === "not-duplicate") {
      nextDuplicateStatus = "not-duplicate";
    } else if (resolution === "confirmed-duplicate") {
      nextDuplicateStatus = "confirmed-duplicate";
    } else if (resolution === "pending-duplicate-review") {
      nextDuplicateStatus = "pending-duplicate-review";
    }

    await songRepository.save({
      ownerId,
      song: {
        ...song,
        duplicateStatus: nextDuplicateStatus,
      },
    });

    if (
      songReviewTaskRepository &&
      (resolution === "confirmed-duplicate" || resolution === "pending-duplicate-review")
    ) {
      await songReviewTaskRepository.save(ownerId, {
        songId,
        duplicateCaseId: savedCase.id,
        reason: "Caso de duplicado requiere seguimiento humano.",
        action: "review-duplicate",
        priority: resolution === "confirmed-duplicate" ? "medium" : "high",
        status: resolution === "pending-duplicate-review" ? "pending" : "in-progress",
        notes: decisionNotes ?? "",
      });
    }
  }

  return savedCase;
}
