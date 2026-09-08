import { NextResponse } from "next/server";
import { invalidateCurrentSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await invalidateCurrentSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo cerrar sesión.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
