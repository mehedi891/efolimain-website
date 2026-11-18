import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import SiteChrome from "@/components/SiteChrome";
import LandingHtml from "@/components/LandingHtml";
import { getLandingPage } from "@/data/landingPages";

/**
 * CMS landing pages at the site root: https://efoli.com/<slug>.
 *
 * Static routes (/blog, /offer, /about-us, …) always win over this [slug]
 * segment, so a landing page can never shadow an existing page. Every other
 * one-segment URL lands here, which is why a missing page must call notFound().
 *
 * Header and footer come from the CMS switches (showHeader / showFooter); the
 * <head>, fonts, global CSS and analytics always come from app/layout.tsx.
 */

const SITE_URL = "https://efoli.com";

// ISR for every slug: rendered on first visit, then served from cache until
// the CMS calls /api/revalidate. Nothing is prerendered at build time.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const page = await getLandingPage(slug, { preview: isEnabled });
  if (!page) return {};

  const title = page.metaTitle || page.title;
  const description = page.metaDescription || undefined;
  const url = page.canonicalUrl || `${SITE_URL}/${page.slug}`;
  const image = page.ogImage;

  // A draft preview must never be indexed.
  const noindex = isEnabled || page.isPreview || page.noIndex;

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      type: "website",
      url,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function LandingPageRoute({
  params,
}: PageProps<"/[slug]">) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const page = await getLandingPage(slug, { preview: isEnabled });

  // This root [slug] catches every unknown URL — real 404s must stay 404s.
  if (!page) notFound();

  return (
    <SiteChrome
      preview={isEnabled}
      showHeader={page.showHeader}
      showFooter={page.showFooter}
    >
      {/* Full width, no prose/article wrapper: the page brings its own layout. */}
      <main>
        <LandingHtml html={page.content} />
      </main>
    </SiteChrome>
  );
}
