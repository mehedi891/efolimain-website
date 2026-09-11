/**
 * Audit orchestrator: normalize URL → run collectors → score → Report.
 *
 * Phase 1 populates the Performance, Mobile, SEO, and Trust pillars from live
 * PageSpeed Insights data (deterministic thresholds — no AI). CRO and App-health
 * pillars are placeholders here; they come from the HTML scan in Phase 2.
 */

import type { Check, Report, Shot, Status } from "./types";
import { runPageSpeed, type PageSpeedData } from "./pagespeed";
import { buildPillar, headlineScore, gradeFromScore, topFixes } from "./scoring";
import { computeBfcm, BFCM_MANUAL_CHECKLIST } from "./bfcm";
import { scanSite } from "./fetchHtml";
import { getTitle, looksBlocked } from "./html";
import { detectShopify } from "./detectShopify";
import { seoChecks } from "./seo";
import { trustChecks } from "./trust";
import { croChecks, collectionChecks, cartChecks } from "./cro";
import { appChecks } from "./apps";
import { buildPages } from "./pages";
import type { CheckScope } from "./types";

const REF = {
  lcp: "https://web.dev/articles/lcp",
  cls: "https://web.dev/articles/cls",
  inp: "https://web.dev/articles/inp",
  ttfb: "https://web.dev/articles/ttfb",
  perf: "https://web.dev/explore/learn-core-web-vitals",
  images: "https://web.dev/articles/uses-optimized-images",
  renderBlocking: "https://web.dev/articles/render-blocking-resources",
  seo: "https://www.shopify.com/blog/ecommerce-seo-audit",
  mobile: "https://web.dev/articles/responsive-web-design-basics",
  https: "https://web.dev/articles/is-on-https",
} as const;

/** Which page each check is derived from (collection/cart checks self-tag). */
const PAGE_BY_ID: Record<string, CheckScope> = {
  "perf-score": "home", lcp: "home", fcp: "home", cls: "home", inp: "home", ttfb: "home",
  tbt: "home", "render-blocking": "home", "page-weight": "home", "product-perf-score": "product",
  "mobile-perf": "home", "mobile-cls": "home", "mobile-a11y": "home",
  "seo-lighthouse": "home", "seo-title": "home", "seo-meta-description": "home",
  "seo-h1": "home", "seo-canonical": "home", "seo-og": "home",
  "seo-structured-data": "product", "seo-robots": "store", "seo-sitemap": "store",
  "trust-best-practices": "store", "trust-https": "store", "trust-mixed-content": "home",
  "trust-policies": "home", "trust-badges": "home",
  "cro-atc": "product", "cro-reviews": "product", "cro-shipping": "product",
  "cro-offer-bar": "home", "cro-urgency": "product",
  "apps-count": "store", "apps-third-party-scripts": "store",
};

/** Normalize a user-supplied URL to an absolute https origin+path. Throws if invalid. */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Please enter your store URL.");
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let u: URL;
  try {
    u = new URL(withProto);
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Only http(s) URLs are supported.");
  }
  // Force https; drop hash; keep pathname.
  u.protocol = "https:";
  u.hash = "";
  return u.toString();
}

/** Status for a "lower is better" metric against good/warn thresholds. */
function lowerIsBetter(
  value: number | null,
  goodMax: number,
  warnMax: number,
): Status {
  if (value == null) return "na";
  if (value <= goodMax) return "pass";
  if (value <= warnMax) return "warn";
  return "fail";
}

/** Status for a "higher is better" score (0..100) against good/warn thresholds. */
function higherIsBetter(
  value: number | null,
  goodMin: number,
  warnMin: number,
): Status {
  if (value == null) return "na";
  if (value >= goodMin) return "pass";
  if (value >= warnMin) return "warn";
  return "fail";
}

function fmtMs(ms: number | null): string {
  if (ms == null) return "n/a";
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
}

/** Collapse whitespace and cap length — for showing a found snippet/value. */
function truncate(s: string, n: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

function buildPerformanceChecks(mobile: PageSpeedData, desktop: PageSpeedData): Check[] {
  // Mobile is the weighted reference (majority of Shopify traffic).
  const src = mobile.fetchedOk ? mobile : desktop;
  const checks: Check[] = [
    {
      id: "perf-score",
      label: "Lighthouse performance score (mobile)",
      status: higherIsBetter(mobile.performanceScore, 90, 50),
      tier: "measured",
      value: mobile.performanceScore != null ? `${mobile.performanceScore}/100` : undefined,
      impact: "H",
      effort: "M",
      fix: "Improve the core issues below (images, render-blocking scripts, server response) to lift the overall score.",
      ref: REF.perf,
      weight: 1.5,
    },
    {
      id: "lcp",
      label: "Largest Contentful Paint (LCP)",
      status: lowerIsBetter(src.lcpMs, 2500, 4000),
      tier: "measured",
      value: `${fmtMs(src.lcpMs)} (${src.cwvSource})`,
      current: src.lcpElement ? `Largest element: ${truncate(src.lcpElement, 160)}` : undefined,
      impact: "H",
      effort: "M",
      fix: "Compress and preload the largest above-the-fold image; serve WebP/AVIF and correct sizing.",
      ref: REF.lcp,
      weight: 1.5,
    },
    {
      id: "fcp",
      label: "First Contentful Paint (FCP)",
      status: lowerIsBetter(src.fcpMs, 1800, 3000),
      tier: "measured",
      value: fmtMs(src.fcpMs),
      impact: "M",
      effort: "M",
      fix: "Cut server response time and render-blocking CSS/JS so the first content paints sooner.",
      ref: REF.perf,
    },
    {
      id: "cls",
      label: "Cumulative Layout Shift (CLS)",
      status: lowerIsBetter(src.clsScore, 0.1, 0.25),
      tier: "measured",
      value: src.clsScore != null ? src.clsScore.toFixed(3) : "n/a",
      impact: "M",
      effort: "M",
      fix: "Set explicit width/height on images and reserve space for banners/ads so content doesn't jump.",
      ref: REF.cls,
    },
    {
      id: "inp",
      label: "Interaction to Next Paint (INP)",
      status: lowerIsBetter(src.inpMs, 200, 500),
      tier: "measured",
      value: src.inpMs != null ? fmtMs(src.inpMs) : "no field data",
      note: src.inpMs == null
        ? "Needs real-user data (Chrome UX Report), which only exists once a store gets enough traffic — so it can't be measured yet."
        : undefined,
      impact: "M",
      effort: "H",
      fix: "Reduce heavy third-party JavaScript so taps and clicks respond quickly.",
      ref: REF.inp,
    },
    {
      id: "ttfb",
      label: "Time to First Byte (TTFB)",
      status: lowerIsBetter(src.ttfbMs, 800, 1800),
      tier: "measured",
      value: fmtMs(src.ttfbMs),
      impact: "M",
      effort: "H",
      fix: "Trim server-side app/theme work and rely on Shopify's CDN caching for faster first byte.",
      ref: REF.ttfb,
    },
    {
      id: "tbt",
      label: "Total Blocking Time (TBT)",
      status: lowerIsBetter(src.tbtMs, 200, 600),
      tier: "measured",
      value: fmtMs(src.tbtMs),
      impact: "M",
      effort: "H",
      fix: "Break up long JavaScript tasks and defer non-critical third-party scripts so the main thread stays responsive.",
      ref: REF.perf,
    },
    {
      id: "render-blocking",
      label: "Render-blocking resources",
      status: lowerIsBetter(src.renderBlockingMs, 150, 600),
      tier: "measured",
      value: src.renderBlockingMs != null ? `~${fmtMs(src.renderBlockingMs)} potential savings` : "n/a",
      impact: "M",
      effort: "M",
      fix: "Defer or async non-critical scripts and inline critical CSS to unblock first paint.",
      ref: REF.renderBlocking,
    },
    {
      id: "page-weight",
      label: "Total page weight",
      status: lowerIsBetter(
        src.totalByteBytes != null ? src.totalByteBytes / 1_048_576 : null,
        2,
        4,
      ),
      tier: "measured",
      value: src.totalByteBytes != null ? `${(src.totalByteBytes / 1_048_576).toFixed(1)} MB` : "n/a",
      impact: "M",
      effort: "M",
      fix: "Optimize images and remove unused app scripts to cut the total bytes shipped.",
      ref: REF.images,
    },
  ];
  return checks;
}

function buildMobileChecks(mobile: PageSpeedData): Check[] {
  return [
    {
      id: "mobile-perf",
      label: "Mobile performance score",
      status: higherIsBetter(mobile.performanceScore, 90, 50),
      tier: "measured",
      value: mobile.performanceScore != null ? `${mobile.performanceScore}/100` : undefined,
      impact: "H",
      effort: "M",
      fix: "Over 70% of Shopify traffic is mobile — prioritize mobile speed fixes first.",
      ref: REF.mobile,
      weight: 1.5,
    },
    {
      id: "mobile-cls",
      label: "Mobile layout stability (CLS)",
      status: lowerIsBetter(mobile.clsScore, 0.1, 0.25),
      tier: "measured",
      value: mobile.clsScore != null ? mobile.clsScore.toFixed(3) : "n/a",
      impact: "M",
      effort: "M",
      fix: "Prevent buttons and prices from shifting as the page loads on small screens.",
      ref: REF.cls,
    },
    {
      id: "mobile-a11y",
      label: "Accessibility (tap targets & legibility)",
      status: higherIsBetter(mobile.accessibilityScore, 90, 70),
      tier: "measured",
      value: mobile.accessibilityScore != null ? `${mobile.accessibilityScore}/100` : undefined,
      impact: "M",
      effort: "M",
      fix: "Ensure tap targets are large enough and text is legible without zooming.",
      ref: REF.mobile,
    },
  ];
}

function buildSeoChecks(mobile: PageSpeedData): Check[] {
  // Phase 1: Lighthouse SEO category (on-page basics). Phase 2 adds HTML/schema/robots checks.
  return [
    {
      id: "seo-lighthouse",
      label: "On-page SEO basics (Lighthouse)",
      status: higherIsBetter(mobile.seoScore, 90, 70),
      tier: "measured",
      value: mobile.seoScore != null ? `${mobile.seoScore}/100` : undefined,
      impact: "M",
      effort: "L",
      fix: "Fix missing titles/meta descriptions, crawlability, and mobile-friendliness flagged by Lighthouse.",
      ref: REF.seo,
    },
  ];
}

function buildTrustChecks(mobile: PageSpeedData): Check[] {
  // Phase 1: Lighthouse best-practices (HTTPS, console errors, safe libs).
  return [
    {
      id: "trust-best-practices",
      label: "Security & best practices (HTTPS, no mixed content)",
      status: higherIsBetter(mobile.bestPracticesScore, 90, 70),
      tier: "measured",
      value: mobile.bestPracticesScore != null ? `${mobile.bestPracticesScore}/100` : undefined,
      impact: "M",
      effort: "L",
      fix: "Serve everything over HTTPS with no mixed content and resolve console/security warnings.",
      ref: REF.https,
    },
  ];
}

function screenshotsFrom(mobile: PageSpeedData, desktop: PageSpeedData): Shot[] {
  const shots: Shot[] = [];
  if (mobile.screenshotDataUri) shots.push({ page: "home", device: "mobile", dataUri: mobile.screenshotDataUri });
  if (desktop.screenshotDataUri) shots.push({ page: "home", device: "desktop", dataUri: desktop.screenshotDataUri });
  return shots;
}

export interface RunAuditInput {
  url: string;
  /** Optional — captured later at the "unlock" step, not needed for the scan. */
  email?: string;
}

/**
 * Run the full audit for a store. Never throws for collector failures — returns a
 * partial report with notes instead, so a slow/failed PSI call still yields value.
 */
export async function runAudit({ url, email = "" }: RunAuditInput): Promise<Report> {
  const normalized = normalizeUrl(url);
  const notes: string[] = [];

  const [mobile, desktop, scan] = await Promise.all([
    runPageSpeed(normalized, "mobile"),
    runPageSpeed(normalized, "desktop"),
    scanSite(normalized),
  ]);

  // Product page speed (mobile) — the second-most-important page. Runs after the
  // scan discovers the product URL. Mobile-only to conserve PageSpeed quota.
  const productUrl = scan.product?.ok ? scan.product.finalUrl : null;
  const prodMobile = productUrl ? await runPageSpeed(productUrl, "mobile") : null;

  const detection = detectShopify(scan.home);
  const isShopify = detection.isShopify;

  // A bot-wall / security interstitial (Vercel/Cloudflare) can return 200 with a
  // <title>, so detect it explicitly and don't audit the checkpoint as the store.
  const blocked = scan.home.ok && looksBlocked(scan.home.html);

  // A standard Shopify Liquid theme always server-renders a <title>. Its absence
  // (or a bot-wall) means we can't trust HTML-derived checks — mark them n/a
  // rather than falsely failing them.
  const contentReliable = scan.home.ok && getTitle(scan.home.html) !== null && !blocked;

  if (!mobile.fetchedOk && !desktop.fetchedOk) {
    notes.push("PageSpeed data was unavailable — speed scores could not be measured. Please retry shortly.");
  } else if (!desktop.fetchedOk) {
    notes.push("Desktop speed data wasn't available this run, so the score is based on the mobile scan.");
  } else if (!mobile.fetchedOk) {
    notes.push("Mobile speed data wasn't available this run, so the score is based on the desktop scan.");
  }
  // Field-data metrics (like INP) only exist for stores with enough real traffic.
  if ((mobile.fetchedOk || desktop.fetchedOk) && (mobile.fetchedOk ? mobile : desktop).inpMs == null) {
    notes.push("Some real-user metrics (e.g. Interaction to Next Paint) need Chrome UX Report data, which only exists once a store has enough traffic — those show as “Not measured”, not as failures.");
  }
  if (productUrl && !prodMobile?.fetchedOk) {
    notes.push("We couldn't measure the product page speed this run — only the homepage speed is reflected.");
  }
  if (!scan.home.ok) {
    notes.push("We couldn't fetch the storefront HTML — SEO, trust, CRO, and app checks were skipped.");
  } else if (blocked) {
    notes.push("The storefront is behind a bot/security check (e.g. Vercel or Cloudflare), so we could only measure limited signals. Allowlist legitimate crawlers to get a full audit — this can also affect search-engine indexing.");
  } else if (!contentReliable) {
    notes.push("This store appears to render content with JavaScript, so some HTML-based SEO, CRO, and trust checks were skipped — the speed audit (which renders the page) is the reliable signal here.");
  }
  if (!isShopify && scan.home.ok) {
    notes.push("We couldn't confirm this is a Shopify store; results are still based on the live page.");
  }

  const perfChecks = buildPerformanceChecks(mobile, desktop);
  if (prodMobile?.fetchedOk) {
    perfChecks.push({
      id: "product-perf-score",
      label: "Product page performance score (mobile)",
      status: higherIsBetter(prodMobile.performanceScore, 90, 50),
      tier: "measured",
      page: "product",
      value: prodMobile.performanceScore != null ? `${prodMobile.performanceScore}/100` : undefined,
      impact: "H",
      effort: "M",
      fix: "Optimize the product template — it's your highest-intent page, and speed here directly affects conversion.",
      ref: REF.perf,
    });
  }

  const pillars = [
    buildPillar("performance", "Page Speed & Core Web Vitals", perfChecks),
    buildPillar("mobile", "Mobile Experience", buildMobileChecks(mobile)),
    buildPillar("cro", "Conversion (CRO)", [
      ...croChecks(scan, contentReliable),
      ...collectionChecks(scan, contentReliable),
      ...cartChecks(scan, contentReliable),
    ]),
    buildPillar("seo", "SEO & Discoverability", [...buildSeoChecks(mobile), ...seoChecks(scan, contentReliable)]),
    buildPillar("apps", "App & Script Health", appChecks(detection, scan.home.ok)),
    buildPillar("trust", "Trust & Security", [...buildTrustChecks(mobile), ...trustChecks(scan, contentReliable)]),
  ];

  // Tag each check with the page it came from, then derive the per-page view.
  for (const p of pillars) {
    for (const c of p.checks) {
      if (!c.page) c.page = PAGE_BY_ID[c.id] ?? "store";
    }
  }
  const allChecks = pillars.flatMap((p) => p.checks);
  const pages = buildPages(
    scan,
    { home: mobile.performanceScore, product: prodMobile?.performanceScore ?? null },
    allChecks,
  );

  const storeScore = headlineScore(pillars);
  const now = new Date();

  // Core Web Vitals snapshot (mobile is the reference; fall back to desktop).
  const cwvSrc = mobile.fetchedOk ? mobile : desktop;

  return {
    url: normalized,
    email,
    isShopify,
    scannedAt: now.toISOString(),
    screenshots: screenshotsFrom(mobile, desktop),
    storeScore,
    grade: gradeFromScore(storeScore),
    vitals: {
      source: cwvSrc.cwvSource,
      lcpMs: cwvSrc.lcpMs,
      clsScore: cwvSrc.clsScore,
      inpMs: cwvSrc.inpMs,
      ttfbMs: cwvSrc.ttfbMs,
      fcpMs: cwvSrc.fcpMs,
      tbtMs: cwvSrc.tbtMs,
      mobileScore: mobile.performanceScore,
      desktopScore: desktop.performanceScore,
    },
    bfcm: computeBfcm(pillars, now),
    pillars,
    pages,
    topFixes: topFixes(pillars, 5),
    manualChecklist: BFCM_MANUAL_CHECKLIST,
    partial: !mobile.fetchedOk || !desktop.fetchedOk || !scan.home.ok || !contentReliable,
    notes,
  };
}
