import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import Offerpage from "@/components/offer/Offerpage";

export const metadata: Metadata = {
  title: "Special Offer | eFoli",
  description: "Limited-time offers on eFoli's Shopify apps and services.",
  alternates: { canonical: "https://efoli.com/offer" },
  openGraph: {
    title: "Special Offer | eFoli",
    description: "Limited-time offers on eFoli's Shopify apps and services.",
    type: "website",
    url: "https://efoli.com/offer",
  },
};

// OFFER = light header, black footer, CTA banner hidden (see docs §4.1 matrix).
export default function OfferRoute() {
  return (
    <SiteChrome darkFooter hideBanner>
      <Offerpage />
    </SiteChrome>
  );
}
