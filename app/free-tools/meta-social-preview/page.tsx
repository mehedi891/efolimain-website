import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import MetaToolClient from "./MetaToolClient";

const TITLE = "Free Meta & Social Preview Tool | Google + Social Cards — eFoli";
const DESCRIPTION =
  "See how any page looks in Google search and social shares (Facebook, X, LinkedIn). Check title, meta description, Open Graph & Twitter cards — with fixes.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://efoli.com/free-tools/meta-social-preview" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "https://efoli.com/free-tools/meta-social-preview" },
};

export default function Route() {
  return (
    <SiteChrome darkFooter hideBanner>
      <MetaToolClient />
    </SiteChrome>
  );
}
