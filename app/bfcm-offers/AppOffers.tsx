"use client";

import { useState } from "react";
import Image from "next/image";
import s from "./bfcm.module.css";
import { ArrowRight, Check } from "./icons";
import type { EfoliOffer, OfferCategory } from "@/data/bfcm2026";

/**
 * eFoli app cards with "All / Sell more / Operate smarter" filter tabs. Every
 * card is always in the HTML (filtered ones get `hidden`), so crawlers see all six.
 */
export default function AppOffers({
  offers,
  filters,
  terms,
  code,
  discount,
}: {
  offers: EfoliOffer[];
  filters: { id: "all" | OfferCategory; label: string }[];
  terms: string[];
  code: string;
  discount: number;
}) {
  const [filter, setFilter] = useState<"all" | OfferCategory>("all");

  return (
    <>
      <div className={s.tabs} role="group" aria-label="Filter eFoli apps">
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

      <div className={s.appGrid}>
        {offers.map((o) => (
          <article
            key={o.id}
            id={o.id}
            className={s.appCard}
            hidden={filter !== "all" && o.category !== filter}
            style={{ "--glow": o.glow } as React.CSSProperties}
          >
            <div className={s.appTop}>
              <Image className={s.appIcon} src={o.icon} alt="" width={48} height={48} quality={100} />
              <div>
                <h3>{o.name}</h3>
                <span className={s.appCat}>{o.label}</span>
              </div>
              <span className={s.off}>{discount}% OFF</span>
            </div>
            <div className={s.appMedia}>
              <Image
                src={o.media}
                alt={`${o.name} on a Shopify store`}
                quality={100}
                sizes="(max-width: 640px) calc(100vw - 80px), (max-width: 980px) 45vw, 340px"
              />
            </div>
            <p>{o.blurb}</p>
            <ul className={s.checks}>
              {terms.map((t) => (
                <li key={t}>
                  <Check />
                  {t}
                </li>
              ))}
            </ul>
            <div className={s.appFoot}>
              <span className={s.codeChip}>CODE: {code}</span>
              <a className={s.appLink} href={o.href} target="_blank" rel="noopener">
                View deal <ArrowRight />
                <span className="sr-only"> for {o.name} (opens in a new tab)</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
