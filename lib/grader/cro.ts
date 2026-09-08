/**
 * Conversion (CRO) checks — Tier B (signals, heuristic). Absence in HTML is not
 * proof, so wording is hedged and most misses are `warn`, not `fail`. The one
 * exception is a missing add-to-cart, which is a genuine conversion blocker.
 */

import type { Check } from "./types";
import type { SiteScan } from "./fetchHtml";
import { containsAny } from "./html";

const REF = {
  atc: "https://www.shopify.com/blog/cro-checklist",
  proof: "https://www.shopify.com/blog/social-proof",
  shipping: "https://www.shopify.com/blog/cart-abandonment",
  offer: "https://www.shopify.com/blog/cro-checklist",
} as const;

/** @param contentReliable false for JS-rendered stores — CRO signals then return `na`. */
export function croChecks(scan: SiteScan, contentReliable: boolean): Check[] {
  // Prefer the product page for CRO signals; fall back to the homepage.
  const page = scan.product?.ok ? scan.product : scan.home;
  const html = page.html;
  const ok = page.ok && contentReliable;
  const checks: Check[] = [];

  // Add to cart (conversion path) — missing is a real blocker
  const hasAtc =
    /action=["'][^"']*\/cart\/add/i.test(html) ||
    /name=["']add["']/i.test(html) ||
    containsAny(html, ["add to cart", "add to bag"]);
  checks.push({
    id: "cro-atc",
    label: "Add-to-cart present on product page",
    status: !ok ? "na" : hasAtc ? "pass" : "fail",
    tier: "signal",
    value: hasAtc ? "detected" : "not detected",
    impact: "H",
    effort: "M",
    fix: "Ensure a clear, always-visible add-to-cart button above the fold on product pages.",
    ref: REF.atc,
  });

  // Social proof / reviews
  const hasReviews = containsAny(html, [
    "review",
    "rating",
    "stars",
    "judge.me",
    "yotpo",
    "loox",
    "stamped",
    "okendo",
  ]);
  checks.push({
    id: "cro-reviews",
    label: "Reviews / social proof present",
    status: !ok ? "na" : hasReviews ? "pass" : "warn",
    tier: "signal",
    value: hasReviews ? "detected" : "not detected",
    impact: "M",
    effort: "M",
    fix: "Show product reviews and ratings — social proof is a top conversion lever.",
    ref: REF.proof,
  });

  // Shipping clarity (top abandonment cause is surprise shipping cost)
  const hasShipping = containsAny(html, [
    "free shipping",
    "shipping",
    "delivery",
    "ships in",
    "free delivery",
  ]);
  checks.push({
    id: "cro-shipping",
    label: "Shipping / delivery info surfaced",
    status: !ok ? "na" : hasShipping ? "pass" : "warn",
    tier: "signal",
    value: hasShipping ? "detected" : "not detected",
    impact: "H",
    effort: "L",
    fix: "State shipping cost and delivery time before checkout — surprise costs drive ~48% of abandonment.",
    ref: REF.shipping,
  });

  // Announcement / offer bar (BFCM-relevant)
  const hasAnnouncement =
    /announcement[-_ ]?bar/i.test(html) ||
    containsAny(scan.home.html, ["free shipping over", "spend $", "% off", "sale ends", "shop the sale"]);
  checks.push({
    id: "cro-offer-bar",
    label: "Announcement / offer bar present",
    status: !ok ? "na" : hasAnnouncement ? "pass" : "warn",
    tier: "signal",
    value: hasAnnouncement ? "detected" : "not detected",
    impact: "M",
    effort: "L",
    fix: "Surface your current offer (free-shipping threshold, sale) in an announcement bar.",
    ref: REF.offer,
  });

  // Urgency / countdown (BFCM-relevant)
  const hasUrgency = containsAny(html, [
    "hurry",
    "selling fast",
    "ends in",
    "countdown",
    "only",
    "limited time",
    "low stock",
  ]);
  checks.push({
    id: "cro-urgency",
    label: "Urgency / scarcity cues",
    status: !ok ? "na" : hasUrgency ? "pass" : "warn",
    tier: "signal",
    value: hasUrgency ? "detected" : "not detected",
    impact: "L",
    effort: "L",
    fix: "Add honest urgency (countdown, low-stock) for time-boxed sales like BFCM.",
    ref: REF.offer,
  });

  return checks;
}

/** Collection-page signals (Tier B). Tagged page:"collection". */
export function collectionChecks(scan: SiteScan, contentReliable: boolean): Check[] {
  const page = scan.collection;
  const ok = !!page?.ok && contentReliable;
  const html = page?.html ?? "";
  const productLinks = ok ? (html.match(/href=["'][^"']*\/products\//gi) ?? []).length : 0;

  return [
    {
      id: "col-product-grid",
      label: "Products visible on the collection page",
      status: !ok ? "na" : productLinks >= 4 ? "pass" : productLinks > 0 ? "warn" : "fail",
      tier: "signal",
      page: "collection",
      value: ok ? `${productLinks} product links` : "not detected",
      impact: "M",
      effort: "M",
      fix: "Ensure collection pages show a full product grid so shoppers can browse and compare.",
      ref: "https://www.shopify.com/blog/collection-pages",
    },
    {
      id: "col-filters",
      label: "Filtering / sorting on collections",
      status: !ok ? "na" : containsAny(html, ["filter", "sort by", "refine", "facet"]) ? "pass" : "warn",
      tier: "signal",
      page: "collection",
      value: ok ? undefined : "not detected",
      impact: "M",
      effort: "M",
      fix: "Add filtering and sorting so shoppers can narrow large collections quickly.",
      ref: "https://www.shopify.com/blog/collection-pages",
    },
  ];
}

/** Cart-page signals (Tier B). Tagged page:"cart". */
export function cartChecks(scan: SiteScan, contentReliable: boolean): Check[] {
  const page = scan.cart;
  const ok = !!page?.ok && contentReliable;
  const html = page?.html ?? "";

  return [
    {
      id: "cart-checkout",
      label: "Checkout button present in cart",
      status: !ok ? "na" : containsAny(html, ["checkout", "/cart", "proceed"]) ? "pass" : "warn",
      tier: "signal",
      page: "cart",
      value: ok ? undefined : "not detected",
      impact: "H",
      effort: "L",
      fix: "Make the checkout button obvious and always visible in the cart.",
      ref: REF.atc,
    },
    {
      id: "cart-free-shipping",
      label: "Free-shipping threshold / incentive in cart",
      status: !ok ? "na" : containsAny(html, ["free shipping", "spend", "away from", "unlock"]) ? "pass" : "warn",
      tier: "signal",
      page: "cart",
      value: ok ? undefined : "not detected",
      impact: "M",
      effort: "L",
      fix: "Show a free-shipping progress bar in the cart to lift average order value.",
      ref: REF.shipping,
    },
  ];
}
