import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import { MongoSongRepository } from "@/features/music-tracker/library-core/infrastructure/MongoSongRepository";
import { MongoImportedSourceRepository } from "@/features/music-tracker/import-sources/infrastructure/MongoImportedSourceRepository";
import { MongoSongReviewTaskRepository } from "@/features/music-tracker/review-queue/infrastructure/MongoSongReviewTaskRepository";
import { MongoSongDuplicateCaseRepository } from "@/features/music-tracker/duplicate-detection/infrastructure/MongoSongDuplicateCaseRepository";
import { getSongDetail } from "@/features/music-tracker/library-core/application/queries/getSongDetail";
import { updateSongLibraryPreferences } from "@/features/music-tracker/library-core/application/updateSongLibraryPreferences";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const { id } = await context.params;
    const ownerId = String(auth.user._id);
    const detail = await getSongDetail({
      ownerId,
      songId: id,
      songRepository: new MongoSongRepository(),
      importedSourceRepository: new MongoImportedSourceRepository(),
      songReviewTaskRepository: new MongoSongReviewTaskRepository(),
      duplicateCaseRepository: new MongoSongDuplicateCaseRepository(),
    });

    if (!detail) {
      return NextResponse.json({ error: "Canción no encontrada." }, { status: 404 });
    }

    return NextResponse.json({ data: detail });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo cargar el detalle de la canción.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const { id } = await context.params;
    const ownerId = String(auth.user._id);
    const body = (await request.json()) as {
      rating?: number | null;
      isRealFavorite?: boolean;
      personalNote?: string;
    };

    const updatedSong = await updateSongLibraryPreferences({
      ownerId,
      songId: id,
      input: {
        rating: body.rating,
        isRealFavorite: body.isRealFavorite,
        personalNote: body.personalNote,
      },
      songRepository: new MongoSongRepository(),
    });

    return NextResponse.json({ data: updatedSong });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo actualizar la canción.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
