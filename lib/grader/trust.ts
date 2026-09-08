/**
 * Trust & Security checks. HTTPS/mixed-content are Tier A (measured); policy links
 * and badges are Tier B (signals) — hedged, since absence in HTML isn't proof.
 * Complements the Lighthouse best-practices score added in Phase 1.
 */

import type { Check, Status } from "./types";
import type { SiteScan } from "./fetchHtml";
import { containsAny, hrefsMatching, insecureResourceCount } from "./html";

const REF = {
  https: "https://web.dev/articles/is-on-https",
  mixed: "https://web.dev/articles/what-is-mixed-content",
  policy: "https://www.shopify.com/blog/store-policies",
  badges: "https://www.shopify.com/blog/trust-badges",
} as const;

/** @param contentReliable false for JS-rendered stores — HTML-derived signals return `na`. */
export function trustChecks(scan: SiteScan, contentReliable: boolean): Check[] {
  const html = scan.home.html;
  const checks: Check[] = [];

  // HTTPS
  checks.push({
    id: "trust-https",
    label: "Served over HTTPS",
    status: !scan.home.ok ? "na" : scan.home.isHttps ? "pass" : "fail",
    tier: "measured",
    value: scan.home.isHttps ? "yes" : "no",
    impact: "H",
    effort: "L",
    fix: "Serve the entire store over HTTPS — required for trust, checkout, and ranking.",
    ref: REF.https,
  });

  // Mixed content
  const insecure = insecureResourceCount(html, scan.home.isHttps);
  let mixedStatus: Status = "pass";
  if (insecure > 5) mixedStatus = "fail";
  else if (insecure > 0) mixedStatus = "warn";
  checks.push({
    id: "trust-mixed-content",
    label: "No insecure (http://) resources",
    status: !scan.home.ok || !contentReliable ? "na" : mixedStatus,
    tier: "measured",
    value: insecure > 0 ? `${insecure} http:// refs` : "none",
    impact: "M",
    effort: "L",
    fix: "Load all images, scripts, and styles over HTTPS to avoid mixed-content warnings.",
    ref: REF.mixed,
  });

  // Policy links (return/refund + privacy) — Tier B signal
  const policyHrefs = [
    ...hrefsMatching(html, "/policies/"),
    ...hrefsMatching(html, "/pages/"),
  ].join(" ").toLowerCase();
  const hasReturn = /refund|return/.test(policyHrefs) || containsAny(html, ["refund policy", "return policy"]);
  const hasPrivacy = /privacy/.test(policyHrefs) || containsAny(html, ["privacy policy"]);
  let policyStatus: Status = "warn";
  if (hasReturn && hasPrivacy) policyStatus = "pass";
  checks.push({
    id: "trust-policies",
    label: "Return & privacy policies linked",
    status: !scan.home.ok || !contentReliable ? "na" : policyStatus,
    tier: "signal",
    value: `${hasReturn ? "return " : ""}${hasPrivacy ? "privacy" : ""}`.trim() || "not detected",
    impact: "M",
    effort: "L",
    fix: "Link clear return/refund and privacy policies — key trust signals before purchase.",
    ref: REF.policy,
  });

  // Trust/security badges — Tier B signal
  const hasBadges = containsAny(html, [
    "secure checkout",
    "money-back",
    "money back",
    "satisfaction guarantee",
    "ssl secure",
    "trust badge",
    "norton",
    "mcafee",
    "verified",
  ]);
  checks.push({
    id: "trust-badges",
    label: "Trust / security signals present",
    status: !scan.home.ok || !contentReliable ? "na" : hasBadges ? "pass" : "warn",
    tier: "signal",
    value: hasBadges ? "detected" : "not detected",
    impact: "L",
    effort: "L",
    fix: "Show trust cues (secure checkout, guarantees, verified reviews) near the buy button.",
    ref: REF.badges,
  });

  return checks;
}
