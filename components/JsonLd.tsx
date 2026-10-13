/**
 * Renders a JSON-LD structured-data block. Server Component — safe to place
 * anywhere in a page's tree (Google reads JSON-LD from the body too).
 * `<` is escaped so data containing "</script>" (e.g. admin-entered text)
 * can't break out of the tag; parsers read < back as "<".
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
