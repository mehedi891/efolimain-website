/**
 * Structured Data / Rich-Results checker — validates JSON-LD (Product, Organization,
 * WebSite, FAQPage, HowTo, Breadcrumb…) and flags missing fields that block rich
 * results. Product checks are only applied on product pages; each finding carries
 * step-by-step how-to guidance and a copy-paste JSON-LD snippet.
 */

import type { ToolCheck, ToolResult, ToolStatus } from "../types";
import { fetchPage, host } from "../http";
import { scoreChecks, gradeFromScore } from "../score";
import {
  SNIPPET_PRODUCT,
  SNIPPET_ORG,
  SNIPPET_WEBSITE,
  SNIPPET_FAQ,
  SNIPPET_HOWTO,
  SNIPPET_BREADCRUMB,
  SHOPIFY_HOWTO,
} from "../snippets";
import { getJsonLdObjects, looksBlocked } from "@/lib/grader/html";

type Node = Record<string, unknown>;

function collectNodes(node: unknown, out: Node[]): void {
  if (Array.isArray(node)) {
    node.forEach((n) => collectNodes(n, out));
    return;
  }
  if (node && typeof node === "object") {
    const obj = node as Node;
    out.push(obj);
    if (Array.isArray(obj["@graph"])) collectNodes(obj["@graph"], out);
    // ProductGroup nests its variants in hasVariant — recurse so the individual
    // Product nodes (with offers/sku) are seen and not reported as "missing".
    if (obj.hasVariant) collectNodes(obj.hasVariant, out);
  }
}

function typesOf(node: Node): string[] {
  const t = node["@type"];
  if (typeof t === "string") return [t];
  if (Array.isArray(t)) return t.filter((x): x is string => typeof x === "string");
  return [];
}

function firstOffer(node: Node): Node | null {
  const offers = node.offers;
  if (!offers) return null;
  if (Array.isArray(offers)) return (offers[0] as Node) ?? null;
  if (typeof offers === "object") return offers as Node;
  return null;
}

/** Shopify (and most platforms) put products at /products/<handle>. */
function looksLikeProductUrl(url: string): boolean {
  try {
    return /\/products\//.test(new URL(url).pathname);
  } catch {
    return /\/products\//.test(url);
  }
}

export async function analyzeSchema(url: string): Promise<ToolResult> {
  const page = await fetchPage(url);
  const notes: string[] = [];
  const h = host(page.finalUrl);

  if (!page.ok) notes.push("We couldn't fetch this page — it may be down or blocking requests.");
  else if (looksBlocked(page.html)) notes.push("This page is behind a bot/security check, so schema may be incomplete.");

  const objects = getJsonLdObjects(page.html);
  const nodes: Node[] = [];
  objects.forEach((o) => collectNodes(o, nodes));

  const allTypes = [...new Set(nodes.flatMap(typesOf))];
  // Treat ProductGroup (variant parent) as product schema too; prefer an actual
  // Product node (it carries offers/sku) but fall back to the group.
  const productNodes = nodes.filter((n) => typesOf(n).includes("Product"));
  const productGroup = nodes.find((n) => typesOf(n).includes("ProductGroup")) ?? null;
  const products = productNodes.length ? productNodes : productGroup ? [productGroup] : [];
  const product = productNodes[0] ?? productGroup;
  // A ProductGroup keeps price/availability on its variants and name/brand on itself.
  const offer = product ? firstOffer(product) ?? (productGroup && productNodes[0] ? firstOffer(productNodes[0]) : null) : null;
  const groupFallback = (field: string): boolean => !!(product?.[field] ?? productGroup?.[field]);

  const hasOrg = allTypes.some((t) => t === "Organization" || t === "LocalBusiness");
  const websiteNode = nodes.find((n) => typesOf(n).includes("WebSite"));
  const hasSearchAction = (() => {
    const pa = websiteNode?.potentialAction;
    const arr = Array.isArray(pa) ? pa : pa ? [pa] : [];
    return arr.some((a) => a && typeof a === "object" && typesOf(a as Node).includes("SearchAction"));
  })();
  const hasBreadcrumb = allTypes.includes("BreadcrumbList");
  const hasFaq = allTypes.includes("FAQPage");
  const hasHowTo = allTypes.includes("HowTo");

  // Product-page aware: only run per-field product checks when this is a product
  // page (URL says /products/ OR Product schema is present).
  const isProductPage = looksLikeProductUrl(page.finalUrl) || !!product;
  const productField = (present: boolean): ToolStatus => (present ? "pass" : "warn");

  const checks: ToolCheck[] = [
    {
      id: "has-jsonld",
      label: "Structured data (JSON-LD) present",
      status: nodes.length > 0 ? "pass" : "fail",
      value: nodes.length ? `${allTypes.slice(0, 6).join(", ")}` : "none found",
      fix: "Add JSON-LD structured data so Google can show rich results and AI engines can read your facts.",
      howto: SHOPIFY_HOWTO,
      snippet: SNIPPET_ORG,
      free: true,
    },
  ];

  if (isProductPage) {
    // Is Product schema actually there on a product page?
    checks.push({
      id: "product-schema",
      label: "Product schema on this page",
      status: product ? "pass" : "fail",
      value: product ? `${products.length} product node(s)` : "missing on this product page",
      fix: product ? undefined : "This is a product page but has no Product JSON-LD — add it so Google shows price, availability & review stars.",
      howto: product ? undefined : SHOPIFY_HOWTO,
      snippet: product ? undefined : SNIPPET_PRODUCT,
      free: true,
    });

    if (product) {
      checks.push(
        {
          id: "product-name",
          label: "Product: name",
          status: productField(groupFallback("name")),
          value: groupFallback("name") ? "present" : "missing",
          fix: "Include the product name in Product schema.",
          howto: ['Set "name" to the product title (e.g. {{ product.title }} in Liquid).'],
        },
        {
          id: "product-image",
          label: "Product: image",
          status: productField(groupFallback("image")),
          value: groupFallback("image") ? "present" : "missing",
          fix: "Include an image URL — required for product rich results.",
          howto: ['Set "image" to one or more absolute image URLs (https://…), not relative paths.'],
        },
        {
          id: "product-description",
          label: "Product: description",
          status: productField(groupFallback("description")),
          value: groupFallback("description") ? "present" : "missing",
          fix: "Add a product description — AI answers and rich results quote it.",
          howto: ['Set "description" to a plain-text summary (strip HTML from {{ product.description }}).'],
        },
        {
          id: "product-brand",
          label: "Product: brand",
          status: productField(groupFallback("brand")),
          value: groupFallback("brand") ? "present" : "missing",
          fix: "Add the brand — Google uses it to match products and show brand info.",
          howto: ['Add "brand": { "@type": "Brand", "name": "{{ product.vendor }}" }.'],
        },
        {
          id: "product-sku",
          label: "Product: SKU / GTIN",
          status: productField(groupFallback("sku") || groupFallback("gtin") || groupFallback("gtin13") || groupFallback("mpn") || groupFallback("productGroupID")),
          value: groupFallback("sku") || groupFallback("gtin") || groupFallback("gtin13") || groupFallback("mpn") || groupFallback("productGroupID") ? "present" : "missing",
          fix: "Add a unique product identifier (sku, gtin, or mpn) so Google can match your product across the web.",
          howto: ['Add "sku": "{{ variant.sku }}" and, if you have one, "gtin13": "<barcode>".'],
        },
        {
          id: "product-price",
          label: "Product: price & currency",
          status: productField(!!(offer && (offer.price || offer.priceSpecification))),
          value: offer && (offer.price || offer.priceSpecification) ? "present" : "missing",
          fix: "Include offers.price and priceCurrency.",
          howto: ['Inside "offers", set "price" and "priceCurrency" (e.g. "USD").'],
        },
        {
          id: "product-availability",
          label: "Product: availability",
          status: productField(!!offer?.availability),
          value: offer?.availability ? "present" : "missing",
          fix: "Include offers.availability (e.g. https://schema.org/InStock).",
          howto: ['Inside "offers", set "availability" to https://schema.org/InStock or /OutOfStock.'],
        },
        {
          id: "product-rating",
          label: "Product: rating / reviews (only if real)",
          status: groupFallback("aggregateRating") || groupFallback("review") ? "pass" : "info",
          value: groupFallback("aggregateRating") || groupFallback("review") ? "present" : "none",
          fix: "Star ratings boost click-through — but only add aggregateRating/review backed by REAL reviews. Fabricated ratings risk a manual Google penalty.",
          howto: [
            "Only add this if you have genuine reviews (e.g. from Judge.me, Loox, or Shopify Product Reviews).",
            'Output "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "126" } from your review app\'s real data.',
          ],
        },
      );
    }
  } else {
    checks.push({
      id: "product-schema",
      label: "Product schema",
      status: "info",
      value: "not a product page",
      fix: "Run this tool on a product URL (e.g. yourstore.com/products/…) to check Product schema fields like price, availability, brand and SKU.",
      free: true,
    });
  }

  checks.push(
    {
      id: "org-schema",
      label: "Organization schema (brand entity)",
      status: hasOrg ? "pass" : "warn",
      value: hasOrg ? "present" : "missing",
      fix: "Add Organization JSON-LD (name, logo, sameAs) for brand knowledge panels and AI entity recognition.",
      howto: SHOPIFY_HOWTO,
      snippet: hasOrg ? undefined : SNIPPET_ORG,
    },
    {
      id: "website-schema",
      label: "WebSite schema with SearchAction",
      status: websiteNode ? (hasSearchAction ? "pass" : "warn") : "warn",
      value: websiteNode ? (hasSearchAction ? "present + SearchAction" : "present, no SearchAction") : "missing",
      fix: "Add WebSite JSON-LD with a SearchAction so Google can show a sitelinks search box.",
      howto: SHOPIFY_HOWTO,
      snippet: hasSearchAction ? undefined : SNIPPET_WEBSITE,
    },
    {
      id: "faq-schema",
      label: "FAQPage schema (rich results + AI answers)",
      status: hasFaq ? "pass" : "info",
      value: hasFaq ? "present" : "none",
      fix: "Add FAQPage JSON-LD that mirrors your visible Q&A — strong for rich results and frequently quoted in AI answers.",
      howto: [
        "Only mark up Q&As that are actually visible on the page.",
        ...SHOPIFY_HOWTO.slice(1),
      ],
      snippet: hasFaq ? undefined : SNIPPET_FAQ,
    },
    {
      id: "howto-schema",
      label: "HowTo schema (step-by-step rich results)",
      status: hasHowTo ? "pass" : "info",
      value: hasHowTo ? "present" : "none",
      fix: "If a page has instructions (setup, usage, care), add HowTo JSON-LD so Google can show a step-by-step rich result.",
      howto: [
        "Use this only on pages that genuinely contain step-by-step instructions.",
        ...SHOPIFY_HOWTO.slice(1),
      ],
      snippet: hasHowTo ? undefined : SNIPPET_HOWTO,
    },
    {
      id: "breadcrumb",
      label: "BreadcrumbList schema",
      status: hasBreadcrumb ? "pass" : "warn",
      value: hasBreadcrumb ? "present" : "missing",
      fix: "Add BreadcrumbList so results show a breadcrumb trail instead of a raw URL.",
      howto: SHOPIFY_HOWTO,
      snippet: hasBreadcrumb ? undefined : SNIPPET_BREADCRUMB,
    },
  );

  const score = scoreChecks(checks);

  return {
    tool: "structured-data-checker",
    url: page.finalUrl,
    host: h,
    scannedAt: new Date().toISOString(),
    score,
    grade: gradeFromScore(score),
    summary: nodes.length
      ? `Found ${allTypes.length} schema type(s): ${allTypes.slice(0, 4).join(", ")}`
      : "No structured data found",
    checks,
    data: { types: allTypes, productCount: products.length, isProductPage },
    notes,
  };
}
