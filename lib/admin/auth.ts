/**
 * Admin session auth — a stateless, HMAC-signed token in an httpOnly cookie.
 *
 * No JWT library needed: the token is `base64url(payload).base64url(HMAC-SHA256)`
 * signed with ADMIN_SESSION_SECRET. Tokens carry the admin email + an expiry and
 * are verified with a timing-safe comparison. Password checking lives in
 * ./users (bcrypt); this file only mints/verifies the session.
 */

import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "efoli_admin";
const MAX_AGE_S = 60 * 60 * 8; // 8 hours

export interface AdminSession {
  email: string;
}

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function sign(input: string): string {
  return crypto.createHmac("sha256", secret()).update(input).digest("base64url");
}

/** Mint a signed session token for the given admin email. */
export function signSession(email: string): string {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + MAX_AGE_S * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Verify a token string → session, or null if missing/invalid/expired. */
export function verifyToken(token: string | undefined | null): AdminSession | null {
  if (!token || !secret()) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.email !== "string" || typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return { email: data.email };
  } catch {
    return null;
  }
}

/** Cookie options for the session cookie. */
export function sessionCookie(value: string) {
  return {
    name: ADMIN_COOKIE,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_S,
  };
}

/** Read the current admin session from cookies (server components / routes). */
export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  return verifyToken(jar.get(ADMIN_COOKIE)?.value);
}

/** Guard a protected admin page: redirect to /admin/login if not signed in. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
