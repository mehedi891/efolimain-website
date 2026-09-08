/**
 * Unlock / email a tool result — POST { tool, email, result }.
 * Emails the report to the visitor + forwards the lead to eFoli, then returns
 * success so the UI reveals the full result (email failure doesn't block reveal).
 */

import type { ToolResult } from "@/lib/tools/types";
import { getTool } from "@/lib/tools/registry";
import { sendToolEmail } from "@/lib/tools/email";
import { rateLimit, clientIp } from "@/lib/grader/rateLimit";
import { saveLead } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!rateLimit(`toolsend:${clientIp(request)}`, 20)) {
    return Response.json({ success: false, message: "Too many requests. Please wait a few minutes." }, { status: 429 });
  }

  let body: { tool?: unknown; email?: unknown; name?: unknown; result?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const slug = typeof body.tool === "string" ? body.tool : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const tool = getTool(slug);

  if (!tool) return Response.json({ success: false, message: "Unknown tool." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return Response.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
  if (!body.result || typeof body.result !== "object") {
    return Response.json({ success: false, message: "Missing result." }, { status: 400 });
  }

  const result = body.result as ToolResult;
  console.log(`[free-tools] lead: ${email} → ${slug} → ${result.host}`);

  // Persist the lead (best-effort — never blocks the email or reveal).
  await saveLead({ email, name, storeUrl: result.host || result.url, tool: slug });

  try {
    const { emailed } = await sendToolEmail(result, email, tool.name);
    return Response.json({
      success: true,
      emailed,
      message: emailed ? "Unlocked — we've emailed you a copy." : "Unlocked.",
    });
  } catch (err) {
    console.error("[free-tools] email failed:", err);
    return Response.json({ success: true, emailed: false, message: "Unlocked. (Couldn't email a copy right now.)" });
  }
}
