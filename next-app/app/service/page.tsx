import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import Servicepage from "@/components/service/Servicepage";

export const metadata: Metadata = {
  title: "Shopify App Development & Support Services | eFoli",
  description:
    "From Shopify app development to white-label support, we deliver end-to-end solutions that help businesses launch faster, perform better, and scale globally.",
  alternates: { canonical: "https://efoli.com/service" },
  openGraph: {
    title: "Shopify App Development & Support Services | eFoli",
    description:
      "From Shopify app development to white-label support, we deliver end-to-end solutions that help businesses launch faster, perform better, and scale globally.",
    type: "website",
    url: "https://efoli.com/service",
  },
};

// SERVICE uses black header + black footer + hidden CTA banner (see docs §4.1 matrix).
export default function ServiceRoute() {
  return (
    <SiteChrome darkHeader darkFooter hideBanner>
      <Servicepage />
    </SiteChrome>
  );
}
