/**
 * Meta & Social Preview analyzer — how a URL looks in Google + social shares.
 */

import type { ToolCheck, ToolResult, ToolStatus } from "../types";
import { fetchPage, host } from "../http";
import { scoreChecks, gradeFromScore } from "../score";
import {
  getTitle,
  getMetaName,
  getMetaProperty,
  getLinkHref,
  looksBlocked,
} from "@/lib/grader/html";

function lenStatus(value: string | null, min: number, max: number): ToolStatus {
  if (!value) return "fail";
  return value.length >= min && value.length <= max ? "pass" : "warn";
}

export async function analyzeMeta(url: string): Promise<ToolResult> {
  const page = await fetchPage(url);
  const notes: string[] = [];
  const h = host(page.finalUrl);

  if (!page.ok) {
    notes.push("We couldn't fetch this page — it may be down or blocking automated requests.");
  } else if (looksBlocked(page.html)) {
    notes.push("This page is behind a bot/security check, so tags may be incomplete.");
  }

  const html = page.html;
  const title = getTitle(html);
  const description = getMetaName(html, "description");
  const canonical = getLinkHref(html, "canonical");
  const robots = getMetaName(html, "robots");
  const viewport = getMetaName(html, "viewport");
  const favicon = getLinkHref(html, "icon");

  const og = {
    title: getMetaProperty(html, "og:title"),
    description: getMetaProperty(html, "og:description"),
    image: getMetaProperty(html, "og:image"),
    type: getMetaProperty(html, "og:type"),
    siteName: getMetaProperty(html, "og:site_name"),
    url: getMetaProperty(html, "og:url"),
  };
  const twitter = {
    card: getMetaName(html, "twitter:card"),
    title: getMetaName(html, "twitter:title"),
    description: getMetaName(html, "twitter:description"),
    image: getMetaName(html, "twitter:image"),
  };

  const noindex = !!robots && /noindex/i.test(robots);

  const checks: ToolCheck[] = [
    {
      id: "title",
      label: "Title tag present and well-sized (30–60 chars)",
      status: lenStatus(title, 30, 60),
      value: title ? `${title.length} chars` : "missing",
      fix: "Write a unique 30–60 character title with your brand + primary keyword.",
      free: true,
    },
    {
      id: "description",
      label: "Meta description present and well-sized (70–160 chars)",
      status: lenStatus(description, 70, 160),
      value: description ? `${description.length} chars` : "missing",
      fix: "Add a compelling 70–160 character meta description that earns the click.",
      free: true,
    },
    {
      id: "og-image",
      label: "Open Graph image (og:image)",
      status: og.image ? "pass" : "fail",
      value: og.image ? "present" : "missing",
      fix: "Add an og:image (1200×630) so shared links show a rich preview.",
    },
    {
      id: "og-basic",
      label: "Open Graph title & description",
      status: og.title && og.description ? "pass" : og.title || og.description ? "warn" : "fail",
      value: og.title && og.description ? "present" : "incomplete",
      fix: "Set og:title and og:description for clean social shares.",
    },
    {
      id: "twitter-card",
      label: "Twitter/X card tags",
      status: twitter.card ? "pass" : "warn",
      value: twitter.card ?? "missing",
      fix: 'Add twitter:card (e.g. "summary_large_image") plus title/description/image.',
    },
    {
      id: "canonical",
      label: "Canonical URL",
      status: canonical ? "pass" : "warn",
      value: canonical ? "present" : "missing",
      fix: "Add a rel=canonical link to avoid duplicate-content dilution.",
    },
    {
      id: "favicon",
      label: "Favicon",
      status: favicon ? "pass" : "warn",
      value: favicon ? "present" : "missing",
      fix: "Add a favicon so your brand shows in tabs and results.",
    },
    {
      id: "viewport",
      label: "Mobile viewport meta",
      status: viewport ? "pass" : "fail",
      value: viewport ? "present" : "missing",
      fix: "Add <meta name=viewport content='width=device-width, initial-scale=1'>.",
    },
    {
      id: "indexable",
      label: "Page is indexable (no noindex)",
      status: noindex ? "fail" : "pass",
      value: noindex ? "noindex set" : "indexable",
      fix: "Remove the noindex robots directive if you want this page in search.",
    },
  ];

  const score = scoreChecks(checks);

  return {
    tool: "meta-social-preview",
    url: page.finalUrl,
    host: h,
    scannedAt: new Date().toISOString(),
    score,
    grade: gradeFromScore(score),
    summary: `${checks.filter((c) => c.status === "pass").length}/${checks.length} social & SEO tags look good`,
    checks,
    data: {
      title: title ?? "",
      description: description ?? "",
      displayUrl: h,
      og,
      twitter,
      favicon: favicon ?? null,
    },
    notes,
  };
}
