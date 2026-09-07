import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import Homepage from "@/components/home/Homepage";
import { getLatestPosts } from "@/data/blogPosts";

export const metadata: Metadata = {
  title: "B2B eCommerce Solutions & Shopify Apps | eFoli",
  description:
    "Scalable Shopify apps and B2B eCommerce solutions built for growth. Power your business with intuitive products, custom development, and 24/7 support.",
  alternates: { canonical: "https://efoli.com/" },
  openGraph: {
    title: "B2B eCommerce Solutions & Shopify Apps | eFoli",
    description:
      "Scalable Shopify apps and B2B eCommerce solutions built for growth. Power your business with intuitive products, custom development, and 24/7 support.",
    type: "website",
    url: "https://efoli.com/",
  },
};

// Refresh the CMS-driven latest-posts rail periodically (and on-demand via
// /api/revalidate, which calls revalidatePath("/")).
export const revalidate = 300;

// HOME uses the light header + light footer (see docs §4.1 matrix).
export default async function Home() {
  const posts = await getLatestPosts(3);
  return (
    <SiteChrome>
      <Homepage posts={posts} />
    </SiteChrome>
  );
}
