import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import SchemaToolClient from "./SchemaToolClient";

const TITLE = "Free Structured Data / Rich Results Checker — eFoli";
const DESCRIPTION =
  "Check your Shopify JSON-LD structured data (Product, Organization, Breadcrumb) and find missing fields that block Google rich results.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://efoli.com/free-tools/structured-data-checker" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "https://efoli.com/free-tools/structured-data-checker" },
};

export default function Route() {
  return (
    <SiteChrome darkFooter hideBanner>
      <SchemaToolClient />
    </SiteChrome>
  );
}
