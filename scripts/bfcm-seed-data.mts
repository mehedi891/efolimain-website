/**
 * Initial BFCM 2026 partner data — the 19 deals that were hard-coded on
 * /bfcm-offers before partners moved to MongoDB. Used ONLY by the one-time
 * import (scripts/seed-bfcm-partners.mts); after that, /admin is the source
 * of truth. Plain data (no imports) so Node can run the script directly.
 */

export interface SeedCategory {
  slug: string;
  label: string;
  color: string;
}

export interface SeedPartner {
  slug: string;
  name: string;
  developer: string;
  category: string;
  description: string;
  offerBadge: string;
  terms: string;
  validUntil: string;
  hideAfterEnd: boolean;
  code: string | null;
  codeNote: string | null;
  ctaUrl: string;
  bannerUrl: string | null;
  logoUrl: string | null;
  accentColor: string | null;
  isActive: boolean;
}

/** Tab order = array order. */
export const SEED_CATEGORIES: SeedCategory[] = [
  { slug: "marketing", label: "Marketing", color: "#3e97f0" },
  { slug: "conversion", label: "Conversion", color: "#ec4899" },
  { slug: "operations", label: "Store operations", color: "#14b8a6" },
  { slug: "global", label: "Global selling", color: "#f59e0b" },
  { slug: "trust", label: "Reviews & trust", color: "#8b5cf6" },
];

/** Card order = array order (images are the copies already hosted in /public). */
export const SEED_PARTNERS: SeedPartner[] = [
  {
    slug: "outfy",
    name: "Outfy – Social Media Auto Post",
    developer: "Outfy Inc",
    category: "marketing",
    description: "Keep your BFCM promotions visible, consistent, and active across social media throughout the sale season.",
    offerBadge: "50% OFF",
    terms: "Growth & Unlimited annual plans · forever",
    validUntil: "2026-12-30",
    hideAfterEnd: false,
    code: null,
    codeNote: "Applied through the deal link",
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-outfy-social-media-auto-post",
    bannerUrl: "/img/bfcm-2026/partners/outfy-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/outfy-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "toastibar",
    name: "Toastibar Sales Popup & Timers",
    developer: "MakeProSimp",
    category: "trust",
    description: "Boost conversions with AI-powered sales popups, social proof, and countdown timers.",
    offerBadge: "50% OFF",
    terms: "Paid plans · new customers",
    validUntil: "2026-11-30",
    hideAfterEnd: false,
    code: "BFCM50",
    codeNote: null,
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-toastibar-sales-popup-timers",
    bannerUrl: "/img/bfcm-2026/partners/toastibar-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/toastibar-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "xflow",
    name: "XFlow Back in Stock Alert",
    developer: "XFlow",
    category: "marketing",
    description: "Recover lost sales during the busiest season with automated, personalized back-in-stock alerts.",
    offerBadge: "35% OFF",
    terms: "All paid plans · 3 months",
    validUntil: "2026-12-31",
    hideAfterEnd: false,
    code: "FOXPARTNER35",
    codeNote: null,
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-xflow-back-in-stock-alert",
    bannerUrl: "/img/bfcm-2026/partners/xflow-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/xflow-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "transcy",
    name: "Transcy: AI Language Translate",
    developer: "Transcy",
    category: "global",
    description: "Don't miss your cross-border shoppers this peak season: 147+ languages and 168+ currencies.",
    offerBadge: "30% OFF",
    terms: "Paid plans · first 3 months · new sign-ups, excl. Global plan",
    validUntil: "2026-12-31",
    hideAfterEnd: false,
    code: null,
    codeNote: "Applied through the deal link",
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-transcy-ai-language-translate",
    bannerUrl: "/img/bfcm-2026/partners/transcy-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/transcy-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "zotek-cod",
    name: "Zotek COD Form Bundles & Upsells",
    developer: "Zotek",
    category: "conversion",
    description: "Make COD ordering easier for BFCM shoppers, grow order value, and control risky orders.",
    offerBadge: "FREE",
    terms: "First year · new customers",
    validUntil: "2026-12-31",
    hideAfterEnd: false,
    code: null,
    codeNote: "No code needed",
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-zotek-cod-form-bundles-upsells",
    bannerUrl: "/img/bfcm-2026/partners/zotek-cod-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/zotek-cod-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "kudobuzz",
    name: "Kudobuzz Reviews",
    developer: "Kudobuzz",
    category: "trust",
    description: "Give BFCM shoppers the social proof they need with photo, video, and imported reviews.",
    offerBadge: "25% OFF",
    terms: "For life · all paid plans · new customers",
    validUntil: "2026-12-02",
    hideAfterEnd: false,
    code: "622EBF26",
    codeNote: null,
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-kudobuzz-reviews-social-proof",
    bannerUrl: null,
    logoUrl: null,
    accentColor: null,
    isActive: true
  },
  {
    slug: "smart-seo",
    name: "Smart SEO AI & Image Optimizer",
    developer: "Sherpas Design",
    category: "operations",
    description: "AI-powered SEO automation to improve rankings and drive more organic traffic this BFCM.",
    offerBadge: "20% OFF",
    terms: "For life · all paid plans",
    validUntil: "2027-01-01",
    hideAfterEnd: false,
    code: "EFOLI20",
    codeNote: null,
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-smart-seo-ai-image-optimizer",
    bannerUrl: "/img/bfcm-2026/partners/smart-seo-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/smart-seo-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "consentmo",
    name: "Consentmo GDPR Compliance",
    developer: "Consentmo",
    category: "operations",
    description: "Find consent and accessibility issues before they affect your BFCM storefront.",
    offerBadge: "25% OFF",
    terms: "All paid plans · first 3 months",
    validUntil: "2026-12-01",
    hideAfterEnd: false,
    code: null,
    codeNote: "Applied automatically after install",
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-consentmo-gdpr-compliance",
    bannerUrl: "/img/bfcm-2026/partners/consentmo-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/consentmo-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "buystro",
    name: "Buystro",
    developer: "MakeProSimp",
    category: "conversion",
    description: "Speed up purchases with sticky Add to Cart, Quick Buy, a floating cart, and cross-device carts.",
    offerBadge: "50% OFF",
    terms: "Paid plans · new customers",
    validUntil: "2026-11-30",
    hideAfterEnd: false,
    code: "BFCM50",
    codeNote: null,
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-buystro",
    bannerUrl: "/img/bfcm-2026/partners/buystro-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/buystro-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "notim",
    name: "Notim: Back In Stock + Notify Me",
    developer: "MakeProSimp",
    category: "operations",
    description: "Recover lost sales with Notify Me buttons, back-in-stock alerts, and multi-location inventory tracking.",
    offerBadge: "50% OFF",
    terms: "Paid plans · new customers",
    validUntil: "2026-11-30",
    hideAfterEnd: false,
    code: "BFCM50",
    codeNote: null,
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-notim-back-in-stock-notify-me",
    bannerUrl: "/img/bfcm-2026/partners/notim-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/notim-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "zotek-pixel",
    name: "Zotek Facebook Pixel Tiktok Pixel",
    developer: "Zotek",
    category: "marketing",
    description: "Keep BFCM conversion tracking clear across Meta, TikTok, and Snapchat with CAPI and real-time reports.",
    offerBadge: "30% OFF",
    terms: "2 months · new customers",
    validUntil: "2026-12-31",
    hideAfterEnd: false,
    code: "ZOTEKEFOLI30",
    codeNote: null,
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-zotek-facebook-pixel-tiktok-pixel",
    bannerUrl: "/img/bfcm-2026/partners/zotek-pixel-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/zotek-pixel-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "feedomix",
    name: "Feedomix Google Shopping Feed",
    developer: "MakeProSimp",
    category: "marketing",
    description: "Keep your Google Shopping feeds accurate, optimized, and BFCM-ready.",
    offerBadge: "30% OFF",
    terms: "Paid plans · new customers",
    validUntil: "2026-11-30",
    hideAfterEnd: false,
    code: "BFCM30",
    codeNote: null,
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-feedomix-google-shopping-feed",
    bannerUrl: "/img/bfcm-2026/partners/feedomix-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/feedomix-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "gempages",
    name: "GemPages Landing Page Builder",
    developer: "GemPages",
    category: "conversion",
    description: "Effortlessly launch high-converting stores with the AI-powered CRO page builder.",
    offerBadge: "20% OFF",
    terms: "Monthly plans · first 3 months · new & eligible free users",
    validUntil: "2026-12-31",
    hideAfterEnd: false,
    code: null,
    codeNote: "Code coming soon",
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-gempages-landing-page-builder",
    bannerUrl: null,
    logoUrl: "/img/bfcm-2026/partners/gempages-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "tlab",
    name: "T Lab – AI Language Translate",
    developer: "Sherpas Design",
    category: "global",
    description: "Expand globally this BFCM with accurate AI translations and multi-currency support.",
    offerBadge: "20% OFF",
    terms: "For life · all paid plans",
    validUntil: "2027-01-01",
    hideAfterEnd: false,
    code: "EFOLI20",
    codeNote: null,
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-t-lab-ai-language-translate",
    bannerUrl: "/img/bfcm-2026/partners/tlab-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/tlab-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "storedoctor",
    name: "StoreDoctor AI",
    developer: "MakeProSimp",
    category: "operations",
    description: "Optimize your store with AI audits, SEO and conversion recommendations, and AI copy.",
    offerBadge: "20% OFF",
    terms: "Paid plans · new customers",
    validUntil: "2026-11-30",
    hideAfterEnd: false,
    code: "BFCM20",
    codeNote: null,
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-storedoctor-ai",
    bannerUrl: "/img/bfcm-2026/partners/storedoctor-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/storedoctor-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "pehnai",
    name: "PehnAI: AI Virtual Try On",
    developer: "MakeProSimp",
    category: "conversion",
    description: "Help BFCM shoppers see products on themselves and shop with more confidence.",
    offerBadge: "20% OFF",
    terms: "Paid plans · first 2 months",
    validUntil: "2026-11-30",
    hideAfterEnd: false,
    code: null,
    codeNote: "Contact PehnAI support after install",
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-pehnai-ai-virtual-try-on",
    bannerUrl: "/img/bfcm-2026/partners/pehnai-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/pehnai-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "icart",
    name: "iCart Cart Drawer Cart Upsell",
    developer: "Identixweb",
    category: "conversion",
    description: "Turn every BFCM cart into an upsell opportunity and grow average order value without extra ad spend.",
    offerBadge: "50% OFF",
    terms: "All paid plans · first 3 months · new customers",
    validUntil: "2026-12-31",
    hideAfterEnd: false,
    code: null,
    codeNote: "Applied through the deal link",
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-icart-cart-drawer-cart-upsell",
    bannerUrl: "/img/bfcm-2026/partners/icart-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/icart-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "fad",
    name: "FAD: Upsell & Bundle Discounts",
    developer: "Cirkle Studio",
    category: "conversion",
    description: "Increase cart size during BFCM with flexible discounts, bundles, upsells, and free gifts.",
    offerBadge: "14-DAY TRIAL",
    terms: "Free trial",
    validUntil: "2026-12-31",
    hideAfterEnd: false,
    code: null,
    codeNote: "No code needed",
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-fad-upsell-bundle-discounts",
    bannerUrl: "/img/bfcm-2026/partners/fad-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/fad-logo.webp",
    accentColor: null,
    isActive: true
  },
  {
    slug: "transtore",
    name: "Transtore – Language & Currency",
    developer: "Transtore",
    category: "global",
    description: "Merchants using translation solutions see 20% higher sales during BFCM.",
    offerBadge: "BFCM PICK",
    terms: "Install from the Shopify App Store",
    validUntil: "2026-12-31",
    hideAfterEnd: false,
    code: null,
    codeNote: "No discount code",
    ctaUrl: "https://efoli.com/blog/best-shopify-bfcm-apps#app-transtore-language-currency-solution",
    bannerUrl: "/img/bfcm-2026/partners/transtore-banner.webp",
    logoUrl: "/img/bfcm-2026/partners/transtore-logo.webp",
    accentColor: null,
    isActive: true
  }
];
