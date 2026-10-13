/**
 * Partner/category input validation — client-safe, so the admin form shows the
 * same errors the server enforces. Limits follow the card design (e.g. the
 * description is clamped to 3 lines on the page).
 */

import { imageUrlProblem, normalizeImageUrl } from "./imageHosts";
import type { PartnerInput } from "./types";

export type FieldErrors = Partial<Record<keyof PartnerInput | "label" | "color", string>>;

export const LIMITS = {
  name: 60,
  developer: 40,
  description: 160,
  offerBadge: 14,
  terms: 70,
  code: 24,
  codeNote: 60,
  categoryLabel: 24,
} as const;

/** Ready-made notes for deals without a code (the admin can also type their own). */
export const CODE_NOTE_PRESETS = [
  "Applied through the deal link",
  "No code needed",
  "Applied automatically after install",
  "No discount code",
  "Code coming soon",
];

const HEX = /^#[0-9a-f]{6}$/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

function httpsUrl(v: string): boolean {
  try {
    return new URL(v).protocol === "https:";
  } catch {
    return false;
  }
}

/** Normalise + validate raw form input. Category existence is checked by the caller. */
export function parsePartnerInput(raw: unknown): { ok: true; data: PartnerInput } | { ok: false; errors: FieldErrors } {
  const r = (raw ?? {}) as Record<string, unknown>;
  const errors: FieldErrors = {};

  const need = (key: keyof typeof LIMITS & keyof PartnerInput, label: string) => {
    const v = str(r[key]);
    if (!v) errors[key] = `${label} is required`;
    else if (v.length > LIMITS[key]) errors[key] = `${label} must be ${LIMITS[key]} characters or fewer`;
    return v;
  };

  const name = need("name", "Name");
  const developer = need("developer", "Developer");
  const description = need("description", "Description");
  const offerBadge = need("offerBadge", "Offer badge");
  const terms = need("terms", "Terms");

  const category = str(r.category);
  if (!category) errors.category = "Choose a category";

  const validUntil = str(r.validUntil);
  if (!DATE.test(validUntil) || isNaN(new Date(`${validUntil}T00:00:00Z`).getTime())) {
    errors.validUntil = "Pick the last valid day";
  }

  const code = str(r.code) || null;
  if (code && code.length > LIMITS.code) errors.code = `Code must be ${LIMITS.code} characters or fewer`;
  const codeNote = code ? null : str(r.codeNote) || null;
  if (!code && !codeNote) errors.codeNote = "Add a note (e.g. “No code needed”) when there's no code";
  if (codeNote && codeNote.length > LIMITS.codeNote) errors.codeNote = `Note must be ${LIMITS.codeNote} characters or fewer`;

  const ctaUrl = str(r.ctaUrl);
  if (!httpsUrl(ctaUrl)) errors.ctaUrl = "Use a full https:// link";

  const bannerUrl = str(r.bannerUrl) ? normalizeImageUrl(str(r.bannerUrl)) : null;
  const bannerProblem = bannerUrl ? imageUrlProblem(bannerUrl) : null;
  if (bannerProblem) errors.bannerUrl = bannerProblem;

  const logoUrl = str(r.logoUrl) ? normalizeImageUrl(str(r.logoUrl)) : null;
  const logoProblem = logoUrl ? imageUrlProblem(logoUrl) : null;
  if (logoProblem) errors.logoUrl = logoProblem;

  const accentColor = str(r.accentColor) || null;
  if (accentColor && !HEX.test(accentColor)) errors.accentColor = "Use a colour like #3e97f0";

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      name,
      developer,
      category,
      description,
      offerBadge,
      terms,
      validUntil,
      hideAfterEnd: r.hideAfterEnd === true,
      code,
      codeNote,
      ctaUrl,
      bannerUrl,
      logoUrl,
      accentColor,
      isActive: r.isActive !== false,
    },
  };
}

export function parseCategoryInput(
  raw: unknown,
): { ok: true; data: { label: string; color: string } } | { ok: false; errors: FieldErrors } {
  const r = (raw ?? {}) as Record<string, unknown>;
  const label = str(r.label);
  const color = str(r.color);
  const errors: FieldErrors = {};
  if (!label) errors.label = "Label is required";
  else if (label.length > LIMITS.categoryLabel) errors.label = `Label must be ${LIMITS.categoryLabel} characters or fewer`;
  if (!HEX.test(color)) errors.color = "Use a colour like #3e97f0";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data: { label, color } };
}
