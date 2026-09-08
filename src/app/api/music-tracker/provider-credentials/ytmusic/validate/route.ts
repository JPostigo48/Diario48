import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import { MongoMusicProviderCredentialRepository } from "@/features/music-tracker/provider-credentials/infrastructure/MongoMusicProviderCredentialRepository";
import { validateYtMusicCredential } from "@/features/music-tracker/provider-credentials/application/validateYtMusicCredential";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const ownerId = String(auth.user._id);
    const repository = new MongoMusicProviderCredentialRepository();
    const summary = await validateYtMusicCredential({ ownerId, repository });

    return NextResponse.json({ data: summary });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo validar la credencial de YT Music.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
