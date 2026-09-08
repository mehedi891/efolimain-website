/**
 * Shopify detection + storefront app-footprint detection.
 *
 * Apps that touch the storefront inject a script/style/comment with a recognizable
 * footprint (a known host, a `shopify://apps/<name>` app-block comment, or a class
 * prefix). We match against a small starter ruleset — extend it over time. This is
 * Tier B (a signal): good enough to flag bloat, not a definitive inventory.
 */

import type { PageData } from "./fetchHtml";
import { scriptSrcHosts } from "./html";

/**
 * Domain-specific footprint → app name. Needles are full domains so they only
 * match real script/resource URLs, not generic words in page text (e.g. "bold").
 */
const APP_HOST_RULES: Array<[needle: string, name: string]> = [
  ["judge.me", "Judge.me Reviews"],
  ["yotpo.com", "Yotpo"],
  ["loox.io", "Loox Reviews"],
  ["stamped.io", "Stamped Reviews"],
  ["okendo.io", "Okendo Reviews"],
  ["klaviyo.com", "Klaviyo"],
  ["privy.com", "Privy"],
  ["gorgias.chat", "Gorgias"],
  ["tidiochat.com", "Tidio Chat"],
  ["rechargecdn.com", "Recharge Subscriptions"],
  ["rechargepayments.com", "Recharge Subscriptions"],
  ["boldcommerce.com", "Bold Commerce"],
  ["getshogun.com", "Shogun Page Builder"],
  ["pagefly.io", "PageFly"],
  ["gempages.net", "GemPages"],
  ["searchanise.com", "Searchanise"],
  ["fera.ai", "Fera Reviews"],
  ["smsbump.com", "SMSBump"],
  ["attentivemobile.com", "Attentive"],
  ["attn.tv", "Attentive"],
];

export interface ShopifyDetection {
  isShopify: boolean;
  apps: string[];
  /** Distinct third-party script hosts (excludes the store's own + Shopify CDN). */
  thirdPartyScriptCount: number;
}

export function detectShopify(home: PageData): ShopifyDetection {
  const html = home.html;
  const headerHit =
    !!home.headers["x-shopify-stage"] || !!home.headers["x-shopid"] || /shopify/i.test(home.headers["powered-by"] ?? "");
  const htmlHit = /cdn\.shopify\.com|Shopify\.theme|shopify\.com\/s\/|myshopify\.com/i.test(html);
  const isShopify = headerHit || htmlHit;

  // Apps by known host + by app-block comments (shopify://apps/<name>).
  const apps = new Set<string>();
  const lower = html.toLowerCase();
  for (const [needle, name] of APP_HOST_RULES) {
    if (lower.includes(needle)) apps.add(name);
  }
  const blockRe = /shopify:\/\/apps\/([a-z0-9-]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(html)) !== null) {
    apps.add(prettifyAppSlug(m[1]));
  }

  // Third-party scripts = hosts that aren't the store itself or Shopify's own CDN.
  let ownHost = "";
  try {
    ownHost = new URL(home.finalUrl).hostname;
  } catch {
    /* ignore */
  }
  const thirdParty = new Set(
    scriptSrcHosts(html, home.finalUrl).filter(
      (h) => h !== ownHost && !/(^|\.)shopify\.com$|shopifycloud\.com$|shopifysvc\.com$/i.test(h),
    ),
  );

  return { isShopify, apps: [...apps], thirdPartyScriptCount: thirdParty.size };
}

function prettifyAppSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
