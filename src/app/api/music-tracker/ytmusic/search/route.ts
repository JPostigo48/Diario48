import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import { searchSongsInYtMusic } from "@/features/music-tracker/import-sources/application/searchSongsInYtMusic";
import { YtMusicImportSourceAdapter } from "@/features/music-tracker/import-sources/infrastructure/ytmusic/YtMusicImportSourceAdapter";
import { MongoMusicProviderCredentialRepository } from "@/features/music-tracker/provider-credentials/infrastructure/MongoMusicProviderCredentialRepository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const url = new URL(request.url);
    const query = url.searchParams.get("query") ?? "";
    const limit = Number(url.searchParams.get("limit") ?? "10");
    const ownerId = String(auth.user._id);

    const results = await searchSongsInYtMusic({
      ownerId,
      query,
      limit: Number.isFinite(limit) ? limit : 10,
      providerSource: new YtMusicImportSourceAdapter(new MongoMusicProviderCredentialRepository()),
    });

    return NextResponse.json({ data: results });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo buscar en YT Music.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
