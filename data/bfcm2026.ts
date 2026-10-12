/**
 * eFoli BFCM 2026 deals page (/efoli-bfcm-2026) — all campaign content.
 *
 * Editing guide (mirrors the original campaign HTML):
 *  - Campaign code / end date / discount: edit CAMPAIGN.
 *  - eFoli app cards: EFOLI_OFFERS. `category` is "sell" or "operate".
 *  - Partner deals: PARTNERS. `category` is marketing | conversion | operations |
 *    global | trust; `accent` sets the card colour. Banner 1200×628, logo square.
 *    Set `banner`/`logo` to null to show the placeholder, `code` to null to show
 *    `codeNote` instead of a copyable code. The first CAMPAIGN.partnersVisible
 *    cards show; the rest sit under "View more".
 *  - FAQ: FAQS feeds BOTH the visible accordion and the FAQPage JSON-LD, so they
 *    can never drift apart.
 *  - Images live in public/img/bfcm-2026/ (self-hosted copies of the partner
 *    assets — no Google Drive links at runtime).
 */

import type { StaticImageData } from "next/image";

import mvIcon from "@/public/img/home/mv_icon.png";
import pbIcon from "@/public/img/home/pbLogo.png";
import drIcon from "@/public/img/home/drLogo.png";
import emIcon from "@/public/img/home/emLogo.png";
import orIcon from "@/public/img/home/or_icon.png";
import qwIcon from "@/public/img/bfcm-2026/qw-icon.webp";

import mvMedia from "@/public/img/bfcm-2026/apps/multivariants.webp";
import pbMedia from "@/public/img/bfcm-2026/apps/push-bundle.webp";
import drMedia from "@/public/img/bfcm-2026/apps/discountray.webp";
import emMedia from "@/public/img/bfcm-2026/apps/embedup.webp";
import orMedia from "@/public/img/bfcm-2026/apps/orderrules.webp";
import qwMedia from "@/public/img/bfcm-2026/apps/quotway.webp";

import outfyBanner from "@/public/img/bfcm-2026/partners/outfy-banner.webp";
import outfyLogo from "@/public/img/bfcm-2026/partners/outfy-logo.webp";
import toastibarBanner from "@/public/img/bfcm-2026/partners/toastibar-banner.webp";
import toastibarLogo from "@/public/img/bfcm-2026/partners/toastibar-logo.webp";
import xflowBanner from "@/public/img/bfcm-2026/partners/xflow-banner.webp";
import xflowLogo from "@/public/img/bfcm-2026/partners/xflow-logo.webp";
import transcyBanner from "@/public/img/bfcm-2026/partners/transcy-banner.webp";
import transcyLogo from "@/public/img/bfcm-2026/partners/transcy-logo.webp";
import zotekCodBanner from "@/public/img/bfcm-2026/partners/zotek-cod-banner.webp";
import zotekCodLogo from "@/public/img/bfcm-2026/partners/zotek-cod-logo.webp";
import smartSeoBanner from "@/public/img/bfcm-2026/partners/smart-seo-banner.webp";
import smartSeoLogo from "@/public/img/bfcm-2026/partners/smart-seo-logo.webp";
import consentmoBanner from "@/public/img/bfcm-2026/partners/consentmo-banner.webp";
import consentmoLogo from "@/public/img/bfcm-2026/partners/consentmo-logo.webp";
import buystroBanner from "@/public/img/bfcm-2026/partners/buystro-banner.webp";
import buystroLogo from "@/public/img/bfcm-2026/partners/buystro-logo.webp";
import notimBanner from "@/public/img/bfcm-2026/partners/notim-banner.webp";
import notimLogo from "@/public/img/bfcm-2026/partners/notim-logo.webp";
import zotekPixelBanner from "@/public/img/bfcm-2026/partners/zotek-pixel-banner.webp";
import zotekPixelLogo from "@/public/img/bfcm-2026/partners/zotek-pixel-logo.webp";
import feedomixBanner from "@/public/img/bfcm-2026/partners/feedomix-banner.webp";
import feedomixLogo from "@/public/img/bfcm-2026/partners/feedomix-logo.webp";
import gempagesLogo from "@/public/img/bfcm-2026/partners/gempages-logo.webp";
import tlabBanner from "@/public/img/bfcm-2026/partners/tlab-banner.webp";
import tlabLogo from "@/public/img/bfcm-2026/partners/tlab-logo.webp";
import storedoctorBanner from "@/public/img/bfcm-2026/partners/storedoctor-banner.webp";
import storedoctorLogo from "@/public/img/bfcm-2026/partners/storedoctor-logo.webp";
import pehnaiBanner from "@/public/img/bfcm-2026/partners/pehnai-banner.webp";
import pehnaiLogo from "@/public/img/bfcm-2026/partners/pehnai-logo.webp";
import icartBanner from "@/public/img/bfcm-2026/partners/icart-banner.webp";
import icartLogo from "@/public/img/bfcm-2026/partners/icart-logo.webp";
import fadBanner from "@/public/img/bfcm-2026/partners/fad-banner.webp";
import fadLogo from "@/public/img/bfcm-2026/partners/fad-logo.webp";
import transtoreBanner from "@/public/img/bfcm-2026/partners/transtore-banner.webp";
import transtoreLogo from "@/public/img/bfcm-2026/partners/transtore-logo.webp";

export { default as partnerBadge } from "@/public/img/bfcm-2026/partner-badge.webp";

// ---------------------------------------------------------------------------
// Campaign
// ---------------------------------------------------------------------------

export const CAMPAIGN = {
  code: "BFCM26",
  discount: 30,
  /** Countdown target (end of day UTC). */
  endsAt: "2026-12-12T23:59:59Z",
  endsLong: "December 12, 2026",
  endsMedium: "Dec 12, 2026",
  endsShort: "Dec 12",
  /** Partner cards shown before "View more". */
  partnersVisible: 6,
} as const;

export const PAGE_PATH = "/efoli-bfcm-2026";
export const PAGE_URL = `https://efoli.com${PAGE_PATH}`;

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
  /** Key into data/apps.ts — supplies the Shopify App Store URL. */
  appKey: string;
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
    appKey: "mv",
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
    appKey: "pb",
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
    appKey: "dr",
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
    appKey: "em",
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
    appKey: "or",
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
    appKey: "qw",
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
// Partner deals
// ---------------------------------------------------------------------------

export type PartnerCategory = "marketing" | "conversion" | "operations" | "global" | "trust";

export const PARTNER_CATEGORY_LABELS: Record<PartnerCategory, string> = {
  marketing: "Marketing",
  conversion: "Conversion",
  operations: "Store operations",
  global: "Global selling",
  trust: "Reviews & trust",
};

export const PARTNER_FILTERS: { id: "all" | PartnerCategory; label: string }[] = [
  { id: "all", label: "All deals" },
  { id: "marketing", label: "Marketing" },
  { id: "conversion", label: "Conversion" },
  { id: "operations", label: "Store operations" },
  { id: "global", label: "Global selling" },
  { id: "trust", label: "Reviews & trust" },
];

export interface PartnerDeal {
  id: string;
  name: string;
  by: string;
  category: PartnerCategory;
  accent: string;
  /** Badge on the banner, e.g. "50% OFF". */
  offer: string;
  blurb: string;
  /** Plan/eligibility line. */
  terms: string;
  /** Validity line, e.g. "Until Dec 31, 2026". */
  until: string;
  /** Copyable code, or null when no code is needed. */
  code: string | null;
  /** Shown instead of a code box when `code` is null. */
  codeNote?: string;
  href: string;
  /** 1200×628 banner; null shows the placeholder. */
  banner: StaticImageData | null;
  /** Square logo; null shows the initials. */
  logo: StaticImageData | null;
  initials: string;
}

const C = { blue: "#3e97f0", violet: "#8b5cf6", amber: "#f59e0b", pink: "#ec4899", teal: "#14b8a6" } as const;

export const PARTNERS: PartnerDeal[] = [
  {
    id: "outfy",
    name: "Outfy – Social Media Auto Post",
    by: "Outfy Inc",
    category: "marketing",
    accent: C.blue,
    offer: "50% OFF",
    blurb: "Keep your BFCM promotions visible, consistent, and active across social media throughout the sale season.",
    terms: "Growth & Unlimited annual plans · forever",
    until: "Until Dec 30, 2026",
    code: null,
    codeNote: "Applied through the deal link",
    href: "https://www.outfy.com/pricing?code=OTg0ZmQxYjE5YWU0MTcyY9%2B7zvlWg4gHxvrDk11GqEN5w4XCqyAS%2FRtUdGExn9uBSiFfA8Vcyk54JLIMfFYG3TbvhGPw6g3pWZW2KPFnnWo%3D&utm_source=6xWjYfue&utm_campaign=bfcm-efoli",
    banner: outfyBanner,
    logo: outfyLogo,
    initials: "OS",
  },
  {
    id: "toastibar",
    name: "Toastibar Sales Popup & Timers",
    by: "MakeProSimp",
    category: "trust",
    accent: C.violet,
    offer: "50% OFF",
    blurb: "Boost conversions with AI-powered sales popups, social proof, and countdown timers.",
    terms: "Paid plans · new customers",
    until: "Until Nov 30, 2026",
    code: "BFCM50",
    href: "https://makeprosimp.com/partnership/efoli-multivariants-toastibar",
    banner: toastibarBanner,
    logo: toastibarLogo,
    initials: "TS",
  },
  {
    id: "xflow",
    name: "XFlow Back in Stock Alert",
    by: "XFlow",
    category: "marketing",
    accent: C.blue,
    offer: "35% OFF",
    blurb: "Recover lost sales during the busiest season with automated, personalized back-in-stock alerts.",
    terms: "All paid plans · 3 months",
    until: "Until Dec 31, 2026",
    code: "FOXPARTNER35",
    href: "https://apps.shopify.com/xflow?utm_source=EFOLI&utm_medium=partnership&utm_campaign=BFCM2026",
    banner: xflowBanner,
    logo: xflowLogo,
    initials: "XB",
  },
  {
    id: "transcy",
    name: "Transcy: AI Language Translate",
    by: "Transcy",
    category: "global",
    accent: C.amber,
    offer: "30% OFF",
    blurb: "Don't miss your cross-border shoppers this peak season: 147+ languages and 168+ currencies.",
    terms: "Paid plans · first 3 months · new sign-ups, excl. Global plan",
    until: "Until Dec 31, 2026",
    code: null,
    codeNote: "Applied through the deal link",
    href: "https://embedded.transcy.io/?code=TCBFCM26",
    banner: transcyBanner,
    logo: transcyLogo,
    initials: "TA",
  },
  {
    id: "zotek-cod",
    name: "Zotek COD Form Bundles & Upsells",
    by: "Zotek",
    category: "conversion",
    accent: C.pink,
    offer: "FREE",
    blurb: "Make COD ordering easier for BFCM shoppers, grow order value, and control risky orders.",
    terms: "First year · new customers",
    until: "Until Dec 31, 2026",
    code: null,
    codeNote: "No code needed",
    href: "https://apps.shopify.com/zotek-cod",
    banner: zotekCodBanner,
    logo: zotekCodLogo,
    initials: "ZC",
  },
  {
    id: "kudobuzz",
    name: "Kudobuzz Reviews",
    by: "Kudobuzz",
    category: "trust",
    accent: C.violet,
    offer: "25% OFF",
    blurb: "Give BFCM shoppers the social proof they need with photo, video, and imported reviews.",
    terms: "For life · all paid plans · new customers",
    until: "Until Dec 2, 2026",
    code: "622EBF26",
    href: "https://apps.shopify.com/kudobuzz-testimonials",
    banner: null, // awaiting partner banner
    logo: null, // awaiting partner logo
    initials: "KR",
  },
  {
    id: "smart-seo",
    name: "Smart SEO AI & Image Optimizer",
    by: "Sherpas Design",
    category: "operations",
    accent: C.teal,
    offer: "20% OFF",
    blurb: "AI-powered SEO automation to improve rankings and drive more organic traffic this BFCM.",
    terms: "For life · all paid plans",
    until: "Until Jan 1, 2027",
    code: "EFOLI20",
    href: "https://apps.shopify.com/smart-seo?utm_source=efoli&utm_medium=partners&utm_campaign=efoli-bfcm&utm_content=text-link",
    banner: smartSeoBanner,
    logo: smartSeoLogo,
    initials: "SS",
  },
  {
    id: "consentmo",
    name: "Consentmo GDPR Compliance",
    by: "Consentmo",
    category: "operations",
    accent: C.teal,
    offer: "25% OFF",
    blurb: "Find consent and accessibility issues before they affect your BFCM storefront.",
    terms: "All paid plans · first 3 months",
    until: "Until Dec 1, 2026",
    code: null,
    codeNote: "Applied automatically after install",
    href: "https://apps.shopify.com/gdpr-backpack?utm_source=partner&utm_medium=multivariants&utm_campaign=bfcm_2026",
    banner: consentmoBanner,
    logo: consentmoLogo,
    initials: "CG",
  },
  {
    id: "buystro",
    name: "Buystro",
    by: "MakeProSimp",
    category: "conversion",
    accent: C.pink,
    offer: "50% OFF",
    blurb: "Speed up purchases with sticky Add to Cart, Quick Buy, a floating cart, and cross-device carts.",
    terms: "Paid plans · new customers",
    until: "Until Nov 30, 2026",
    code: "BFCM50",
    href: "https://makeprosimp.com/partnership/efoli-multivariants-bulk-order-buystro",
    banner: buystroBanner,
    logo: buystroLogo,
    initials: "B",
  },
  {
    id: "notim",
    name: "Notim: Back In Stock + Notify Me",
    by: "MakeProSimp",
    category: "operations",
    accent: C.teal,
    offer: "50% OFF",
    blurb: "Recover lost sales with Notify Me buttons, back-in-stock alerts, and multi-location inventory tracking.",
    terms: "Paid plans · new customers",
    until: "Until Nov 30, 2026",
    code: "BFCM50",
    href: "https://makeprosimp.com/partnership/efoli-multivariants-bulk-order-notim",
    banner: notimBanner,
    logo: notimLogo,
    initials: "NB",
  },
  {
    id: "zotek-pixel",
    name: "Zotek Facebook Pixel Tiktok Pixel",
    by: "Zotek",
    category: "marketing",
    accent: C.blue,
    offer: "30% OFF",
    blurb: "Keep BFCM conversion tracking clear across Meta, TikTok, and Snapchat with CAPI and real-time reports.",
    terms: "2 months · new customers",
    until: "Until Dec 31, 2026",
    code: "ZOTEKEFOLI30",
    href: "https://apps.shopify.com/facebook-multiple-pixel?utm_source=shopidevs&utm_medium=in_app_partners&utm_campaign=recommended-apps",
    banner: zotekPixelBanner,
    logo: zotekPixelLogo,
    initials: "ZF",
  },
  {
    id: "feedomix",
    name: "Feedomix Google Shopping Feed",
    by: "MakeProSimp",
    category: "marketing",
    accent: C.blue,
    offer: "30% OFF",
    blurb: "Keep your Google Shopping feeds accurate, optimized, and BFCM-ready.",
    terms: "Paid plans · new customers",
    until: "Until Nov 30, 2026",
    code: "BFCM30",
    href: "https://makeprosimp.com/partnership/efoli-multivariants-bulk-order-feedomix",
    banner: feedomixBanner,
    logo: feedomixLogo,
    initials: "FG",
  },
  {
    id: "gempages",
    name: "GemPages Landing Page Builder",
    by: "GemPages",
    category: "conversion",
    accent: C.pink,
    offer: "20% OFF",
    blurb: "Effortlessly launch high-converting stores with the AI-powered CRO page builder.",
    terms: "Monthly plans · first 3 months · new & eligible free users",
    until: "Until Dec 31, 2026",
    // The design had a "[Code coming]" placeholder — show a note, not a copyable fake code.
    code: null,
    codeNote: "Code coming soon",
    href: "https://apps.shopify.com/gempages",
    banner: null, // awaiting partner banner
    logo: gempagesLogo,
    initials: "GL",
  },
  {
    id: "tlab",
    name: "T Lab – AI Language Translate",
    by: "Sherpas Design",
    category: "global",
    accent: C.amber,
    offer: "20% OFF",
    blurb: "Expand globally this BFCM with accurate AI translations and multi-currency support.",
    terms: "For life · all paid plans",
    until: "Until Jan 1, 2027",
    code: "EFOLI20",
    href: "https://apps.shopify.com/content-translation?utm_source=efoli&utm_medium=partners&utm_campaign=efoli-bfcm&utm_content=text-link",
    banner: tlabBanner,
    logo: tlabLogo,
    initials: "TL",
  },
  {
    id: "storedoctor",
    name: "StoreDoctor AI",
    by: "MakeProSimp",
    category: "operations",
    accent: C.teal,
    offer: "20% OFF",
    blurb: "Optimize your store with AI audits, SEO and conversion recommendations, and AI copy.",
    terms: "Paid plans · new customers",
    until: "Until Nov 30, 2026",
    code: "BFCM20",
    href: "https://makeprosimp.com/partnership/efoli-multivariants-bulk-order-storedoctor-ai",
    banner: storedoctorBanner,
    logo: storedoctorLogo,
    initials: "SA",
  },
  {
    id: "pehnai",
    name: "PehnAI: AI Virtual Try On",
    by: "MakeProSimp",
    category: "conversion",
    accent: C.pink,
    offer: "20% OFF",
    blurb: "Help BFCM shoppers see products on themselves and shop with more confidence.",
    terms: "Paid plans · first 2 months",
    until: "Until Nov 30, 2026",
    code: null,
    codeNote: "Contact PehnAI support after install",
    href: "https://makeprosimp.com/partnership/efoli-multivariants-bulk-order-pehnai",
    banner: pehnaiBanner,
    logo: pehnaiLogo,
    initials: "PA",
  },
  {
    id: "icart",
    name: "iCart Cart Drawer Cart Upsell",
    by: "Identixweb",
    category: "conversion",
    accent: C.pink,
    offer: "50% OFF",
    blurb: "Turn every BFCM cart into an upsell opportunity and grow average order value without extra ad spend.",
    terms: "All paid plans · first 3 months · new customers",
    until: "Until Dec 31, 2026",
    code: null,
    codeNote: "Applied through the deal link",
    href: "https://icart.identixweb.com/icart/?app_discount=NdVTIGuwzayySxtiBFd9bnk2cdCMwIyncsfWESe",
    banner: icartBanner,
    logo: icartLogo,
    initials: "IC",
  },
  {
    id: "fad",
    name: "FAD: Upsell & Bundle Discounts",
    by: "Cirkle Studio",
    category: "conversion",
    accent: C.pink,
    offer: "14-DAY TRIAL",
    blurb: "Increase cart size during BFCM with flexible discounts, bundles, upsells, and free gifts.",
    terms: "Free trial",
    until: "Until Dec 31, 2026",
    code: null,
    codeNote: "No code needed",
    href: "https://apps.shopify.com/auto-discounts?utm_source=efoli&utm_medium=bfcm_page&utm_campaign=bfcm_campaign",
    banner: fadBanner,
    logo: fadLogo,
    initials: "FU",
  },
  {
    id: "transtore",
    name: "Transtore – Language & Currency",
    by: "Transtore",
    category: "global",
    accent: C.amber,
    offer: "BFCM PICK",
    blurb: "Merchants using translation solutions see 20% higher sales during BFCM.",
    terms: "Install from the Shopify App Store",
    until: "Until Dec 31, 2026",
    code: null,
    codeNote: "No discount code",
    href: "https://apps.shopify.com/transtore-language-and-currency?utm_medium=efoli-bfcm&utm_source=transtore-partnership&utm_campaign=transtore",
    banner: transtoreBanner,
    logo: transtoreLogo,
    initials: "TL",
  },
];

// ---------------------------------------------------------------------------
// Hero floating icons (decorative). Positions are % of the hero box.
// `more` icons are hidden on small screens to keep the hero calm.
// ---------------------------------------------------------------------------

export interface FloatIcon {
  src: StaticImageData;
  kind: "ef" | "pt";
  more?: boolean;
  left: string;
  top: string;
  size: number;
  rotate: number;
  delay: number;
}

export const HERO_FLOAT: FloatIcon[] = [
  { src: mvIcon, kind: "ef", left: "4%", top: "10%", size: 84, rotate: -14, delay: 0 },
  { src: outfyLogo, kind: "pt", left: "17%", top: "24%", size: 44, rotate: 12, delay: -2 },
  { src: pbIcon, kind: "ef", left: "7%", top: "44%", size: 78, rotate: 10, delay: -4 },
  { src: toastibarLogo, kind: "pt", more: true, left: "19%", top: "60%", size: 48, rotate: -10, delay: -1 },
  { src: orIcon, kind: "ef", left: "3%", top: "76%", size: 72, rotate: -6, delay: -3 },
  { src: xflowLogo, kind: "pt", more: true, left: "14%", top: "88%", size: 42, rotate: 16, delay: -5 },
  { src: drIcon, kind: "ef", left: "90%", top: "10%", size: 84, rotate: 14, delay: -1.5 },
  { src: transcyLogo, kind: "pt", left: "80%", top: "22%", size: 44, rotate: -12, delay: -3.5 },
  { src: gempagesLogo, kind: "pt", more: true, left: "77%", top: "41%", size: 42, rotate: -18, delay: -2.2 },
  { src: emIcon, kind: "ef", left: "87.6%", top: "44%", size: 78, rotate: -10, delay: -2.5 },
  { src: smartSeoLogo, kind: "pt", more: true, left: "77.7%", top: "60%", size: 48, rotate: 10, delay: -4.5 },
  { src: qwIcon, kind: "ef", left: "92%", top: "76%", size: 72, rotate: 6, delay: -0.5 },
  { src: consentmoLogo, kind: "pt", more: true, left: "83%", top: "88%", size: 42, rotate: -16, delay: -5.5 },
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
