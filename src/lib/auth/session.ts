import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db/mongodb";
import AuthSessionModel from "@/lib/models/AuthSession";
import { findUserById } from "@/lib/auth/users";

export const AUTH_SESSION_COOKIE_NAME = "d48_session";

const SESSION_TOKEN_BYTES = 32;
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function generateSessionToken() {
  return randomBytes(SESSION_TOKEN_BYTES).toString("base64url");
}

export function getSessionExpiryDate() {
  return new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
}

export async function createSession(userId: string) {
  await connectToDatabase();

  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = getSessionExpiryDate();

  await AuthSessionModel.create({
    userId,
    tokenHash,
    expiresAt,
    lastSeenAt: new Date(),
  });

  return {
    token,
    expiresAt,
  };
}

export async function setAuthSessionCookie(sessionToken: string, expiresAt: Date) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: AUTH_SESSION_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearAuthSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_SESSION_COOKIE_NAME);
}

export async function getSessionTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value ?? null;
}

export async function invalidateSessionByToken(sessionToken: string) {
  await connectToDatabase();

  await AuthSessionModel.deleteOne({
    tokenHash: hashSessionToken(sessionToken),
  }).exec();
}

export async function invalidateCurrentSession() {
  const sessionToken = await getSessionTokenFromCookies();

  if (sessionToken) {
    await invalidateSessionByToken(sessionToken);
  }

  await clearAuthSessionCookie();
}

export async function getCurrentSession() {
  await connectToDatabase();

  const sessionToken = await getSessionTokenFromCookies();

  if (!sessionToken) {
    return null;
  }

  const tokenHash = hashSessionToken(sessionToken);

  const session = await AuthSessionModel.findOne({ tokenHash }).exec();

  if (!session) {
    await clearAuthSessionCookie();
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await AuthSessionModel.deleteOne({ _id: session._id }).exec();
    await clearAuthSessionCookie();
    return null;
  }

  await AuthSessionModel.updateOne(
    { _id: session._id },
    {
      $set: {
        lastSeenAt: new Date(),
      },
    },
  ).exec();

  return session;
}

export async function getCurrentUser() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  const user = await findUserById(String(session.userId));

  if (!user) {
    await AuthSessionModel.deleteOne({ _id: session._id }).exec();
    await clearAuthSessionCookie();
    return null;
  }

  return user;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return user;
}
