import { redirect, useLoaderData } from "react-router";
import Singlepost from "../component/blogpage/Singlepost";
import { getPostBySlug, getRelatedPosts } from "../data/blogPosts";
import { stripHtml } from "../utils/blog";

export const loader = async ({ params }) => {
  // Legacy WordPress year archive (/blog/2024/) — never a post slug.
  if (/^\d{4}$/.test(params.slug)) {
    throw redirect("/blog", 301);
  }

  const post = await getPostBySlug(params.slug);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  const related = await getRelatedPosts(params.slug, 3);
  return { post, related };
};

export function meta({ data }) {
  const post = data?.post;
  if (!post) {
    return [{ title: "Article not found | eFoli Blog" }];
  }

  const title = post.metaTitle || post.title;
  const description =
    post.metaDescription ||
    post.excerpt ||
    stripHtml(post.content).slice(0, 160);
  const url = post.canonicalUrl || `https://efoli.com/blog/${post.slug}`;
  const image = post.ogImage || post.cover;

  return [
    { title: `${title} | eFoli Blog` },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    ...(post.noIndex ? [{ name: "robots", content: "noindex, nofollow" }] : []),

    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: url },
    ...(image ? [{ property: "og:image", content: image }] : []),
    ...(post.publishedAt
      ? [{ property: "article:published_time", content: post.publishedAt }]
      : []),
    ...(post.updatedAt
      ? [{ property: "article:modified_time", content: post.updatedAt }]
      : []),

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    ...(image ? [{ name: "twitter:image", content: image }] : []),

    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description,
        ...(image ? { image } : {}),
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: { "@type": "Person", name: post.author?.name || "eFoli" },
        publisher: {
          "@type": "Organization",
          name: "EFOLI",
          logo: {
            "@type": "ImageObject",
            url: "https://efoli.com/assets/logo-qfFYDzw2.svg",
          },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
    },
  ];
}

export default function BlogPost() {
  const { post, related } = useLoaderData();
  return <Singlepost post={post} related={related} />;
}
