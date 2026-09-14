/**
 * App & Script Health checks — Tier B (signals). Uses the storefront app-footprint
 * detection plus PageSpeed's render-blocking figure to flag app bloat, a top
 * hidden speed/conversion tax on Shopify.
 */

import type { Check, Status } from "./types";
import type { ShopifyDetection } from "./detectShopify";

const REF = {
  bloat: "https://web.dev/articles/optimizing-content-efficiency-loading-third-party-javascript",
} as const;

function band(value: number, goodMax: number, warnMax: number): Status {
  if (value <= goodMax) return "pass";
  if (value <= warnMax) return "warn";
  return "fail";
}

/** Rendered third-party data from PageSpeed (more accurate than static HTML). */
export interface PsiThirdParty {
  count: number | null;
  blockingMs: number | null;
}

export function appChecks(detection: ShopifyDetection, scanOk: boolean, psi?: PsiThirdParty): Check[] {
  const { apps, thirdPartyScriptCount, thirdPartyScriptHosts } = detection;
  const checks: Check[] = [];

  checks.push({
    id: "apps-count",
    label: "Storefront apps detected",
    status: !scanOk ? "na" : band(apps.length, 6, 12),
    tier: "signal",
    value: apps.length ? `${apps.length}: ${apps.slice(0, 6).join(", ")}${apps.length > 6 ? "…" : ""}` : "few/none detected",
    impact: "M",
    effort: "M",
    fix: "Audit installed apps and remove unused or overlapping ones — each adds storefront weight.",
    ref: REF.bloat,
  });

  // Prefer PageSpeed's rendered third-party count (catches JS-injected app
  // scripts that server-side HTML parsing misses); fall back to static hosts.
  const rendered = psi?.count != null;
  const count = rendered ? (psi!.count as number) : thirdPartyScriptCount;
  const blocking = psi?.blockingMs ?? null;
  const statusFromMeasured: Status = rendered ? band(count, 5, 12) : band(count, 15, 30);
  checks.push({
    id: "apps-third-party-scripts",
    label: "Third-party services on the page",
    status: !scanOk && !rendered ? "na" : statusFromMeasured,
    tier: "signal",
    value: rendered
      ? `${count} third-party service${count === 1 ? "" : "s"}${blocking != null ? ` · ~${blocking}ms blocking` : ""}`
      : `${count} distinct script hosts`,
    current: thirdPartyScriptHosts.length
      ? `Detected: ${thirdPartyScriptHosts.slice(0, 8).join(", ")}${thirdPartyScriptHosts.length > 8 ? ` +${thirdPartyScriptHosts.length - 8} more` : ""}`
      : undefined,
    impact: "M",
    effort: "M",
    fix: "Reduce third-party services; defer non-critical ones to cut render-blocking and improve INP.",
    ref: REF.bloat,
  });

  return checks;
}
