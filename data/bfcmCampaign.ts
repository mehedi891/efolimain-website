/**
 * BFCM 2026 campaign constants — kept separate from data/bfcm2026.ts (which
 * imports every page image) so site-wide chrome like the announcement bar can
 * use them without pulling the whole page's assets into its module graph.
 */

export const CAMPAIGN = {
  code: "BFCM26",
  discount: 30,
  /** Countdown target and banner cut-off (end of day UTC). */
  endsAt: "2026-12-12T23:59:59Z",
  endsLong: "December 12, 2026",
  endsMedium: "Dec 12, 2026",
  endsShort: "Dec 12",
  /** endsAt as shown to people (the deadline is end of day UTC). */
  endsTime: "11:59 PM UTC",
  /** Discount duration, worded as in the official terms. */
  duration: "12 months",
  /** Partner cards shown before "View more". */
  partnersVisible: 6,
} as const;

export const PAGE_PATH = "/bfcm-offers";
export const PAGE_URL = `https://efoli.com${PAGE_PATH}`;

/** The blog post every deal CTA points into (one section per app). Full
 *  absolute URL, exactly as supplied in the campaign's CTA link list. */
export const DEALS_POST = "https://efoli.com/blog/best-shopify-bfcm-apps";

export function dealHref(anchor: string): string {
  return `${DEALS_POST}#${anchor}`;
}

export function isCampaignLive(now: number = Date.now()): boolean {
  return now <= new Date(CAMPAIGN.endsAt).getTime();
}
