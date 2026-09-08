import { NextResponse } from "next/server";
import { ensureDefaultUserExists, findUserByEmailForAuth } from "@/lib/auth/users";
import { verifyPassword } from "@/lib/auth/passwords";
import { createSession, setAuthSessionCookie } from "@/lib/auth/session";
import { normalizeEmail } from "@/lib/auth/email";

export const dynamic = "force-dynamic";

type LoginPayload = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    await ensureDefaultUserExists();

    const payload = (await request.json()) as LoginPayload;
    const email = typeof payload.email === "string" ? normalizeEmail(payload.email) : "";
    const password = typeof payload.password === "string" ? payload.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son obligatorios." },
        { status: 400 },
      );
    }

    const user = await findUserByEmailForAuth(email);

    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
    }

    const passwordIsValid = await verifyPassword(password, user.passwordHash);

    if (!passwordIsValid) {
      return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
    }

    const session = await createSession(String(user._id));
    await setAuthSessionCookie(session.token, session.expiresAt);

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
      error instanceof Error ? error.message : "No se pudo iniciar sesión.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
