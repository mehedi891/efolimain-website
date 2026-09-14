/**
 * Google PageSpeed Insights API client (Lighthouse + CrUX field data).
 *
 * Docs: https://developers.google.com/speed/docs/insights/v5/get-started
 * Free tier: 25,000 req/day with an API key (PAGESPEED_API_KEY). Works without a
 * key at a lower, shared quota — fine for local dev. One URL per request, so we
 * call it once per (page, strategy).
 *
 * We prefer real-user field data (CrUX) when present and fall back to Lighthouse
 * lab data, recording which source each metric came from.
 */

import type { Device } from "./types";

const PSI_ENDPOINT =
  "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

/** Timeout for a single PSI call — the API can take 10-30s. */
const PSI_TIMEOUT_MS = 45_000;

export interface PageSpeedData {
  strategy: Device;
  fetchedOk: boolean;
  /** 0..100 Lighthouse category scores (null if unavailable). */
  performanceScore: number | null;
  seoScore: number | null;
  bestPracticesScore: number | null;
  accessibilityScore: number | null;
  /** Core Web Vitals (LCP/INP/TTFB in ms, CLS unitless). */
  lcpMs: number | null;
  clsScore: number | null;
  inpMs: number | null;
  ttfbMs: number | null;
  tbtMs: number | null;
  /** First Contentful Paint (ms, lab). */
  fcpMs: number | null;
  /** Whether CWV came from field (CrUX) or lab (Lighthouse). */
  cwvSource: "field" | "lab" | "none";
  /** Diagnostics for findings. */
  renderBlockingMs: number | null;
  /** Lighthouse render-blocking-resources score (0..1); 1 = nothing blocking. */
  renderBlockingScore: number | null;
  totalByteBytes: number | null;
  /** Efficient asset caching (0..1), derived from uses-long-cache-ttl. */
  cacheScore: number | null;
  /** Lighthouse LCP-image priority/preload audit score (0..1). */
  lcpPreloadScore: number | null;
  /** Third-party entities on the rendered page + their total main-thread blocking (ms). */
  thirdPartyCount: number | null;
  thirdPartyBlockingMs: number | null;
  /** The element/image that is the Largest Contentful Paint (what to optimize). */
  lcpElement: string | null;
  /** Final rendered screenshot as a data URI (from Lighthouse). */
  screenshotDataUri: string | null;
}

interface PsiMetric {
  percentile?: number;
}
interface PsiNode {
  snippet?: string;
  nodeLabel?: string;
}
interface PsiListItem {
  node?: PsiNode;
  items?: PsiListItem[];
  /** third-party / opportunity entries. */
  entity?: string;
  blockingTime?: number;
  mainThreadTime?: number;
  wastedMs?: number;
}

/** Sum a numeric field across list items. */
function sumField(items: PsiListItem[] | undefined, field: "wastedMs" | "blockingTime" | "mainThreadTime"): number | null {
  if (!Array.isArray(items)) return null;
  return Math.round(items.reduce((s, it) => s + (typeof it[field] === "number" ? (it[field] as number) : 0), 0));
}
interface PsiAudit {
  numericValue?: number;
  score?: number | null;
  details?: {
    data?: string;
    overallSavingsMs?: number;
    items?: PsiListItem[];
  };
}

/** Pull the first element snippet/label from an audit's nested details list. */
function firstNode(items: PsiListItem[] | undefined): string | null {
  if (!Array.isArray(items)) return null;
  for (const it of items) {
    if (it.node?.snippet) return it.node.snippet;
    if (it.node?.nodeLabel) return it.node.nodeLabel;
    const nested = firstNode(it.items);
    if (nested) return nested;
  }
  return null;
}
interface PsiResponse {
  loadingExperience?: {
    metrics?: Record<string, PsiMetric>;
  };
  lighthouseResult?: {
    categories?: Record<string, { score?: number | null }>;
    audits?: Record<string, PsiAudit>;
  };
}

function toScore100(score: number | null | undefined): number | null {
  return typeof score === "number" ? Math.round(score * 100) : null;
}

/**
 * Run PSI for one URL + strategy. Never throws — returns `fetchedOk: false` on
 * any failure so the orchestrator can produce a partial report.
 */
export async function runPageSpeed(
  url: string,
  strategy: Device,
): Promise<PageSpeedData> {
  const empty: PageSpeedData = {
    strategy,
    fetchedOk: false,
    performanceScore: null,
    seoScore: null,
    bestPracticesScore: null,
    accessibilityScore: null,
    lcpMs: null,
    clsScore: null,
    inpMs: null,
    ttfbMs: null,
    tbtMs: null,
    fcpMs: null,
    cwvSource: "none",
    renderBlockingMs: null,
    renderBlockingScore: null,
    totalByteBytes: null,
    cacheScore: null,
    lcpPreloadScore: null,
    thirdPartyCount: null,
    thirdPartyBlockingMs: null,
    lcpElement: null,
    screenshotDataUri: null,
  };

  const params = new URLSearchParams({ url, strategy });
  for (const cat of ["performance", "seo", "best-practices", "accessibility"]) {
    params.append("category", cat);
  }
  const key = process.env.PAGESPEED_API_KEY;
  if (key) params.append("key", key);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PSI_TIMEOUT_MS);
  let json: PsiResponse;
  try {
    const res = await fetch(`${PSI_ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
      // PSI results are stable enough to cache briefly at the fetch layer.
      cache: "no-store",
    });
    if (!res.ok) return empty;
    json = (await res.json()) as PsiResponse;
  } catch {
    return empty;
  } finally {
    clearTimeout(timer);
  }

  const cats = json.lighthouseResult?.categories ?? {};
  const audits = json.lighthouseResult?.audits ?? {};
  const field = json.loadingExperience?.metrics ?? {};

  // Prefer field (CrUX) CWV; fall back to lab audits.
  const fieldLcp = field.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null;
  // CrUX CLS percentile is ×100 (e.g. 5 → 0.05).
  const fieldClsRaw = field.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile;
  const fieldCls = typeof fieldClsRaw === "number" ? fieldClsRaw / 100 : null;
  const fieldInp = field.INTERACTION_TO_NEXT_PAINT?.percentile ?? null;
  const fieldTtfb = field.EXPERIMENTAL_TIME_TO_FIRST_BYTE?.percentile ?? null;

  const labLcp = audits["largest-contentful-paint"]?.numericValue ?? null;
  const labCls = audits["cumulative-layout-shift"]?.numericValue ?? null;
  const labTbt = audits["total-blocking-time"]?.numericValue ?? null;
  const labTtfb = audits["server-response-time"]?.numericValue ?? null;

  const hasField = fieldLcp != null || fieldCls != null || fieldInp != null;

  return {
    strategy,
    fetchedOk: true,
    performanceScore: toScore100(cats.performance?.score),
    seoScore: toScore100(cats.seo?.score),
    bestPracticesScore: toScore100(cats["best-practices"]?.score),
    accessibilityScore: toScore100(cats.accessibility?.score),
    lcpMs: hasField ? fieldLcp : labLcp,
    clsScore: hasField ? fieldCls : labCls,
    inpMs: fieldInp, // INP is field-only
    ttfbMs: hasField ? fieldTtfb : labTtfb,
    tbtMs: labTbt,
    fcpMs: audits["first-contentful-paint"]?.numericValue ?? null,
    cwvSource: hasField ? "field" : labLcp != null ? "lab" : "none",
    // Lighthouse 12+ renamed these to "*-insight" audits; fall back to the older
    // keys for stores still served by an older Lighthouse.
    renderBlockingMs: (() => {
      const a = audits["render-blocking-insight"];
      if (a?.details?.items) return sumField(a.details.items, "wastedMs");
      return audits["render-blocking-resources"]?.details?.overallSavingsMs ?? null;
    })(),
    // Present but score-less = notApplicable = nothing blocking = pass (1).
    renderBlockingScore: (() => {
      const a = audits["render-blocking-insight"] ?? audits["render-blocking-resources"];
      return a ? (a.score ?? 1) : null;
    })(),
    totalByteBytes: audits["total-byte-weight"]?.numericValue ?? null,
    cacheScore: (() => {
      const a = audits["cache-insight"] ?? audits["uses-long-cache-ttl"];
      if (!a) return null;
      if (typeof a.score === "number") return a.score;
      const items = a.details?.items;
      if (Array.isArray(items)) return items.length === 0 ? 1 : 0.4;
      return 1; // audit ran, nothing flagged → efficient caching
    })(),
    lcpPreloadScore:
      audits["lcp-discovery-insight"]?.score ??
      audits["prioritize-lcp-image"]?.score ??
      audits["preload-lcp-image"]?.score ??
      null,
    thirdPartyCount: (() => {
      const items = (audits["third-parties-insight"] ?? audits["third-party-summary"])?.details?.items;
      return Array.isArray(items) ? items.length : null;
    })(),
    thirdPartyBlockingMs: (() => {
      const items = (audits["third-parties-insight"] ?? audits["third-party-summary"])?.details?.items;
      return sumField(items, "blockingTime") ?? sumField(items, "mainThreadTime");
    })(),
    lcpElement:
      firstNode(audits["lcp-discovery-insight"]?.details?.items) ??
      firstNode(audits["lcp-breakdown-insight"]?.details?.items) ??
      firstNode(audits["largest-contentful-paint-element"]?.details?.items),
    screenshotDataUri: audits["final-screenshot"]?.details?.data ?? null,
  };
}
