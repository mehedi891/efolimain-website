import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound, redirect } from "next/navigation";
import SiteChrome from "@/components/SiteChrome";
import Singlepost from "@/components/blog/Singlepost";
import { getPostBySlug, getRelatedPosts } from "@/data/blogPosts";
import { stripHtml } from "@/lib/blog";

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const post = await getPostBySlug(slug, { preview: isEnabled });

  if (!post) {
    return { title: "Article not found | eFoli Blog" };
  }

  const title = post.metaTitle || post.title;
  const description =
    post.metaDescription ||
    post.excerpt ||
    stripHtml(post.content).slice(0, 160);
  const url = post.canonicalUrl || `https://efoli.com/blog/${post.slug}`;
  const image = post.ogImage || post.cover;

  // A draft preview must never be indexed — force noindex in preview mode.
  const noindex = isEnabled || post.noIndex;

  return {
    title: `${title} | eFoli Blog`,
    description,
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      type: "article",
      url,
      ...(image ? { images: [{ url: image }] } : {}),
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
      ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function BlogPostRoute({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;

  // Legacy WordPress year archive (/blog/2024/) — never a post slug.
  if (/^\d{4}$/.test(slug)) {
    redirect("/blog");
  }

  const { isEnabled } = await draftMode();
  const post = await getPostBySlug(slug, { preview: isEnabled });
  if (!post) {
    notFound();
  }

  const related = await getRelatedPosts(slug, 3);

  return (
    <SiteChrome preview={isEnabled}>
      <Singlepost post={post} related={related} />
    </SiteChrome>
  );
}
