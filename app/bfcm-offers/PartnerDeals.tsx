"use client";

import { useState } from "react";
import s from "./bfcm.module.css";
import PartnerCard from "./PartnerCard";
import type { PublicCategory, PublicPartner } from "@/lib/bfcm/types";

/**
 * Partner deal cards (order + tabs managed in /admin) with category tabs and a
 * "View more" reveal. All cards are rendered into the HTML; those outside the
 * current view are `hidden`.
 */
export default function PartnerDeals({
  partners,
  categories,
  visibleCount,
}: {
  partners: PublicPartner[];
  categories: PublicCategory[];
  visibleCount: number;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState(false);

  const tabs = [{ slug: "all", label: "All deals" }, ...categories];
  const matches = partners.filter((p) => filter === "all" || p.categorySlug === filter);
  const shown = new Set((expanded ? matches : matches.slice(0, visibleCount)).map((p) => p.slug));
  const rest = matches.length - visibleCount;

  return (
    <>
      <div className={s.tabs} role="group" aria-label="Filter partner deals">
        {tabs.map((t) => (
          <button
            key={t.slug}
            type="button"
            className={s.tab}
            aria-pressed={filter === t.slug}
            onClick={() => setFilter(t.slug)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={s.pgrid}>
        {partners.map((p) => (
          <PartnerCard key={p.slug} p={p} hidden={!shown.has(p.slug)} />
        ))}
      </div>

      {!expanded && rest > 0 && (
        <div className={s.moreWrap}>
          <button className={s.btn} type="button" onClick={() => setExpanded(true)}>
            View more partner deals ({rest})
          </button>
        </div>
      )}
    </>
  );
}
