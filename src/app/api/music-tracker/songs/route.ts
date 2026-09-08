import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import { MongoSongRepository } from "@/features/music-tracker/library-core/infrastructure/MongoSongRepository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const url = new URL(request.url);
    const ownerId = String(auth.user._id);
    const songRepository = new MongoSongRepository();
    const songs = await songRepository.list({
      ownerId,
      organizationState: (url.searchParams.get("organizationState") as never) || undefined,
      reviewState: (url.searchParams.get("reviewState") as never) || undefined,
      metadataConfidence: (url.searchParams.get("metadataConfidence") as never) || undefined,
      duplicateStatus: (url.searchParams.get("duplicateStatus") as never) || undefined,
      searchText: url.searchParams.get("searchText") || undefined,
    });

    return NextResponse.json({ data: songs });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo cargar la biblioteca musical.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
