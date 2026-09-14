/**
 * Copy-paste JSON-LD snippets shared by the structured-data and AI-visibility
 * checkers. Concrete examples with obvious placeholders the merchant swaps in.
 */

export const SNIPPET_PRODUCT = `<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Product name",
  "image": ["https://yourstore.com/image.jpg"],
  "description": "Short product description.",
  "brand": { "@type": "Brand", "name": "Your brand" },
  "sku": "SKU-123",
  "offers": {
    "@type": "Offer",
    "price": "29.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://yourstore.com/products/handle"
  }
}
</script>`;

export const SNIPPET_ORG = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Store",
  "url": "https://yourstore.com",
  "logo": "https://yourstore.com/logo.png",
  "sameAs": [
    "https://www.instagram.com/yourstore",
    "https://www.facebook.com/yourstore"
  ]
}
</script>`;

export const SNIPPET_WEBSITE = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Your Store",
  "url": "https://yourstore.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://yourstore.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>`;

export const SNIPPET_FAQ = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How long does shipping take?",
    "acceptedAnswer": { "@type": "Answer", "text": "Orders ship in 1–2 business days." }
  }]
}
</script>`;

export const SNIPPET_HOWTO = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to use this product",
  "step": [
    { "@type": "HowToStep", "text": "First step." },
    { "@type": "HowToStep", "text": "Second step." }
  ]
}
</script>`;

export const SNIPPET_BREADCRUMB = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yourstore.com" },
    { "@type": "ListItem", "position": 2, "name": "Collection", "item": "https://yourstore.com/collections/all" },
    { "@type": "ListItem", "position": 3, "name": "Product" }
  ]
}
</script>`;

/** Generic "where to paste JSON-LD in Shopify" steps. */
export const SHOPIFY_HOWTO = [
  "In your Shopify admin, open Online Store → Themes → Edit code.",
  "Open the relevant template (theme.liquid for site-wide schema, or the product section for product schema).",
  "Paste the JSON-LD <script> below and replace the placeholders with your real data (Liquid variables like {{ product.title }} work here).",
  "Save, then validate with Google's Rich Results Test (search.google.com/test/rich-results).",
];
