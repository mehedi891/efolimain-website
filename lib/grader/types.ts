/**
 * Shared types for the Free Shopify Store Audit tool.
 *
 * The audit is fully deterministic/rule-based (see docs/store-audit-tool-research.md §4D):
 * measure a signal → compare to a fixed, published threshold → score → render.
 */

export type Status = "pass" | "warn" | "fail" | "na";

/** Confidence tier: measured = lab/field data (Tier A), signal = heuristic (Tier B),
 *  manual = not reachable from a URL, shown as guidance only (Tier C). */
export type Tier = "measured" | "signal" | "manual";

export type Impact = "H" | "M" | "L";
export type Effort = "H" | "M" | "L";
export type Grade = "A" | "B" | "C" | "D" | "F";

export type PageType = "home" | "product" | "collection" | "cart";
/** Which page a check was derived from; "store" = store-wide (robots, SSL, apps…). */
export type CheckScope = PageType | "store";
export type Device = "mobile" | "desktop";

/** A single audited criterion. */
export interface Check {
  id: string;
  label: string;
  status: Status;
  tier: Tier;
  /** Human-readable measured value, e.g. "LCP 3.8s". */
  value?: string;
  impact?: Impact;
  effort?: Effort;
  /** One-line, actionable recommendation. */
  fix?: string;
  /** Citation URL backing the recommendation (web.dev / Shopify docs). */
  ref?: string;
  /** Relative weight within the pillar (default 1). */
  weight?: number;
  /** Which page this check came from (for the per-page view). Defaults to "store". */
  page?: CheckScope;
}

export interface Pillar {
  id: string;
  label: string;
  /** Share of the headline Store Score, 0..1. */
  weight: number;
  /** 0..100. */
  score: number;
  grade: Grade;
  checks: Check[];
}

/** A store screenshot captured during the scan. */
export interface Shot {
  page: PageType;
  device: Device;
  /** Inline data URI — used for the on-page report. */
  dataUri?: string;
  /** Hosted URL (Blob/R2) — used for the emailed report + PDF. */
  hostedUrl?: string;
}

export interface BfcmSummary {
  /** 0..100, re-weighted for peak-traffic season. */
  score: number;
  status: "on-track" | "at-risk" | "not-ready";
  daysToBlackFriday: number;
}

export interface ManualItem {
  label: string;
  note?: string;
}

/** Per-page audit summary (Home / Collection / Product / Cart). */
export interface PageAudit {
  type: PageType;
  label: string;
  url: string | null;
  /** tested = fetched OK & content readable; not-found = no such page; blocked = bot-wall/JS-only. */
  status: "tested" | "not-found" | "blocked";
  /** Speed score 0..100 (Home + Product only; null otherwise). */
  speedScore: number | null;
  speedGrade: Grade | null;
  /** Page-specific findings (excludes store-wide checks). */
  checks: Check[];
}

export interface Report {
  url: string;
  email: string;
  isShopify: boolean;
  /** ISO timestamp. */
  scannedAt: string;
  screenshots: Shot[];
  /** Hosted PDF (Blob/R2) — attached to email + downloadable on site. */
  pdfUrl?: string;
  /** Headline 0..100 across all pillars. */
  storeScore: number;
  grade: Grade;
  bfcm: BfcmSummary;
  pillars: Pillar[];
  /** Per-page audits (Home / Collection / Product / Cart). */
  pages: PageAudit[];
  /** Prioritized fixes (highest impact / lowest effort first). */
  topFixes: Check[];
  /** Tier C items — shown as guidance, never scored. */
  manualChecklist: ManualItem[];
  /** True when one or more collectors failed and the report is partial. */
  partial: boolean;
  /** Non-fatal notes surfaced to the UI (e.g. "PageSpeed data unavailable"). */
  notes: string[];
}
