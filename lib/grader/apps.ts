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

export function appChecks(detection: ShopifyDetection, scanOk: boolean): Check[] {
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

  checks.push({
    id: "apps-third-party-scripts",
    label: "Third-party scripts on the page",
    status: !scanOk ? "na" : band(thirdPartyScriptCount, 15, 30),
    tier: "signal",
    value: `${thirdPartyScriptCount} distinct hosts`,
    current: thirdPartyScriptHosts.length
      ? `Loading from: ${thirdPartyScriptHosts.slice(0, 8).join(", ")}${thirdPartyScriptHosts.length > 8 ? ` +${thirdPartyScriptHosts.length - 8} more` : ""}`
      : undefined,
    impact: "M",
    effort: "M",
    fix: "Reduce third-party scripts; defer non-critical ones to cut render-blocking and improve INP.",
    ref: REF.bloat,
  });

  return checks;
}
