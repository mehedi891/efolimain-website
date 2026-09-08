/**
 * Shared scan endpoint for the lightweight /free-tools — POST { tool, url }.
 * Dispatches to the tool's analyzer, with per-URL cache + per-IP rate-limit.
 * Node runtime (server fetch/parse).
 */

import { getTool } from "@/lib/tools/registry";
import { normalizeUrl } from "@/lib/tools/http";
import { getCached, setCached } from "@/lib/tools/cache";
import { rateLimit, clientIp } from "@/lib/grader/rateLimit";
import { recordScan } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  if (!rateLimit(`tool:${clientIp(request)}`, 20)) {
    return Response.json({ success: false, message: "Too many requests. Please wait a few minutes." }, { status: 429 });
  }

  let body: { tool?: unknown; url?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const slug = typeof body.tool === "string" ? body.tool : "";
  const rawUrl = typeof body.url === "string" ? body.url : "";
  const tool = getTool(slug);
  if (!tool) return Response.json({ success: false, message: "Unknown tool." }, { status: 400 });
  if (!rawUrl.trim()) return Response.json({ success: false, message: "Please enter a URL." }, { status: 400 });

  let url: string;
  try {
    url = normalizeUrl(rawUrl);
  } catch (err) {
    return Response.json({ success: false, message: err instanceof Error ? err.message : "Invalid URL." }, { status: 400 });
  }

  // Record the use as soon as a valid store URL is submitted — no email needed.
  await recordScan({ tool: slug, storeUrl: url });

  const key = `${slug}:${url}`;
  const cached = getCached(key);
  if (cached) return Response.json({ success: true, result: cached, cached: true });

  try {
    const result = await tool.analyze(url);
    setCached(key, result);
    return Response.json({ success: true, result });
  } catch (err) {
    return Response.json(
      { success: false, message: err instanceof Error ? err.message : "Something went wrong." },
      { status: 400 },
    );
  }
}
