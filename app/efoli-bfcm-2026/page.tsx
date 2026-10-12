import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";
import JsonLd from "@/components/JsonLd";
import { appByKey, appStoreHref } from "@/data/apps";
import {
  CAMPAIGN,
  EFOLI_OFFERS,
  FAQS,
  FEATURED_GUIDE,
  GUIDE_GROUPS,
  HERO_FLOAT,
  OFFER_FILTERS,
  OFFER_TERMS,
  PAGE_URL,
  PARTNERS,
  PARTNER_CATEGORY_LABELS,
  PARTNER_FILTERS,
  TICKER_ITEMS,
  TRUST_POINTS,
  partnerBadge,
} from "@/data/bfcm2026";
import s from "./bfcm.module.css";
import AppOffers, { type OfferCard } from "./AppOffers";
import PartnerDeals from "./PartnerDeals";
import CopyButton from "./CopyButton";
import Countdown from "./Countdown";
import Faq from "./Faq";
import HeroCount from "./HeroCount";
import { ArrowRight, ArrowUpRight, GuideIcon, Mail } from "./icons";

const TITLE = "eFoli BFCM 2026: Shopify App & Partner Deals";
const DESCRIPTION =
  "Explore eFoli BFCM 2026 Shopify app discounts and curated partner offers for B2B growth, bundles, pricing, operations, SEO, reviews, and retention.";
const OG_DESCRIPTION =
  "Explore limited-time eFoli Shopify app discounts and curated partner offers built to help merchants sell, operate, and grow.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", siteName: "eFoli", url: PAGE_URL, title: TITLE, description: OG_DESCRIPTION },
  twitter: { card: "summary" },
};

export const viewport: Viewport = { themeColor: "#1d74bf" };

/** Built from the same FAQS array as the visible accordion — they can't drift. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/** eFoli "View deal" → each app's Shopify App Store listing, UTM-tagged for BFCM. */
const offerCards: OfferCard[] = EFOLI_OFFERS.map((o) => {
  const app = appByKey(o.appKey);
  return { ...o, href: app ? appStoreHref(app, "bfcm_2026", "bfcm_page") : "/" };
});

const guideCount = 1 + GUIDE_GROUPS.reduce((n, g) => n + g.links.length, 0);

// Light header + dark footer, site CTA banner hidden (the page has its own CTAs).
export default function EfoliBfcm2026Page() {
  return (
    <SiteChrome darkFooter hideBanner>
      <main className={s.page}>
        <JsonLd data={faqJsonLd} />

        <div className={s.announce}>
          BFCM 2026 • {CAMPAIGN.discount}% off all eFoli apps • Ends {CAMPAIGN.endsLong.replace(", 2026", "")}
        </div>

        {/* HERO */}
        <section className={`${s.hero} ${s.center}`}>
          <div className={s.heroFloat} aria-hidden="true">
            {HERO_FLOAT.map((f, i) => (
              <Image
                key={i}
                src={f.src}
                alt=""
                width={f.size}
                height={f.size}
                className={[f.kind === "ef" ? s.floatEf : "", f.more ? s.floatMore : ""].join(" ").trim() || undefined}
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
            <span className={s.tag}>Black Friday 2026 • eFoli + partner exclusives</span>
            <h1>
              More ways to
              <br />
              <em>win BFCM.</em>
              <span className={s.dCount} role="img" aria-label={`${CAMPAIGN.discount} percent off every app`}>
                <b>
                  <HeroCount to={CAMPAIGN.discount} />%
                </b>
                <i>
                  OFF
                  <br />
                  every app
                </i>
              </span>
            </h1>
            <p className={s.heroLede}>
              Discover exclusive offers from <strong>eFoli and our Partners</strong>, built to help merchants sell
              more, operate smoothly, and keep growing long after the rush.
            </p>

            <nav className={s.appPills} aria-label="eFoli apps on offer">
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
                <CopyButton className={s.copyBtn} text={CAMPAIGN.code} label="Copy code" resetMs={2500} />
              </div>
              <a className={s.btn} href="#offers">
                Explore eFoli offers
              </a>
              <a className={`${s.btn} ${s.btnOutline}`} href="#partners">
                Browse partner deals
              </a>
            </div>
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
              <span className={s.tag}>eFoli campaign offers</span>
              <h2 className={s.secTitle}>
                <em>{CAMPAIGN.discount}% OFF</em> the Entire eFoli Lineup
              </h2>
              <p className={s.secCopy}>
                Choose the apps that match your next growth move, from larger wholesale orders and smarter pricing to
                bundles, quotes, and controlled operations.
              </p>
            </div>
            <AppOffers
              offers={offerCards}
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
                  alt="eFoli BFCM Partner 2026 badge"
                  width={170}
                  height={170}
                />
              </div>
              <div>
                <span className={s.tag}>Campaign partners</span>
                <h2 className={s.secTitle}>
                  Trusted Partners. <em>Exclusive BFCM Deals.</em>
                </h2>
                <p className={s.secCopy}>
                  Hand-picked Shopify apps from our Partners, each with its own BFCM offer, across marketing,
                  conversion, store operations, global selling, and reviews.
                </p>
              </div>
            </div>
            <PartnerDeals
              partners={PARTNERS}
              filters={PARTNER_FILTERS}
              categoryLabels={PARTNER_CATEGORY_LABELS}
              visibleCount={CAMPAIGN.partnersVisible}
            />
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
            <h2>Your Growth Window Is Open.</h2>
            <Countdown endsAt={CAMPAIGN.endsAt} />
            <p>
              The eFoli BFCM campaign closes on {CAMPAIGN.endsLong}. Get <b>{CAMPAIGN.discount}% OFF</b> every eFoli
              app with code <b>{CAMPAIGN.code}</b>.
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
              <p className={s.secCopy}>Everything you need before choosing the eFoli tools that fit your store.</p>
              <div className={s.faqFacts}>
                <span>Code {CAMPAIGN.code}</span>
                <span>{CAMPAIGN.discount}% off · 1 year</span>
                <span>Ends {CAMPAIGN.endsShort}</span>
              </div>
            </div>
            <div className={s.faqList}>
              <Faq items={FAQS} />
              <div className={s.faqHelp}>
                <Mail />
                <p>
                  Still have questions? Email <a href="mailto:info@efoli.com">info@efoli.com</a>.
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
              <p>Compare eFoli and partner offers, choose your tools, and build a stronger commerce experience.</p>
            </div>
            <a className={`${s.btn} ${s.btnLime}`} href="#offers">
              Explore all deals <ArrowRight />
            </a>
          </div>
          <p className={`${s.wrap} ${s.disclaimer}`}>All offer terms are subject to partner confirmation.</p>
        </section>
      </main>
    </SiteChrome>
  );
}
