import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import {
  syncMusicLibraryFromYtMusic,
  type YtMusicSyncMode,
} from "@/features/music-tracker/import-sources/application/syncMusicLibraryFromYtMusic";
import { YtMusicImportSourceAdapter } from "@/features/music-tracker/import-sources/infrastructure/ytmusic/YtMusicImportSourceAdapter";
import { MongoImportedSourceRepository } from "@/features/music-tracker/import-sources/infrastructure/MongoImportedSourceRepository";
import { MongoSongRepository } from "@/features/music-tracker/library-core/infrastructure/MongoSongRepository";
import { MongoMusicProviderCredentialRepository } from "@/features/music-tracker/provider-credentials/infrastructure/MongoMusicProviderCredentialRepository";
import { MongoSongReviewTaskRepository } from "@/features/music-tracker/review-queue/infrastructure/MongoSongReviewTaskRepository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const body = (await request.json()) as { mode?: YtMusicSyncMode };
    const mode = body.mode ?? "all";

    if (!["all", "likes", "playlists"].includes(mode)) {
      return NextResponse.json({ error: "El modo de sincronización no es válido." }, { status: 400 });
    }

    const ownerId = String(auth.user._id);
    const credentialRepository = new MongoMusicProviderCredentialRepository();
    const providerSource = new YtMusicImportSourceAdapter(credentialRepository);

    const result = await syncMusicLibraryFromYtMusic({
      ownerId,
      mode,
      providerSource,
      credentialRepository,
      dependencies: {
        songRepository: new MongoSongRepository(),
        importedSourceRepository: new MongoImportedSourceRepository(),
        songReviewTaskRepository: new MongoSongReviewTaskRepository(),
      },
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo sincronizar la biblioteca desde YT Music.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
