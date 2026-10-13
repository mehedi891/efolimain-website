import Image from "next/image";
import s from "./bfcm.module.css";
import CopyButton from "./CopyButton";
import { ArrowRight, Clock, Tag } from "./icons";
import type { PublicPartner } from "@/lib/bfcm/types";

/**
 * One partner deal card — used by the public grid AND the admin live preview,
 * so what admins see is exactly what ships. `preview` skips image optimisation
 * (an admin may be mid-way through typing a link).
 */
export default function PartnerCard({
  p,
  hidden,
  preview = false,
}: {
  p: PublicPartner;
  hidden?: boolean;
  preview?: boolean;
}) {
  return (
    <article
      id={preview ? undefined : `p-${p.slug}`}
      className={s.pcard}
      hidden={hidden}
      style={{ "--accent": p.accent } as React.CSSProperties}
    >
      <div className={s.pcMedia}>
        {p.bannerUrl ? (
          <Image
            src={p.bannerUrl}
            alt={`${p.name} banner`}
            width={1200}
            height={628}
            sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 384px"
            unoptimized={preview}
          />
        ) : (
          <span className={s.ph} aria-hidden="true">
            {p.name || "Partner banner"}
          </span>
        )}
        <span className={s.pcOffer}>{p.offerBadge}</span>
      </div>

      <div className={s.pcBody}>
        <div className={s.pcLogo}>
          {p.logoUrl ? (
            <Image src={p.logoUrl} alt={`${p.name} logo`} width={64} height={64} unoptimized={preview} />
          ) : (
            <span className={s.ph} aria-hidden="true">
              {p.initials}
            </span>
          )}
        </div>
        <span className={s.pcCat}>{p.categoryLabel}</span>
        <h3>{p.name}</h3>
        <span className={s.pcBy}>by {p.developer}</span>
        <p>{p.description}</p>
        <ul className={s.pcTerms}>
          <li>
            <Tag />
            {p.terms}
          </li>
          <li>
            <Clock />
            {p.untilLabel}
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
          <a className={s.pcLink} href={p.ctaUrl} target="_blank" rel="noopener">
            Get deal <ArrowRight />
            <span className="sr-only"> on {p.name} (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </article>
  );
}
