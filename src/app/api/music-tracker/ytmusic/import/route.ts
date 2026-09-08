import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import { importPlaylistFromProvider } from "@/features/music-tracker/import-sources/application/importPlaylistFromProvider";
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

    const body = (await request.json()) as { sourceRef?: string };
    const sourceRef = body.sourceRef?.trim();

    if (!sourceRef) {
      return NextResponse.json({ error: "Debes indicar un sourceRef para importar." }, { status: 400 });
    }

    const ownerId = String(auth.user._id);
    const credentialRepository = new MongoMusicProviderCredentialRepository();
    const adapter = new YtMusicImportSourceAdapter(credentialRepository);

    const result = await importPlaylistFromProvider({
      ownerId,
      providerSource: adapter,
      sourceRef,
      dependencies: {
        songRepository: new MongoSongRepository(),
        importedSourceRepository: new MongoImportedSourceRepository(),
        songReviewTaskRepository: new MongoSongReviewTaskRepository(),
      },
    });

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
        playlist: result.playlist,
        importedTracks: result.importedTracks.length,
        songs: result.songs.length,
      },
    });
  } catch (error) {
    try {
      const auth = await requireApiUser();
      if (!auth.response) {
        const ownerId = String(auth.user._id);
        const credentialRepository = new MongoMusicProviderCredentialRepository();
        const credential = await credentialRepository.getByOwnerAndProvider(ownerId, "ytmusic");
        if (credential) {
          await credentialRepository.save({
            ownerId,
            credential: {
              ...credential,
              status: "needs-refresh",
              lastError:
                error instanceof Error ? error.message : "No se pudo importar desde YT Music.",
            },
          });
        }
      }
    } catch {
      // noop: no ocultar el error principal por fallas al registrar trazabilidad
    }

    const message =
      error instanceof Error ? error.message : "No se pudo importar desde YT Music.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
