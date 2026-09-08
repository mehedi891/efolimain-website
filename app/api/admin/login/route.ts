/**
 * Admin login — POST { email, password }. Verifies against admin_users
 * (bcrypt) and sets a signed, httpOnly session cookie. Rate-limited.
 */

import { cookies } from "next/headers";
import { verifyAdmin } from "@/lib/admin/users";
import { signSession, sessionCookie } from "@/lib/admin/auth";
import { rateLimit, clientIp } from "@/lib/grader/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!rateLimit(`adminlogin:${clientIp(request)}`, 10)) {
    return Response.json({ success: false, message: "Too many attempts. Please wait a few minutes." }, { status: 429 });
  }

  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return Response.json({ success: false, message: "Email and password are required." }, { status: 400 });
  }

  const ok = await verifyAdmin(email, password);
  if (!ok) {
    return Response.json({ success: false, message: "Invalid email or password." }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(sessionCookie(signSession(email.toLowerCase())));
  return Response.json({ success: true });
}
