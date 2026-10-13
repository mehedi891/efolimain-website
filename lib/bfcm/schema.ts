/**
 * JSON-LD for /bfcm-offers — built from the SAME data the page renders (eFoli
 * offers from code, partner deals from MongoDB), so structured data always
 * matches the visible cards (a Google requirement) and updates with admin edits.
 *
 * One @graph: Organization → CollectionPage → BreadcrumbList → ItemList of
 * Offers (each for a SoftwareApplication, with seller + validThrough) → FAQPage.
 * Offer @ids reuse the cards' page anchors (#multivariants, #p-outfy, …).
 *
 * No `price`: we don't publish real plan prices here, and inventing them would
 * violate structured-data guidelines. The discount + code go in `description`.
 */

import { APPS } from "@/data/apps";
import { CAMPAIGN, PAGE_URL } from "@/data/bfcmCampaign";
import type { EfoliOffer } from "@/data/bfcm2026";
import type { PublicPartner } from "./types";

const SITE = "https://efoli.com";
const ORG_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;

const abs = (u: string) => (/^https?:\/\//i.test(u) ? u : `${SITE}${u.startsWith("/") ? "" : "/"}${u}`);

function efoliOffer(o: EfoliOffer) {
  const app = APPS.find((a) => a.name === o.name);
  return {
    "@type": "Offer",
    "@id": `${PAGE_URL}#${o.id}`,
    name: `${o.name} — ${CAMPAIGN.discount}% off for one year`,
    description: `${o.blurb} BFCM 2026 deal: ${CAMPAIGN.discount}% off eligible plans for one year with code ${CAMPAIGN.code}, for new users and eligible free users. Ends ${CAMPAIGN.endsLong}.`,
    url: o.href,
    category: o.label,
    validThrough: CAMPAIGN.endsAt,
    seller: { "@id": ORG_ID },
    itemOffered: {
      "@type": "SoftwareApplication",
      name: o.name,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Shopify",
      description: o.blurb,
      image: abs(o.icon.src),
      ...(app ? { url: app.shopifyUrl, sameAs: app.url } : {}),
      publisher: { "@id": ORG_ID },
    },
  };
}

function partnerOffer(p: PublicPartner) {
  const how = p.code ? `Code ${p.code}.` : p.codeNote ? `${p.codeNote}.` : "";
  const developer = { "@type": "Organization", name: p.developer };
  return {
    "@type": "Offer",
    "@id": `${PAGE_URL}#p-${p.slug}`,
    name: `${p.name} — ${p.offerBadge}`,
    description: [p.description, `${p.terms}.`, how].filter(Boolean).join(" "),
    url: p.ctaUrl,
    category: p.categoryLabel,
    validThrough: `${p.validUntil}T23:59:59Z`,
    seller: developer,
    itemOffered: {
      "@type": "SoftwareApplication",
      name: p.name,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Shopify",
      ...(p.logoUrl ? { image: abs(p.logoUrl) } : {}),
      publisher: developer,
    },
  };
}

export function buildBfcmJsonLd({
  title,
  description,
  efoliOffers,
  partners,
  faqs,
}: {
  title: string;
  description: string;
  efoliOffers: EfoliOffer[];
  partners: PublicPartner[];
  faqs: { q: string; a: string }[];
}) {
  const offers = [...efoliOffers.map(efoliOffer), ...partners.map(partnerOffer)];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "EFOLI",
        url: `${SITE}/`,
        logo: { "@type": "ImageObject", url: `${SITE}/brand/logo.svg` },
      },
      { "@type": "WebSite", "@id": WEBSITE_ID, url: `${SITE}/`, name: "EFOLI", publisher: { "@id": ORG_ID } },
      {
        "@type": "CollectionPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: title,
        description,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORG_ID },
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
        mainEntity: { "@id": `${PAGE_URL}#offers` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "BFCM 2026 Offers", item: PAGE_URL },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${PAGE_URL}#offers`,
        name: "eFoli BFCM 2026 Shopify app deals",
        numberOfItems: offers.length,
        itemListElement: offers.map((item, i) => ({ "@type": "ListItem", position: i + 1, item })),
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
