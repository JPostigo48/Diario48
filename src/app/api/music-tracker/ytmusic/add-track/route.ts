import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import { importSingleTrackFromSource } from "@/features/music-tracker/import-sources/application/importSingleTrackFromSource";
import type { SearchableTrackSummary } from "@/features/music-tracker/import-sources/application/ports/ImportSourcePort";
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

    const body = (await request.json()) as { track?: SearchableTrackSummary };

    if (!body.track?.externalTrackId || !body.track.title) {
      return NextResponse.json({ error: "Debes enviar un track válido para agregarlo." }, { status: 400 });
    }

    const ownerId = String(auth.user._id);
    const result = await importSingleTrackFromSource({
      ownerId,
      track: body.track,
      importedSourceRepository: new MongoImportedSourceRepository(),
      songRepository: new MongoSongRepository(),
      songReviewTaskRepository: new MongoSongReviewTaskRepository(),
    });

    const credentialRepository = new MongoMusicProviderCredentialRepository();
    const credential = await credentialRepository.getByOwnerAndProvider(ownerId, "ytmusic");
    if (credential) {
      await credentialRepository.save({
        ownerId,
        credential: {
          ...credential,
          status: "valid",
          lastSyncAt: new Date().toISOString(),
          lastError: "",
        },
      });
    }

    return NextResponse.json({
      data: {
        song: result.song,
        track: result.track,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo agregar la canción desde YT Music.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
