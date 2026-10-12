/**
 * eFoli's Shopify apps — single source of truth for cross-site references
 * (home product section, footer, and the free-tools "made by" section).
 */

import type { StaticImageData } from "next/image";
import mvIcon from "@/public/img/home/mv_icon.png";
import pbIcon from "@/public/img/home/pbLogo.png";
import drIcon from "@/public/img/home/drLogo.png";
import emIcon from "@/public/img/home/emLogo.png";
import orIcon from "@/public/img/home/or_icon.png";
// qw-icon.png is a white logo (invisible on light backgrounds); use the colored app icon.
import qwIcon from "@/public/img/home/qw-icon-color.png";

export interface EfoliApp {
  key: string;
  name: string;
  tagline: string;
  /** Brand/marketing site. */
  url: string;
  /** Shopify App Store listing (where install happens). */
  shopifyUrl: string;
  icon: StaticImageData;
}

export const APPS: EfoliApp[] = [
  { key: "mv", name: "MultiVariants", tagline: "One-click bulk ordering", url: "https://multivariants.com", shopifyUrl: "https://apps.shopify.com/multivariants", icon: mvIcon },
  { key: "pb", name: "Push Bundle", tagline: "Build-a-box product bundles", url: "https://pushbundle.com", shopifyUrl: "https://apps.shopify.com/push-bundle", icon: pbIcon },
  { key: "dr", name: "DiscountRay", tagline: "B2B custom pricing & tiers", url: "https://discountray.com", shopifyUrl: "https://apps.shopify.com/discountray", icon: drIcon },
  { key: "em", name: "EmbedUp", tagline: "Sell on any site or blog", url: "https://embedup.com", shopifyUrl: "https://apps.shopify.com/embedup", icon: emIcon },
  { key: "or", name: "OrderRules", tagline: "Store open & order limits", url: "https://orderrules.com", shopifyUrl: "https://apps.shopify.com/orderrules-limit-sales", icon: orIcon },
  { key: "qw", name: "QuotWay", tagline: "B2B quote requests", url: "https://www.quotway.com", shopifyUrl: "https://apps.shopify.com/quotway-b2b-quote-negotiation", icon: qwIcon },
];

/**
 * App Store listing URL tagged with UTM params so installs from the free-tools
 * pages are attributable. `content` distinguishes which app card was clicked.
 */
export function appStoreHref(app: EfoliApp, campaign = "app_studio"): string {
  const params = new URLSearchParams({
    utm_source: "efoli",
    utm_medium: "free_tools",
    utm_campaign: campaign,
    utm_content: app.key,
  });
  return `${app.shopifyUrl}?${params.toString()}`;
}

/** Apps grouped by the merchant goal they serve — lets us promote by outcome, not by pitch. */
export interface AppGoal {
  goal: string;
  blurb: string;
  appKeys: string[];
}

export const APP_GOALS: AppGoal[] = [
  { goal: "Grow average order value", blurb: "Turn each visit into a bigger cart.", appKeys: ["pb", "mv"] },
  { goal: "Sell to B2B & wholesale", blurb: "Custom pricing and quotes for business buyers.", appKeys: ["dr", "qw"] },
  { goal: "Sell beyond your storefront", blurb: "Put your products wherever customers are.", appKeys: ["em"] },
  { goal: "Automate store operations", blurb: "Control capacity and store hours automatically.", appKeys: ["or"] },
];

export function appsByKeys(keys: string[]): EfoliApp[] {
  return keys.map((k) => APPS.find((a) => a.key === k)).filter((a): a is EfoliApp => !!a);
}
