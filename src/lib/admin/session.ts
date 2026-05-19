import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, hashSessionToken } from "./crypto";
import { createAdminSession, deleteAdminSession, findValidAdminSession } from "./repository";

export const adminSessionCookieName = "jecheon_admin_session";
const sessionMaxAgeSeconds = 60 * 60 * 8;

export async function issueAdminSession(adminUserId: string) {
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + sessionMaxAgeSeconds * 1000).toISOString();

  await createAdminSession({ adminUserId, tokenHash, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: sessionMaxAgeSeconds,
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookieName)?.value;

  if (!token) {
    return null;
  }

  return findValidAdminSession(hashSessionToken(token));
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin");
  }

  return session;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookieName)?.value;

  if (token) {
    await deleteAdminSession(hashSessionToken(token));
  }

  cookieStore.delete(adminSessionCookieName);
}
