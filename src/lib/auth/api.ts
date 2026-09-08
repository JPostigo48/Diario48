import "server-only";

import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth/session";

export function unauthorizedApiResponse() {
  return NextResponse.json({ error: "No autenticado." }, { status: 401 });
}

export async function requireApiUser() {
  const user = await requireCurrentUser();

  if (!user) {
    return {
      user: null,
      response: unauthorizedApiResponse(),
    };
  }

  return {
    user,
    response: null,
  };
}
