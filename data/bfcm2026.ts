/**
 * eFoli BFCM 2026 deals page (/bfcm-offers) — all campaign content.
 *
 * Editing guide (mirrors the original campaign HTML):
 *  - Campaign code / end date / discount: edit CAMPAIGN.
 *  - eFoli app cards: EFOLI_OFFERS. `category` is "sell" or "operate".
 *  - Partner deals + their category tabs live in MongoDB and are managed in
 *    /admin/bfcm/partners (lib/bfcm/store.ts). Initial data: scripts/bfcm-seed-data.mts.
 *  - FAQ: FAQS feeds BOTH the visible accordion and the FAQPage JSON-LD, so they
 *    can never drift apart.
 *  - eFoli images live in public/img/bfcm-2026/.
 */

import type { StaticImageData } from "next/image";
import { CAMPAIGN, dealHref } from "./bfcmCampaign";

import mvIcon from "@/public/img/home/mv_icon.png";
import pbIcon from "@/public/img/home/pbLogo.png";
import drIcon from "@/public/img/home/drLogo.png";
import emIcon from "@/public/img/home/emLogo.png";
import orIcon from "@/public/img/home/or_icon.png";
import qwIcon from "@/public/img/bfcm-2026/qw-icon.webp";

import mvMedia from "@/public/img/bfcm-2026/apps/multivariants.png";
import pbMedia from "@/public/img/bfcm-2026/apps/push-bundle.png";
import drMedia from "@/public/img/bfcm-2026/apps/discountray.png";
import emMedia from "@/public/img/bfcm-2026/apps/embedup.png";
import orMedia from "@/public/img/bfcm-2026/apps/orderrules.png";
import qwMedia from "@/public/img/bfcm-2026/apps/quotway.png";

export { default as partnerBadge } from "@/public/img/bfcm-2026/partner-badge.webp";

// ---------------------------------------------------------------------------
// Campaign
// ---------------------------------------------------------------------------

export { CAMPAIGN, PAGE_PATH, PAGE_URL, dealHref } from "./bfcmCampaign";

export const TRUST_POINTS = [
  "Built for Shopify",
  "15+ years in commerce",
  "24/7 technical support",
  "50+ countries reached",
];

export const TICKER_ITEMS = [
  "BFCM 2026",
  `${CAMPAIGN.discount}% off eFoli apps`,
  "Partner deals",
  `Code ${CAMPAIGN.code}`,
  `Ends ${CAMPAIGN.endsLong.replace(", 2026", "")}`,
];

// ---------------------------------------------------------------------------
// eFoli app offers
// ---------------------------------------------------------------------------

export type OfferCategory = "sell" | "operate";

export const OFFER_FILTERS: { id: "all" | OfferCategory; label: string }[] = [
  { id: "all", label: "All apps" },
  { id: "sell", label: "Sell more" },
  { id: "operate", label: "Operate smarter" },
];

export interface EfoliOffer {
  /** In-page anchor (hero pills link to it). */
  id: string;
  /** "View deal" target — this app's section in the BFCM deals blog post. */
  href: string;
  name: string;
  category: OfferCategory;
  label: string;
  /** Card glow colour. */
  glow: string;
  icon: StaticImageData;
  /** 660×420 screenshot. */
  media: StaticImageData;
  blurb: string;
}

export const EFOLI_OFFERS: EfoliOffer[] = [
  {
    id: "multivariants",
    href: dealHref("app-multivariants-bulk-order"),
    name: "MultiVariants",
    category: "sell",
    label: "Bulk ordering",
    glow: "#3E97F0",
    icon: mvIcon,
    media: mvMedia,
    blurb: "Let buyers order multiple variants in one fast, flexible B2B ordering experience.",
  },
  {
    id: "push-bundle",
    href: dealHref("app-push-bundle-build-a-box"),
    name: "Push Bundle",
    category: "sell",
    label: "Bundles & AOV",
    glow: "#8B5CF6",
    icon: pbIcon,
    media: pbMedia,
    blurb: "Create build-a-box experiences, control pricing rules, and turn more carts into bigger carts.",
  },
  {
    id: "discountray",
    href: dealHref("app-discountray"),
    name: "DiscountRay",
    category: "sell",
    label: "Custom pricing",
    glow: "#F59E0B",
    icon: drIcon,
    media: drMedia,
    blurb: "Give every customer segment the right price with flexible tiers, conditions, and deals.",
  },
  {
    id: "embedup",
    href: dealHref("app-embedup-affiliate-buy-button"),
    name: "EmbedUp",
    category: "operate",
    label: "New sales channels",
    glow: "#14B8A6",
    icon: emIcon,
    media: emMedia,
    blurb: "Turn any website or blog into a storefront with seamless Shopify product embeds.",
  },
  {
    id: "orderrules",
    href: dealHref("app-orderrules-limits-delivery"),
    name: "OrderRules",
    category: "operate",
    label: "Order control",
    glow: "#22C55E",
    icon: orIcon,
    media: orMedia,
    blurb: "Automate order caps, store hours, purchase limits, and delivery availability.",
  },
  {
    id: "quotway",
    href: dealHref("app-quotway-b2b-quote-negotiation"),
    name: "QuotWay",
    category: "operate",
    label: "Quote workflows",
    glow: "#EC4899",
    icon: qwIcon,
    media: qwMedia,
    blurb: "Collect quote requests, manage negotiations, and convert accepted quotes into draft orders.",
  },
];

/** Shared terms line on every eFoli card. */
export const OFFER_TERMS = ["For one year", `New users · Eligible free users · Ends ${CAMPAIGN.endsMedium}`];

// ---------------------------------------------------------------------------
// Hero floating icons (decorative). Positions are % of the hero box.
// `icon: null` slots are filled, in order, with the logos of the first visible
// partners (admin order), so a removed partner never keeps floating here.
// `more` icons are hidden on small screens to keep the hero calm.
// ---------------------------------------------------------------------------

export interface HeroSlot {
  icon: StaticImageData | null;
  more?: boolean;
  left: string;
  top: string;
  size: number;
  rotate: number;
  delay: number;
}

export const HERO_SLOTS: HeroSlot[] = [
  { icon: mvIcon, left: "4%", top: "10%", size: 84, rotate: -14, delay: 0 },
  { icon: null, left: "17%", top: "24%", size: 44, rotate: 12, delay: -2 },
  { icon: pbIcon, left: "7%", top: "44%", size: 78, rotate: 10, delay: -4 },
  { icon: null, more: true, left: "19%", top: "60%", size: 48, rotate: -10, delay: -1 },
  { icon: orIcon, left: "3%", top: "76%", size: 72, rotate: -6, delay: -3 },
  { icon: null, more: true, left: "14%", top: "88%", size: 42, rotate: 16, delay: -5 },
  { icon: drIcon, left: "90%", top: "10%", size: 84, rotate: 14, delay: -1.5 },
  { icon: null, left: "80%", top: "22%", size: 44, rotate: -12, delay: -3.5 },
  { icon: null, more: true, left: "77%", top: "41%", size: 42, rotate: -18, delay: -2.2 },
  { icon: emIcon, left: "87.6%", top: "44%", size: 78, rotate: -10, delay: -2.5 },
  { icon: null, more: true, left: "77.7%", top: "60%", size: 48, rotate: 10, delay: -4.5 },
  { icon: qwIcon, left: "92%", top: "76%", size: 72, rotate: 6, delay: -0.5 },
  { icon: null, more: true, left: "83%", top: "88%", size: 42, rotate: -16, delay: -5.5 },
];

// ---------------------------------------------------------------------------
// Guides
// ---------------------------------------------------------------------------

export const FEATURED_GUIDE = {
  href: "/blog/best-shopify-apps-for-bfcm",
  eyebrow: "Start here",
  title: "Best Shopify Apps for Q4 2026",
  blurb: "The short list of apps worth installing before the BFCM rush, from bundles and pricing to bulk orders.",
  big: "Q4",
};

export interface GuideGroup {
  topic: string;
  sub: string;
  color: string;
  icon: "box" | "tag" | "grid";
  links: { title: string; href: string }[];
}

export const GUIDE_GROUPS: GuideGroup[] = [
  {
    topic: "Bundles & Cross‑Selling",
    sub: "Raise order value with bundles and add-ons",
    color: "#8b5cf6",
    icon: "box",
    links: [
      { title: "Best Cross-Sell Apps on Shopify", href: "https://pushbundle.com/blog/best-cross-sell-apps-on-shopify" },
      { title: "Best BYOB Shopify Apps", href: "https://pushbundle.com/blog/best-byob-shopify-apps" },
      { title: "Best Shopify Mix and Match Bundle Apps", href: "https://pushbundle.com/blog/best-shopify-mix-and-match-bundle-apps" },
    ],
  },
  {
    topic: "Discounts & Pricing",
    sub: "Quantity breaks, wholesale and BOGO offers",
    color: "#f59e0b",
    icon: "tag",
    links: [
      { title: "Best Shopify Quantity Breaks Apps", href: "https://discountray.com/blog/best-shopify-quantity-breaks-apps" },
      { title: "Best Shopify Wholesale Discount Apps", href: "https://discountray.com/blog/shopify-wholesale-discount-apps" },
      { title: "Best Shopify BOGO Apps", href: "https://discountray.com/blog/best-shopify-bogo-apps" },
    ],
  },
  {
    topic: "Bulk Orders & Variants",
    sub: "Variants, order limits and high-volume buying",
    color: "#3e97f0",
    icon: "grid",
    links: [
      { title: "Best Shopify Apps for High-Volume Orders", href: "https://multivariants.com/blog/best-shopify-apps-for-high-volume-orders" },
      { title: "Best Shopify Product Variant Apps", href: "https://multivariants.com/blog/best-shopify-product-variant-apps" },
      { title: "Best Shopify Order Limit Apps", href: "https://multivariants.com/blog/best-shopify-order-limit-apps" },
      { title: "Best Shopify Dropshipping Apps", href: "https://multivariants.com/blog/best-shopify-dropshipping-apps" },
    ],
  },
];

// ---------------------------------------------------------------------------
// FAQ — feeds the visible accordion AND the FAQPage JSON-LD.
// ---------------------------------------------------------------------------

export const FAQS: { q: string; a: string }[] = [
  {
    q: "Who can use the eFoli BFCM offer?",
    a: "The offer is for new users and eligible free users starting an eligible plan during the campaign period. Final eligibility can be confirmed with the eFoli product team.",
  },
  {
    q: "How long does the eFoli BFCM discount last?",
    a: `The ${CAMPAIGN.discount}% discount applies for one year on eligible plans. Standard pricing resumes after the promotional period.`,
  },
  {
    q: "Can I use the code on more than one eFoli app?",
    a: "Yes. Where each selected app and plan is eligible, the campaign code can support a multi-app eFoli setup. Confirm the combination before checkout.",
  },
  {
    q: "Will eFoli help with setup?",
    a: "eFoli provides technical support across its product ecosystem. Setup scope can vary by app and plan, so contact the relevant product team for details.",
  },
  {
    q: "When does the eFoli BFCM campaign end?",
    a: `The eFoli BFCM campaign closes on ${CAMPAIGN.endsLong}.`,
  },
];
