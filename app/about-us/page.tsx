import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import Aboutpage from "@/components/about/Aboutpage";
import JsonLd from "@/components/JsonLd";
import { aboutJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "About eFoli | Global B2B eCommerce Innovators",
  description:
    "Discover eFoli’s 15+ year journey in building Shopify apps, SaaS products, and digital solutions that help global businesses scale with innovation and reliability.",
  alternates: { canonical: "https://efoli.com/about-us" },
  openGraph: {
    title: "About eFoli | Global B2B eCommerce Innovators",
    description:
      "Discover eFoli’s 15+ year journey in building Shopify apps, SaaS products, and digital solutions that help global businesses scale with innovation and reliability.",
    type: "website",
    url: "https://efoli.com/about-us",
  },
};

// This page uses the black header + black footer (see docs §4.1 matrix).
export default function AboutRoute() {
  return (
    <SiteChrome darkHeader darkFooter>
      <JsonLd data={aboutJsonLd} />
      <Aboutpage />
    </SiteChrome>
  );
}
