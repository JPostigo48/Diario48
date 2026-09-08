import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import { YtMusicImportSourceAdapter } from "@/features/music-tracker/import-sources/infrastructure/ytmusic/YtMusicImportSourceAdapter";
import { MongoMusicProviderCredentialRepository } from "@/features/music-tracker/provider-credentials/infrastructure/MongoMusicProviderCredentialRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const ownerId = String(auth.user._id);
    const adapter = new YtMusicImportSourceAdapter(new MongoMusicProviderCredentialRepository());
    const sources = await adapter.listSources(ownerId);

    return NextResponse.json({ data: sources });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudieron cargar las fuentes de YT Music.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
