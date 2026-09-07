import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import Affiliatepage from "@/components/affiliate/Affiliatepage";
import { config } from "@/data/affiliateContent";

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
      <Affiliatepage />
    </SiteChrome>
  );
}
