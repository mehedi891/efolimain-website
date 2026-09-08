/**
 * Per-page view (Home / Collection / Product / Cart). Groups the already-computed
 * checks by the page they came from and attaches a speed score for the pages we
 * ran PageSpeed on (Home + Product). Presentation-only — it re-slices the same
 * checks that feed the pillar scores, so nothing is double-counted.
 */

import type { Check, PageAudit, PageType } from "./types";
import type { SiteScan, PageData } from "./fetchHtml";
import { getTitle, looksBlocked } from "./html";
import { gradeFromScore } from "./scoring";

const PAGE_LABELS: Record<PageType, string> = {
  home: "Home page",
  collection: "Collection page",
  product: "Product page",
  cart: "Cart page",
};

function pageStatus(page: PageData | null): PageAudit["status"] {
  if (!page || !page.ok) return "not-found";
  // A bot-wall or a JS-only page (no server <title>) can't be trusted.
  if (looksBlocked(page.html) || getTitle(page.html) === null) return "blocked";
  return "tested";
}

export function buildPages(
  scan: SiteScan,
  speedByPage: Partial<Record<PageType, number | null>>,
  allChecks: Check[],
): PageAudit[] {
  const dataByType: Record<PageType, PageData | null> = {
    home: scan.home,
    collection: scan.collection,
    product: scan.product,
    cart: scan.cart,
  };

  return (["home", "collection", "product", "cart"] as PageType[]).map((type) => {
    const data = dataByType[type];
    const speedScore = speedByPage[type] ?? null;
    return {
      type,
      label: PAGE_LABELS[type],
      url: data?.finalUrl ?? null,
      status: pageStatus(data),
      speedScore,
      speedGrade: speedScore != null ? gradeFromScore(speedScore) : null,
      checks: allChecks.filter((c) => c.page === type),
    };
  });
}
