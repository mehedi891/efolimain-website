import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import AuditTool from "./AuditTool";

const TITLE = "Free Shopify Store Audit | Speed, SEO & BFCM Readiness — eFoli";
const DESCRIPTION =
  "Paste your Shopify store URL and get a free, instant audit of speed, mobile, SEO, conversion, apps, and Black Friday readiness — with prioritized fixes. Full report emailed.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://efoli.com/free-tools/shopify-store-audit" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://efoli.com/free-tools/shopify-store-audit",
  },
};

// Light header + dark footer, CTA banner hidden (the tool has its own CTA).
export default function ShopifyStoreAuditRoute() {
  return (
    <SiteChrome darkFooter hideBanner>
      <AuditTool />
    </SiteChrome>
  );
}
