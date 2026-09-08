import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import { DefaultExportLibraryService } from "@/features/music-tracker/export-reporting/infrastructure/DefaultExportLibraryService";
import { MongoSongRepository } from "@/features/music-tracker/library-core/infrastructure/MongoSongRepository";
import { MongoImportedSourceRepository } from "@/features/music-tracker/import-sources/infrastructure/MongoImportedSourceRepository";
import { MongoSongDuplicateCaseRepository } from "@/features/music-tracker/duplicate-detection/infrastructure/MongoSongDuplicateCaseRepository";
import { MongoSongReviewTaskRepository } from "@/features/music-tracker/review-queue/infrastructure/MongoSongReviewTaskRepository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const url = new URL(request.url);
    const format = (url.searchParams.get("format") || "json") as "json" | "csv" | "excel";
    const ownerId = String(auth.user._id);

    const songRepository = new MongoSongRepository();
    const importedSourceRepository = new MongoImportedSourceRepository();
    const duplicateCaseRepository = new MongoSongDuplicateCaseRepository();
    const reviewTaskRepository = new MongoSongReviewTaskRepository();
    const exportService = new DefaultExportLibraryService();

    const snapshot = {
      songs: await songRepository.list({ ownerId }),
      playlists: await importedSourceRepository.listPlaylists(ownerId),
      importedTracks: await importedSourceRepository.listTracks({ ownerId }),
      duplicateCases: await duplicateCaseRepository.list(ownerId),
      reviewTasks: await reviewTaskRepository.list({ ownerId }),
    };

    const exported = await exportService.exportLibrary({
      ownerId,
      format,
      snapshot,
    });

    const body =
      typeof exported.content === "string"
        ? exported.content
        : new Uint8Array(exported.content);

    return new NextResponse(body, {
      headers: {
        "Content-Type": exported.mimeType,
        "Content-Disposition": `attachment; filename="${exported.fileName}"`,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo exportar la biblioteca musical.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
