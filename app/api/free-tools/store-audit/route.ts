/**
 * Free Shopify Store Audit (scan) — POST /api/free-tools/store-audit
 *
 * Body: { url }. Runs the deterministic audit (PageSpeed + rules) and returns
 * the Report JSON for the on-page teaser. No email required here — email is
 * captured later via the "unlock" step (POST .../store-audit/send) which emails
 * the full report and forwards the lead.
 *
 * Node.js runtime (default): PageSpeed calls + HTML parsing need Node APIs —
 * must NOT move to Edge.
 *
 * Caching + rate-limit land in Phase 5.
 */

import { runAudit, normalizeUrl } from "@/lib/grader";
import { getCachedReport, setCachedReport } from "@/lib/grader/cache";
import { rateLimit, clientIp } from "@/lib/grader/rateLimit";
import { recordScan } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// A scan runs two PageSpeed calls (~10-30s each) plus a fetch; allow headroom.
export const maxDuration = 120;

export async function POST(request: Request) {
  if (!rateLimit(`scan:${clientIp(request)}`)) {
    return Response.json(
      { success: false, message: "Too many audits from this network. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let body: { url?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const url = typeof body.url === "string" ? body.url : "";
  if (!url.trim()) {
    return Response.json({ success: false, message: "Please enter your store URL." }, { status: 400 });
  }

  // Normalize + serve a fresh cached report if we have one (protects PSI quota).
  let normalized: string;
  try {
    normalized = normalizeUrl(url);
  } catch (err) {
    return Response.json(
      { success: false, message: err instanceof Error ? err.message : "Invalid URL." },
      { status: 400 },
    );
  }

  // Record the use as soon as a valid store URL is submitted — no email needed.
  await recordScan({ tool: "shopify-store-audit", storeUrl: normalized });

  const cached = getCachedReport(normalized);
  if (cached) {
    return Response.json({ success: true, report: cached, cached: true });
  }

  try {
    const report = await runAudit({ url: normalized });
    setCachedReport(normalized, report);
    return Response.json({ success: true, report });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong running the audit.";
    return Response.json({ success: false, message }, { status: 400 });
  }
}
