/**
 * BFCM readiness overlay + countdown.
 *
 * The same measured pillars re-weighted for peak-traffic season: speed, mobile,
 * app bloat, and trust matter most when traffic spikes. Plus the Tier C manual
 * checklist (test purchase, discount codes, order emails, inventory) which we
 * cannot measure from a URL but must remind merchants to do.
 */

import type { BfcmSummary, ManualItem, Pillar } from "./types";
import { gradeFromScore } from "./scoring";

/** Black Friday 2026 = Fri Nov 27; Cyber Monday = Mon Nov 30. */
export const BLACK_FRIDAY_2026 = new Date("2026-11-27T00:00:00Z");

/** Re-weighted for BFCM (sum = 1). Speed/mobile weighted highest for peak traffic. */
const BFCM_WEIGHTS: Record<string, number> = {
  performance: 0.3,
  mobile: 0.25,
  trust: 0.15,
  apps: 0.15,
  cro: 0.1,
  seo: 0.05,
};

export function daysUntilBlackFriday(now: Date = new Date()): number {
  const ms = BLACK_FRIDAY_2026.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export function computeBfcm(pillars: Pillar[], now: Date = new Date()): BfcmSummary {
  let weightedSum = 0;
  let weightTotal = 0;
  for (const p of pillars) {
    const w = BFCM_WEIGHTS[p.id];
    if (w == null) continue;
    // Only count pillars that were actually scored.
    if (p.checks.some((c) => c.tier !== "manual" && c.status !== "na")) {
      weightedSum += p.score * w;
      weightTotal += w;
    }
  }
  const score = weightTotal === 0 ? 0 : Math.round(weightedSum / weightTotal);

  let status: BfcmSummary["status"];
  if (score >= 80) status = "on-track";
  else if (score >= 60) status = "at-risk";
  else status = "not-ready";

  return { score, status, daysToBlackFriday: daysUntilBlackFriday(now) };
}

/** Grade label for the BFCM score (reuses the shared grade bands). */
export function bfcmGrade(score: number) {
  return gradeFromScore(score);
}

/**
 * Tier C manual checklist — things we cannot test from a URL but that decide a
 * successful BFCM. Sourced from Shopify's BFCM checklist. Shown as guidance,
 * never scored.
 */
export const BFCM_MANUAL_CHECKLIST: ManualItem[] = [
  {
    label: "Run a full test purchase on mobile and desktop",
    note: "Every payment method, all the way to the order-confirmation page.",
  },
  {
    label: "Apply every discount code you plan to use and confirm it works",
    note: "Including edge cases and stacking rules.",
  },
  {
    label: "Verify order-confirmation emails send promptly",
    note: "Check spam placement and that details are correct.",
  },
  {
    label: "Forecast inventory and hide out-of-stock products",
    note: "Prevent overselling during the spike.",
  },
  {
    label: "Confirm DDoS protection / CDN and a site-outage backup plan",
    note: "Peak traffic is when stores fall over.",
  },
  {
    label: "Set up abandoned-checkout recovery and retargeting",
    note: "Recover the carts the traffic surge will inevitably drop.",
  },
  {
    label: "Confirm fulfillment capacity and shipping cut-off dates",
    note: "Communicate transit times clearly before checkout.",
  },
  {
    label: "Set up SPF, DKIM, and DMARC for email deliverability",
    note: "So your promo and confirmation emails actually land.",
  },
];
