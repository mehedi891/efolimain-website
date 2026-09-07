import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import Contactpage from "@/components/contact/Contactpage";
import JsonLd from "@/components/JsonLd";
import { contactJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Contact eFoli | Let’s Start Your Next Project",
  description:
    "Reach out to eFoli for Shopify development, app support, partnerships, or collaborations. Our team responds quickly and is ready to help you move forward.",
  alternates: { canonical: "https://efoli.com/contact-us" },
  openGraph: {
    title: "Contact eFoli | Let’s Start Your Next Project",
    description:
      "Reach out to eFoli for Shopify development, app support, partnerships, or collaborations. Our team responds quickly and is ready to help you move forward.",
    type: "website",
    url: "https://efoli.com/contact-us",
  },
};

// This page uses the black header + black footer (see docs §4.1 matrix).
export default function ContactRoute() {
  return (
    <SiteChrome darkHeader darkFooter>
      <JsonLd data={contactJsonLd} />
      <Contactpage />
    </SiteChrome>
  );
}
