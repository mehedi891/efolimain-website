/** Client-safe helpers shared by the public page and the admin preview. */

import type { BfcmCategory, PartnerInput, PublicPartner } from "./types";

/** "Outfy – Social Media Auto Post" → "OS", "Buystro" → "B", "iCart Cart…" → "IC". */
export function initialsOf(name: string): string {
  const words = name.split(/[^A-Za-z0-9]+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/** "2026-12-30" → "Until Dec 30, 2026" (UTC, so it never shifts a day). */
export function untilLabel(validUntil: string): string {
  const d = new Date(`${validUntil}T00:00:00Z`);
  if (isNaN(d.getTime())) return "";
  const s = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  return `Until ${s}`;
}

/** Today as YYYY-MM-DD (UTC). */
export function todayKey(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** True once the deal's last valid day is over. */
export function isExpired(validUntil: string, now: Date = new Date()): boolean {
  return todayKey(now) > validUntil;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "item";
}

/** Resolve a partner (+ its category) into exactly what one card renders. */
export function toPublicPartner(
  p: PartnerInput & { slug: string },
  category: Pick<BfcmCategory, "slug" | "label" | "color"> | undefined,
): PublicPartner {
  return {
    slug: p.slug,
    name: p.name,
    developer: p.developer,
    description: p.description,
    offerBadge: p.offerBadge,
    terms: p.terms,
    validUntil: p.validUntil,
    untilLabel: untilLabel(p.validUntil),
    code: p.code,
    codeNote: p.codeNote,
    ctaUrl: p.ctaUrl,
    bannerUrl: p.bannerUrl,
    logoUrl: p.logoUrl,
    initials: initialsOf(p.name),
    accent: p.accentColor || category?.color || "#3e97f0",
    categorySlug: category?.slug ?? p.category,
    categoryLabel: category?.label ?? "",
  };
}
