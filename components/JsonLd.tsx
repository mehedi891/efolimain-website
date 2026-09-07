/**
 * Renders a JSON-LD structured-data block. Server Component — safe to place
 * anywhere in a page's tree (Google reads JSON-LD from the body too).
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
