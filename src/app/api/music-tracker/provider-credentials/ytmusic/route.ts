import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import { MongoMusicProviderCredentialRepository } from "@/features/music-tracker/provider-credentials/infrastructure/MongoMusicProviderCredentialRepository";
import { getYtMusicCredentialStatus } from "@/features/music-tracker/provider-credentials/application/getYtMusicCredentialStatus";
import { saveYtMusicCredential } from "@/features/music-tracker/provider-credentials/application/saveYtMusicCredential";
import { deleteYtMusicCredential } from "@/features/music-tracker/provider-credentials/application/deleteYtMusicCredential";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const ownerId = String(auth.user._id);
    const repository = new MongoMusicProviderCredentialRepository();
    const summary = await getYtMusicCredentialStatus({ ownerId, repository });

    return NextResponse.json({ data: summary });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo consultar el estado de la credencial de YT Music.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const body = (await request.json()) as {
      browserJson?: string;
    };

    const ownerId = String(auth.user._id);
    const repository = new MongoMusicProviderCredentialRepository();
    const summary = await saveYtMusicCredential({
      ownerId,
      rawCredential: body.browserJson ?? "",
      repository,
    });

    return NextResponse.json({ data: summary });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo guardar la credencial de YT Music.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const ownerId = String(auth.user._id);
    const repository = new MongoMusicProviderCredentialRepository();
    await deleteYtMusicCredential({ ownerId, repository });

    return NextResponse.json({
      data: {
        provider: "ytmusic",
        hasCredential: false,
        status: "not-configured",
        lastError: "",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo eliminar la credencial de YT Music.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
