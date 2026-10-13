import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";
import JsonLd from "@/components/JsonLd";
import {
  CAMPAIGN,
  EFOLI_OFFERS,
  FAQS,
  FEATURED_GUIDE,
  GUIDE_GROUPS,
  HERO_SLOTS,
  OFFER_FILTERS,
  OFFER_TERMS,
  PAGE_URL,
  TICKER_ITEMS,
  TRUST_POINTS,
  partnerBadge,
} from "@/data/bfcm2026";
import { getPublicBfcmData } from "@/lib/bfcm/store";
import { isCampaignLive } from "@/data/bfcmCampaign";
import { buildBfcmJsonLd } from "@/lib/bfcm/schema";
import s from "./bfcm.module.css";
import AppOffers from "./AppOffers";
import PartnerDeals from "./PartnerDeals";
import CopyButton from "./CopyButton";
import Countdown from "./Countdown";
import BfcmAnalytics from "./BfcmAnalytics";
import Faq from "./Faq";
import HeroCount from "./HeroCount";
import { ArrowRight, ArrowUpRight, GuideIcon, Mail } from "./icons";

const TITLE = "BFCM 2026 Shopify App Deals & Partner Offers | EFOLI";
const DESCRIPTION =
  "Explore BFCM 2026 Shopify app offers from EFOLI and our partners. Save 30% on eligible EFOLI plans and discover deals for bundles, marketing, and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  // og:image / twitter:image come from opengraph-image.tsx + twitter-image.tsx in this folder.
  openGraph: { type: "website", siteName: "EFOLI", url: PAGE_URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = { themeColor: "#1d74bf" };

const guideCount = 1 + GUIDE_GROUPS.reduce((n, g) => n + g.links.length, 0);

// Partner deals come from MongoDB (managed in /admin). The page stays pre-built;
// admin saves refresh it immediately (revalidatePath), and this hourly re-render
// is the fallback (e.g. deals set to hide after their end date).
export const revalidate = 3600;

// Light header + dark footer, site CTA banner hidden (the page has its own CTAs).
export default async function BfcmOffersPage() {
  const { partners, categories } = await getPublicBfcmData();
  // Re-checked on every ISR render (hourly + on admin saves).
  const live = isCampaignLive();
  const deadline = `${CAMPAIGN.endsLong} at ${CAMPAIGN.endsTime}`;

  // Offers + FAQ structured data, from the same data as the visible cards.
  const jsonLd = buildBfcmJsonLd({ title: TITLE, description: DESCRIPTION, efoliOffers: EFOLI_OFFERS, partners, faqs: FAQS });

  // Hero: eFoli icons stay fixed; partner slots take the first visible partners' logos.
  const partnerLogos = partners.map((p) => p.logoUrl).filter((u): u is string => !!u);
  let nextLogo = 0;
  const heroIcons = HERO_SLOTS.flatMap((slot) => {
    const src = slot.icon ?? partnerLogos[nextLogo++];
    return src ? [{ ...slot, src, isEfoli: !!slot.icon }] : [];
  });

  return (
    <SiteChrome darkFooter hideBanner>
      <main className={s.page}>
        <JsonLd data={jsonLd} />
        <BfcmAnalytics />

        {/* HERO */}
        <section className={`${s.hero} ${s.center}`}>
          <div className={s.heroFloat} aria-hidden="true">
            {heroIcons.map((f, i) => (
              <Image
                key={i}
                src={f.src}
                alt=""
                width={f.size}
                height={f.size}
                className={[f.isEfoli ? s.floatEf : "", f.more ? s.floatMore : ""].join(" ").trim() || undefined}
                style={
                  {
                    left: f.left,
                    top: f.top,
                    "--s": `${f.size}px`,
                    "--r": `${f.rotate}deg`,
                    "--d": `${f.delay}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <div className={s.wrap}>
            {!live && (
              <p className={s.endedNote} role="status">
                The EFOLI BFCM 2026 offer ended on {CAMPAIGN.endsLong}. Partner offers have their own end dates.
              </p>
            )}
            <span className={s.tag}>EFOLI BFCM Partner Campaign 2026</span>
            <h1>
              Find the Right Shopify Apps for Your <em>BFCM Growth.</em>
            </h1>
            <p className={s.heroHighlight}>
              <span
                className={s.dCount}
                role="img"
                aria-label={`${CAMPAIGN.discount} percent off eligible EFOLI plans for ${CAMPAIGN.duration}`}
              >
                <b>
                  <HeroCount to={CAMPAIGN.discount} />%
                </b>
                <i>
                  OFF eligible
                  <br />
                  EFOLI plans
                  <br />
                  for {CAMPAIGN.duration}
                </i>
              </span>
            </p>
            <p className={s.heroLede}>
              Explore offers from <strong>EFOLI and participating Shopify app partners</strong>. Find tools for
              bundles, discounts, marketing, conversion, and store operations.
            </p>

            <nav className={s.appPills} aria-label="EFOLI apps on offer">
              {EFOLI_OFFERS.map((o) => (
                <a key={o.id} className={s.appPill} href={`#${o.id}`}>
                  <Image src={o.icon} alt="" width={26} height={26} />
                  {o.name}
                </a>
              ))}
            </nav>

            <div className={s.heroActions}>
              <div className={s.codeBox}>
                <span>Campaign code</span>
                <strong>{CAMPAIGN.code}</strong>
                <CopyButton
                  className={s.copyBtn}
                  text={CAMPAIGN.code}
                  label="Copy code"
                  resetMs={2500}
                  track={{ ev: "promo_code_copy", offerId: "efoli", code: CAMPAIGN.code }}
                />
              </div>
              <a className={s.btn} href="#offers" data-ev="hero_cta_click" data-target="efoli">
                Explore EFOLI Offers
              </a>
              <a className={`${s.btn} ${s.btnOutline}`} href="#partners" data-ev="hero_cta_click" data-target="partners">
                Browse Partner Offers
              </a>
            </div>
            <p className={s.heroDeadline}>
              Code <strong>{CAMPAIGN.code}</strong> · Ends {deadline}
            </p>
          </div>
        </section>

        <div className={s.trust}>
          <div className={s.wrap}>
            {TRUST_POINTS.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        {/* EFOLI APPS */}
        <section className={s.apps} id="offers">
          <div className={s.wrap}>
            <div className={s.center}>
              <span className={s.tag}>EFOLI campaign offers</span>
              <h2 className={s.secTitle}>
                <em>{CAMPAIGN.discount}% OFF</em> Eligible Plans on Every EFOLI App
              </h2>
              <p className={s.secCopy}>
                Choose the apps that match your next growth move, from larger wholesale orders and smarter pricing to
                bundles, quotes, and controlled operations.
              </p>
            </div>
            <AppOffers
              offers={EFOLI_OFFERS}
              filters={OFFER_FILTERS}
              terms={OFFER_TERMS}
              code={CAMPAIGN.code}
              discount={CAMPAIGN.discount}
            />
          </div>
        </section>

        {/* Ticker — content repeated so the -50% loop is seamless */}
        <div className={s.ticker} aria-hidden="true">
          <div>
            {[0, 1, 2, 3].flatMap((r) => TICKER_ITEMS.map((t) => <span key={`${r}-${t}`}>{t}</span>))}
          </div>
        </div>

        {/* PARTNER DEALS */}
        <section className={s.partners} id="partners">
          <div className={s.wrap}>
            <div className={s.partnersHead}>
              <div className={s.badgeWrap}>
                <Image
                  className={s.partnerBadge}
                  src={partnerBadge}
                  alt="EFOLI BFCM Partner 2026 badge"
                  width={170}
                  height={170}
                />
              </div>
              <div>
                <span className={s.tag}>Campaign partners</span>
                <h2 className={s.secTitle}>
                  Trusted Partners. <em>BFCM Offers &amp; Picks.</em>
                </h2>
                <p className={s.secCopy}>
                  Hand-picked Shopify apps from our partners across marketing, conversion, store operations, global
                  selling, and reviews. Each offer is provided and supported by its partner, so check every card for
                  its own terms and end date.
                </p>
              </div>
            </div>
            {partners.length > 0 ? (
              <PartnerDeals partners={partners} categories={categories} visibleCount={CAMPAIGN.partnersVisible} />
            ) : (
              <p className={s.secCopy}>Partner deals are on their way — check back soon.</p>
            )}
          </div>
        </section>

        {/* GUIDES */}
        <section className={s.guides} id="guides">
          <div className={s.wrap}>
            <div className={s.guidesHead}>
              <div>
                <span className={s.tag}>Keep reading</span>
                <h2 className={s.secTitle}>More App Roundup</h2>
                <p className={s.secCopy}>
                  Practical comparisons and buying guides to help you choose the right Shopify apps for every stage
                  of growth.
                </p>
              </div>
              <span className={s.gCount}>{guideCount} guides</span>
            </div>
            <div className={s.gLayout}>
              <Link className={s.gFeature} href={FEATURED_GUIDE.href}>
                <span className={s.gEyebrow}>{FEATURED_GUIDE.eyebrow}</span>
                <h3>{FEATURED_GUIDE.title}</h3>
                <p>{FEATURED_GUIDE.blurb}</p>
                <span className={s.gGo}>
                  Read the guide <ArrowRight />
                </span>
                <span className={s.gBig} aria-hidden="true">
                  {FEATURED_GUIDE.big}
                </span>
              </Link>
              <div className={s.gGroups}>
                {GUIDE_GROUPS.map((g) => (
                  <div key={g.topic} className={s.gGroup} style={{ "--c": g.color } as React.CSSProperties}>
                    <div className={s.gGhead}>
                      <span className={s.gIco}>
                        <GuideIcon name={g.icon} />
                      </span>
                      <span className={s.gN}>{g.links.length} guides</span>
                    </div>
                    <h3 className={s.gTopicH}>{g.topic}</h3>
                    <p className={s.gSub}>{g.sub}</p>
                    <ul className={s.gList}>
                      {g.links.map((l) => (
                        <li key={l.href}>
                          <a href={l.href} target="_blank" rel="noopener noreferrer">
                            {l.title}
                            <ArrowUpRight />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* COUNTDOWN */}
        <section className={s.countdown}>
          <div className={s.wrap}>
            <h2>{live ? "Your Growth Window Is Open." : "The BFCM 2026 Window Has Closed."}</h2>
            <Countdown endsAt={CAMPAIGN.endsAt} />
            <p>
              The EFOLI offer closes on {deadline}. Get <b>{CAMPAIGN.discount}% OFF</b> eligible EFOLI plans for{" "}
              {CAMPAIGN.duration} with code <b>{CAMPAIGN.code}</b>.
            </p>
            <a className={`${s.btn} ${s.btnLime}`} href="#offers">
              Explore All Offers <ArrowRight />
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className={s.faq} id="faq">
          <div className={`${s.wrap} ${s.faqGrid}`}>
            <div className={s.faqIntro}>
              <span className={s.tag}>Good to know</span>
              <h2 className={s.secTitle}>Offer Details, Made Clear.</h2>
              <p className={s.secCopy}>Everything you need before choosing the EFOLI tools that fit your store.</p>
              <div className={s.faqFacts}>
                <span>Code {CAMPAIGN.code}</span>
                <span>
                  {CAMPAIGN.discount}% off · {CAMPAIGN.duration}
                </span>
                <span>Ends {CAMPAIGN.endsShort}</span>
              </div>
            </div>
            <div className={s.faqList}>
              <Faq items={FAQS} />
              <div className={s.faqHelp}>
                <Mail />
                <p>
                  Questions about an EFOLI offer or the {CAMPAIGN.code} code? Email{" "}
                  <a href="mailto:info@efoli.com" data-ev="support_click">
                    info@efoli.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className={s.closing}>
          <div className={`${s.wrap} ${s.closingCard}`}>
            <div>
              <h2>Make This Selling Season Your Smartest One Yet.</h2>
              <p>Compare EFOLI and partner offers, choose your tools, and build a stronger commerce experience.</p>
            </div>
            <a className={`${s.btn} ${s.btnLime}`} href="#offers">
              Explore all deals <ArrowRight />
            </a>
          </div>
          <p className={`${s.wrap} ${s.disclaimer}`}>Partner offer terms are set by each partner and subject to their confirmation.</p>
        </section>
      </main>
    </SiteChrome>
  );
}
