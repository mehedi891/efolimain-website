/**
 * Structured Data / Rich-Results checker — validates JSON-LD (Product, Organization,
 * Breadcrumb…) and flags missing fields that block rich results.
 */

import type { ToolCheck, ToolResult, ToolStatus } from "../types";
import { fetchPage, host } from "../http";
import { scoreChecks, gradeFromScore } from "../score";
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
  const products = nodes.filter((n) => typesOf(n).includes("Product"));
  const product = products[0] ?? null;
  const offer = product ? firstOffer(product) : null;

  const hasOrg = allTypes.some((t) => t === "Organization" || t === "WebSite" || t === "LocalBusiness");
  const hasBreadcrumb = allTypes.includes("BreadcrumbList");

  const productField = (present: boolean): ToolStatus => (!product ? "na" : present ? "pass" : "warn");

  const checks: ToolCheck[] = [
    {
      id: "has-jsonld",
      label: "Structured data (JSON-LD) present",
      status: nodes.length > 0 ? "pass" : "fail",
      value: nodes.length ? `${allTypes.slice(0, 6).join(", ")}` : "none found",
      fix: "Add JSON-LD structured data so Google can show rich results.",
      free: true,
    },
    {
      id: "product-schema",
      label: "Product schema on this page",
      status: product ? "pass" : "info",
      value: product ? `${products.length} product node(s)` : "not a product page (or missing)",
      fix: "On product pages, output valid Product JSON-LD.",
      free: true,
    },
    {
      id: "product-name",
      label: "Product: name",
      status: productField(!!product?.name),
      fix: "Include the product name in Product schema.",
    },
    {
      id: "product-image",
      label: "Product: image",
      status: productField(!!product?.image),
      fix: "Include an image URL — required for product rich results.",
    },
    {
      id: "product-price",
      label: "Product: price & currency",
      status: productField(!!(offer && (offer.price || offer.priceSpecification) )),
      fix: "Include offers.price and priceCurrency.",
    },
    {
      id: "product-availability",
      label: "Product: availability",
      status: productField(!!offer?.availability),
      fix: "Include offers.availability (e.g. https://schema.org/InStock).",
    },
    {
      id: "product-rating",
      label: "Product: aggregateRating / reviews",
      status: productField(!!(product?.aggregateRating || product?.review)),
      fix: "Add aggregateRating or review to earn star ratings in results.",
    },
    {
      id: "org-schema",
      label: "Organization / WebSite schema",
      status: hasOrg ? "pass" : "warn",
      value: hasOrg ? "present" : "missing",
      fix: "Add Organization/WebSite JSON-LD (logo, name, sameAs) for brand knowledge panels.",
    },
    {
      id: "breadcrumb",
      label: "BreadcrumbList schema",
      status: hasBreadcrumb ? "pass" : "warn",
      value: hasBreadcrumb ? "present" : "missing",
      fix: "Add BreadcrumbList so results show a breadcrumb trail.",
    },
  ];

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
    data: { types: allTypes, productCount: products.length },
    notes,
  };
}
