import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import { MongoSongReviewTaskRepository } from "@/features/music-tracker/review-queue/infrastructure/MongoSongReviewTaskRepository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const url = new URL(request.url);
    const ownerId = String(auth.user._id);
    const repository = new MongoSongReviewTaskRepository();
    const tasks = await repository.list({
      ownerId,
      status: (url.searchParams.get("status") as never) || undefined,
      priority: (url.searchParams.get("priority") as never) || undefined,
      action: (url.searchParams.get("action") as never) || undefined,
      songId: url.searchParams.get("songId") || undefined,
    });

    return NextResponse.json({ data: tasks });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo cargar la cola de revisión.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
