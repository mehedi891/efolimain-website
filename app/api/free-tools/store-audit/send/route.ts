/**
 * Unlock / send full report — POST /api/free-tools/store-audit/send
 *
 * Called when the visitor unlocks the full report by entering their email.
 * Emails the full report (+ PDF) to the visitor and forwards the lead to eFoli,
 * then returns success so the UI reveals the full report.
 *
 * The client posts the report it already has (avoids a second full scan). Email
 * failures do NOT block the reveal — we still return success with a note, since
 * the on-page report is the primary deliverable.
 *
 * Node.js runtime: nodemailer + headless-Chrome PDF need Node APIs.
 */

import type { Report } from "@/lib/grader/types";
import { runAudit } from "@/lib/grader";
import { sendReportEmail } from "@/lib/grader/reportEmail";
import { rateLimit, clientIp } from "@/lib/grader/rateLimit";
import { saveLead } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// PDF generation (headless Chrome) can take a few seconds.
export const maxDuration = 60;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!rateLimit(`send:${clientIp(request)}`)) {
    return Response.json(
      { success: false, message: "Too many requests. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let body: { url?: unknown; email?: unknown; name?: unknown; report?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const url = typeof body.url === "string" ? body.url.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!url) {
    return Response.json({ success: false, message: "Missing store URL." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
  }

  // Use the report the client already computed; fall back to a fresh scan.
  let report: Report;
  if (body.report && typeof body.report === "object") {
    report = { ...(body.report as Report), url, email };
  } else {
    try {
      report = await runAudit({ url, email });
    } catch {
      return Response.json({ success: false, message: "Couldn't generate the report. Please try again." }, { status: 400 });
    }
  }

  console.log(`[store-audit] lead captured: ${email} → ${url}`);

  // Persist the lead (best-effort — never blocks the email or reveal).
  await saveLead({ email, name, storeUrl: url, tool: "shopify-store-audit" });

  try {
    const result = await sendReportEmail(report);
    return Response.json({
      success: true,
      emailed: result.emailed,
      message: result.emailed ? "Your full report is unlocked. We've emailed you a copy." : "Your full report is unlocked.",
    });
  } catch (err) {
    // Email failed — still unlock the on-page report.
    console.error("[store-audit] report email failed:", err);
    return Response.json({
      success: true,
      emailed: false,
      message: "Your full report is unlocked. (We couldn't email a copy — please save this page.)",
    });
  }
}
