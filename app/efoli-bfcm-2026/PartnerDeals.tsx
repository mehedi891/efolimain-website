"use client";

import { useState } from "react";
import Image from "next/image";
import s from "./bfcm.module.css";
import CopyButton from "./CopyButton";
import { ArrowRight, Clock, Tag } from "./icons";
import type { PartnerCategory, PartnerDeal } from "@/data/bfcm2026";

type Filter = "all" | PartnerCategory;

/**
 * Partner deal cards with category tabs and a "View more" reveal. All cards are
 * rendered into the HTML; those outside the current view are `hidden`.
 */
export default function PartnerDeals({
  partners,
  filters,
  categoryLabels,
  visibleCount,
}: {
  partners: PartnerDeal[];
  filters: { id: Filter; label: string }[];
  categoryLabels: Record<PartnerCategory, string>;
  visibleCount: number;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);

  const matches = partners.filter((p) => filter === "all" || p.category === filter);
  const shown = new Set((expanded ? matches : matches.slice(0, visibleCount)).map((p) => p.id));
  const rest = matches.length - visibleCount;

  return (
    <>
      <div className={s.tabs} role="group" aria-label="Filter partner deals">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={s.tab}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={s.pgrid}>
        {partners.map((p) => (
          <article
            key={p.id}
            id={`p-${p.id}`}
            className={s.pcard}
            hidden={!shown.has(p.id)}
            style={{ "--accent": p.accent } as React.CSSProperties}
          >
            <div className={s.pcMedia}>
              {p.banner ? (
                <Image
                  src={p.banner}
                  alt={`${p.name} banner`}
                  sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 384px"
                />
              ) : (
                <span className={s.ph} aria-hidden="true">
                  {p.name}
                </span>
              )}
              <span className={s.pcOffer}>{p.offer}</span>
            </div>

            <div className={s.pcBody}>
              <div className={s.pcLogo}>
                {p.logo ? (
                  <Image src={p.logo} alt={`${p.name} logo`} width={64} height={64} />
                ) : (
                  <span className={s.ph} aria-hidden="true">
                    {p.initials}
                  </span>
                )}
              </div>
              <span className={s.pcCat}>{categoryLabels[p.category]}</span>
              <h3>{p.name}</h3>
              <span className={s.pcBy}>by {p.by}</span>
              <p>{p.blurb}</p>
              <ul className={s.pcTerms}>
                <li>
                  <Tag />
                  {p.terms}
                </li>
                <li>
                  <Clock />
                  {p.until}
                </li>
              </ul>

              <div className={s.pcFoot}>
                {p.code ? (
                  <div className={s.pcCode}>
                    <span>Code</span>
                    <strong>{p.code}</strong>
                    <CopyButton className={s.pcCopy} text={p.code} srContext={`code ${p.code}`} />
                  </div>
                ) : (
                  <div className={`${s.pcCode} ${s.nocode}`}>{p.codeNote}</div>
                )}
                <a className={s.pcLink} href={p.href} target="_blank" rel="noopener sponsored">
                  Get deal <ArrowRight />
                  <span className="sr-only"> on {p.name}</span>
                </a>
              </div>
            </div>
          </article>
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
