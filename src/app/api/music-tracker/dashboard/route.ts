import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import { MongoSongRepository } from "@/features/music-tracker/library-core/infrastructure/MongoSongRepository";
import { MongoImportedSourceRepository } from "@/features/music-tracker/import-sources/infrastructure/MongoImportedSourceRepository";
import { MongoSongReviewTaskRepository } from "@/features/music-tracker/review-queue/infrastructure/MongoSongReviewTaskRepository";
import { getMusicTrackerDashboard } from "@/features/music-tracker/library-core/application/queries/getMusicTrackerDashboard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const ownerId = String(auth.user._id);
    const dashboard = await getMusicTrackerDashboard({
      ownerId,
      songRepository: new MongoSongRepository(),
      importedSourceRepository: new MongoImportedSourceRepository(),
      songReviewTaskRepository: new MongoSongReviewTaskRepository(),
    });

    return NextResponse.json({ data: dashboard });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo cargar el dashboard musical.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
