/** BFCM partner-deal shapes shared by the store, the public page and the admin (client-safe). */

/** A partner category (tab on the page). Referenced by partners via its immutable `slug`. */
export interface BfcmCategory {
  id: string;
  slug: string;
  label: string;
  /** Card accent colour, #rrggbb. */
  color: string;
  position: number;
  isActive: boolean;
}

/** A partner deal as stored/edited in admin. */
export interface BfcmPartner {
  id: string;
  /** Unique, from the name; used for the page anchor #p-<slug>. */
  slug: string;
  name: string;
  developer: string;
  /** Category slug. */
  category: string;
  description: string;
  offerBadge: string;
  terms: string;
  /** Last valid day, YYYY-MM-DD. Shown as "Until Dec 30, 2026". */
  validUntil: string;
  /** Hide the card automatically once validUntil has passed. */
  hideAfterEnd: boolean;
  code: string | null;
  /** Shown instead of a code box when there's no code. */
  codeNote: string | null;
  ctaUrl: string;
  bannerUrl: string | null;
  logoUrl: string | null;
  /** Optional per-card colour override; otherwise the category colour. */
  accentColor: string | null;
  position: number;
  isActive: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

/** Editable fields (what the admin form submits). */
export type PartnerInput = Omit<BfcmPartner, "id" | "slug" | "position" | "updatedAt" | "updatedBy">;

/** Everything one card needs to render, already resolved (colour, label, dates). */
export interface PublicPartner {
  slug: string;
  name: string;
  developer: string;
  description: string;
  offerBadge: string;
  terms: string;
  untilLabel: string;
  code: string | null;
  codeNote: string | null;
  ctaUrl: string;
  bannerUrl: string | null;
  logoUrl: string | null;
  initials: string;
  accent: string;
  categorySlug: string;
  categoryLabel: string;
}

export interface PublicCategory {
  slug: string;
  label: string;
}
