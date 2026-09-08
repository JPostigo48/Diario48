import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({
      data: {
        user: {
          id: String(user._id),
          email: user.email,
          displayName: user.displayName,
        },
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo resolver la sesión actual.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
