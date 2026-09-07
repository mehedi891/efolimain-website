import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import Affiliatepage from "@/components/affiliate/Affiliatepage";
import JsonLd from "@/components/JsonLd";
import { config, faqs } from "@/data/affiliateContent";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const title = "Affiliate & Partner Program | Earn Recurring Revenue with eFoli";
const description = `Refer merchants to eFoli's Shopify apps and earn up to ${config.topRate}% recurring commission on every subscription — paid monthly, for as long as they stay subscribed.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://efoli.com/affiliate" },
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://efoli.com/affiliate",
  },
  twitter: {
    card: "summary_large_image",
  },
};

// This page uses the light header + light footer.
export default function AffiliateRoute() {
  return (
    <SiteChrome>
      <JsonLd data={faqJsonLd} />
      <Affiliatepage />
    </SiteChrome>
  );
}
