# Efoli CMS — Storefront API Reference

Everything a storefront needs to render content from the CMS.

- **Base URL:** `https://cms.efoli.com`
- **Auth:** none. All endpoints below are public and read-only.
- **Visibility:** only `PUBLISHED` content is ever returned. Drafts and scheduled items are invisible.
- **Method:** `GET` for everything except the contact form (`POST`).

### Site slugs 

Every endpoint requires a `site` query parameter:

| Slug | Site |
| --- | --- |
| `discountray` | DiscountRay |
| `efoli` | Efoli |
| `embedup` | EmbedUp |
| `multivariants` | Multivariants |
| `push-bundle` | Push Bundle |

### Errors

| Status | Body | Cause |
| --- | --- | --- |
| 400 | `{ "error": "site param required" }` | `site` missing |
| 404 | `{ "error": "Site not found" }` | Unknown site slug |
| 404 | `{ "error": "Post not found" }` | No published item with that slug |

---

## What you need to build

Pages, and where their data comes from:

| Page | Endpoint |
| --- | --- |
| Blog index (paginated) | `GET /api/public/posts` |
| Blog post | `GET /api/public/posts/{slug}` |
| Category / tag listing | `GET /api/public/posts?category=` or `?tag=` |
| Knowledge base index | `GET /api/public/docs` |
| Doc article | `GET /api/public/docs/{slug}` |
| FAQ page | `GET /api/public/faqs` |
| Case-study grid + detail | `GET /api/public/clients`, `/clients/{slug}` |
| Changelog timeline | `GET /api/public/changelogs` |
| Partners section | `GET /api/public/partners` |
| Testimonials | `GET /api/public/opinions` |
| Contact form | `GET /api/public/site-config` then `POST /api/public/contact` |

Two API routes you must implement on the storefront itself:

| Route | Why | Section |
| --- | --- | --- |
| `/api/revalidate` | **Required.** Without it the site serves stale content forever | On-demand revalidation |
| `/api/preview` | Optional. Lets editors view drafts before publishing | Draft preview |

Three environment variables — see Next.js implementation.

### Response shapes at a glance

Two patterns, and mixing them up is the usual first bug:

| Shape | Endpoints |
| --- | --- |
| Wrapper `{ items, total, page, limit, totalPages }` | posts, clients, changelogs |
| Wrapper `{ categories, uncategorized, total }` | docs, faqs |
| Plain ARRAY | partners, opinions |
| Single object | every `/{slug}` endpoint, site-config |

The array key matches the type: `posts`, `clients`, `changelogs`.

---

## Endpoint index

| Method | Endpoint | Returns |
| --- | --- | --- |
| GET | `/api/public/posts` | Paginated blog posts |
| GET | `/api/public/posts/{slug}` | One blog post (full HTML) |
| GET | `/api/public/docs` | Help doc categories + docs |
| GET | `/api/public/docs/{slug}` | One help doc |
| GET | `/api/public/faqs` | FAQ categories + questions |
| GET | `/api/public/clients` | Client showcase list |
| GET | `/api/public/clients/{slug}` | One client story |
| GET | `/api/public/changelogs` | Changelog entries |
| GET | `/api/public/changelogs/{slug}` | One changelog entry |
| GET | `/api/public/partners` | Partner list |
| GET | `/api/public/opinions` | Testimonials / opinions |
| GET | `/api/public/site-config` | hCaptcha config for the contact form |
| POST | `/api/public/contact` | Submit a contact form |

Ordering is stable and newest-first by default. A manual `order` field, where
the content type has one, always sorts before date. Editing an item never
reshuffles the list.

---

## Blog posts

### List

```
GET https://cms.efoli.com/api/public/posts?site=discountray&page=1&limit=10
```

| Param | Required | Description |
| --- | --- | --- |
| `site` | yes | Site slug |
| `page` | no | Page number, default `1` |
| `limit` | no | Per page, default `10`, max `100` |
| `category` | no | Filter by category slug |
| `tag` | no | Filter by tag slug |
| `locale` | no | `ja, fr, de, es, zh, it`. Omit for English. See Multi-language. |

```json
{
  "posts": [
    {
      "id": "clx1abc...",
      "title": "10 Best Shopify Product Variant Apps",
      "slug": "best-shopify-product-variant-apps",
      "excerpt": "Shopify gives you a product page...",
      "coverImage": "https://.../img.webp",
      "coverImageAlt": "Shopify variant apps comparison",
      "publishedAt": "2026-03-31T11:39:44.000Z",
      "readingTimeMinutes": 8,
      "author": { "name": "Mehedi Hasan", "avatarUrl": "https://..." },
      "categories": [{ "name": "Shopify Apps", "slug": "shopify-apps" }],
      "category": { "name": "Shopify Apps", "slug": "shopify-apps" },
      "tags": [{ "name": "Shopify", "slug": "shopify" }]
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable id — use as the React key |
| `title` | string | |
| `slug` | string | Same in every language |
| `excerpt` | string \| null | Short summary for cards |
| `coverImage` | string \| null | Full URL, already optimised |
| `coverImageAlt` | string \| null | Use as the `alt` attribute |
| `publishedAt` | ISO string \| null | Null on unpublished (preview only) |
| `readingTimeMinutes` | number \| null | |
| `author` | object | `{ name, avatarUrl }` — `bio` only on the single post |
| `categories` | array | `[{ name, slug }]`, can be empty |
| `category` | object \| null | First category. Legacy — prefer `categories` |
| `tags` | array | `[{ name, slug }]`, can be empty |

Anything marked nullable really can be null — guard before rendering.

### Single post

```
GET https://cms.efoli.com/api/public/posts/{slug}?site=discountray
```

Same as a list item plus `content` (full HTML), `metaTitle`, `metaDescription`,
`ogImage`, `canonicalUrl`, `noIndex`, `updatedAt`, and `author.bio`.

> **Rendering `content`:** it is raw HTML from the editor. Render with
> `dangerouslySetInnerHTML`. This content was migrated from WordPress sites that
> were previously compromised — sanitise it (e.g. `isomorphic-dompurify`) before
> rendering if that audit has not been completed.

---

## Multi-language

Blog posts can be published in seven languages. English is the base and needs no
`locale` parameter.

| Code | Language | English name | Storefront path |
| --- | --- | --- | --- |
| _(none)_ | English | English | `/blog/...` |
| `ja` | 日本語 | Japanese | `/ja/blog/...` |
| `fr` | Français | French | `/fr/blog/...` |
| `de` | Deutsch | German | `/de/blog/...` |
| `es` | Español | Spanish | `/es/blog/...` |
| `zh` | 简体中文 | Chinese (Simplified) | `/zh/blog/...` |
| `it` | Italiano | Italian | `/it/blog/...` |

### Fallback behaviour

A request with `?locale=ja` returns **every published post**. Posts translated
into Japanese come back in Japanese; the rest come back in English. Listings are
never short, and no URL 404s while translation is still in progress.

Two extra fields appear on each item (and `locale` on the list envelope):

| Field | Meaning |
| --- | --- |
| `locale` | The language requested |
| `isTranslated` | `true` = real translation · `false` = English fallback |

### What changes per language — and what does not

| Translated | Shared across all languages |
| --- | --- |
| title | slug (identical in every language) |
| excerpt | cover image + all inline images |
| content | categories and tags |
| metaTitle, metaDescription | author, publishedAt |
| coverImageAlt | readingTime is recalculated per language |

Because the slug never changes, a language switcher only has to swap the path
prefix.

### SEO rules — required

Fallback pages serve English text under a non-English URL. Without correct
canonical tags Google sees six duplicate copies of every article.

| `isTranslated` | `canonical` | Include in `hreflang`? |
| --- | --- | --- |
| `true` | its own URL | yes |
| `false` | the **English** URL | no |

Also emit `hreflang="x-default"` pointing at the English URL.

---

## Other content types

All English-only for now — a `locale` parameter is accepted but ignored.
Every endpoint needs `?site=<slug>`.

### Help docs

Docs grouped into categories, plus any that have no category. Use it to build
a knowledge-base index; fetch a single doc for the article page.

```
GET https://cms.efoli.com/api/public/docs?site=discountray
GET https://cms.efoli.com/api/public/docs?site=discountray&category=getting-started
GET https://cms.efoli.com/api/public/docs/{slug}?site=discountray
```

```json
{
  "categories": [
    {
      "id": "clx…", "name": "Getting Started", "slug": "getting-started",
      "description": "Set-up basics", "order": 0,
      "docs": [
        {
          "id": "clx…", "title": "Install the app", "slug": "install-the-app",
          "excerpt": "How to install…", "readingTimeMinutes": 3,
          "updatedAt": "2026-03-31T12:00:00.000Z"
        }
      ]
    }
  ],
  "uncategorized": [ /* same doc shape */ ],
  "total": 24
}
```

`?category=` returns that ONE category object (not the wrapper above), 404 if unknown.

Single doc adds `content` (HTML), `metaTitle`, `metaDescription`, a `category`
object, and `children` for sub-docs:

```json
{
  "id": "clx…", "title": "Install the app", "slug": "install-the-app",
  "content": "<p>Full HTML…</p>",
  "excerpt": "How to install…",
  "metaTitle": "Install | Docs", "metaDescription": "Step-by-step…",
  "readingTimeMinutes": 3,
  "updatedAt": "2026-03-31T12:00:00.000Z",
  "category": { "name": "Getting Started", "slug": "getting-started" },
  "children": [
    { "id": "clx…", "title": "Install on Shopify", "slug": "install-shopify", "excerpt": "…" }
  ]
}
```

### FAQs

Same category wrapper as docs. Answers are HTML.

```
GET https://cms.efoli.com/api/public/faqs?site=discountray
GET https://cms.efoli.com/api/public/faqs?site=discountray&category=billing
```

```json
{
  "categories": [
    {
      "id": "clx…", "name": "Billing", "slug": "billing", "description": null,
      "faqs": [
        { "id": "clx…", "question": "Can I cancel anytime?", "answer": "<p>Yes…</p>" }
      ]
    }
  ],
  "uncategorized": [ { "id": "clx…", "question": "…", "answer": "<p>…</p>" } ],
  "total": 18
}
```

Good candidate for `FAQPage` structured data on the page that renders it.

### Clients (case studies)

```
GET https://cms.efoli.com/api/public/clients?site=discountray&page=1&limit=12
GET https://cms.efoli.com/api/public/clients/{slug}?site=discountray
```

```json
{
  "clients": [
    {
      "id": "clx…", "title": "Keystone Meats", "slug": "keystone-meats",
      "excerpt": "How Keystone cut order errors…",
      "coverImage": "https://…/cover.webp", "coverImageAlt": "Keystone storefront",
      "logoUrl": "https://…/logo.webp",
      "link": "https://keystonemeats.com",
      "publishedAt": "2026-03-31T11:39:44.000Z",
      "readingTimeMinutes": 6,
      "author": { "name": "Mehedi Hasan", "avatarUrl": "https://…" }
    }
  ],
  "total": 14, "page": 1, "limit": 12, "totalPages": 2
}
```

Single client adds `content` (HTML), `metaTitle`, `metaDescription`, `ogImage`,
`canonicalUrl`, `noIndex` and `updatedAt`.

`logoUrl` is the brand mark for the grid; `coverImage` is the hero on the
detail page; `link` is the customer's own site. Any of them can be null.

### Changelog

```
GET https://cms.efoli.com/api/public/changelogs?site=discountray&page=1&limit=20
GET https://cms.efoli.com/api/public/changelogs/{slug}?site=discountray
```

```json
{
  "changelogs": [
    {
      "id": "clx…", "title": "Bulk pricing rules", "slug": "bulk-pricing-rules",
      "content": "<p>What changed…</p>",
      "version": "2.4.0",
      "label": { "name": "New", "color": "#22c55e" },
      "publishedAt": "2026-03-31T11:39:44.000Z"
    }
  ],
  "total": 31, "page": 1, "limit": 20, "totalPages": 2
}
```

`label.color` is a hex value — use it directly for the badge background.
`version` and `label` may be null. The list already includes `content`, so a
timeline page needs no per-entry request.

### Partners

```
GET https://cms.efoli.com/api/public/partners?site=discountray
```

Returns a plain ARRAY, not a wrapper object:

```json
[
  {
    "id": "clx…",
    "title": "Shopify Plus",
    "description": "Enterprise commerce platform…",
    "logoUrl": "https://…/logo.webp",
    "link": "https://shopify.com/plus"
  }
]
```

### Opinions (testimonials)

```
GET https://cms.efoli.com/api/public/opinions?site=discountray
```

Also a plain ARRAY. `description` is plain text, not HTML:

```json
[
  {
    "id": "clx…",
    "title": "Cut our support tickets in half",
    "description": "Since switching we have seen…",
    "logoUrl": "https://…/logo.webp"
  }
]
```

### Site config

```
GET https://cms.efoli.com/api/public/site-config?site=discountray
```

```json
{ "hcaptchaSiteKey": "10000000-ffff-…", "hcaptchaEnabled": true }
```

This endpoint is ONLY for the contact form — it does not return site name,
logo or SEO defaults. Call it before rendering the form: when
`hcaptchaEnabled` is true you must render an hCaptcha widget with
`hcaptchaSiteKey` and send the resulting token, or the submission is rejected.
The secret key is never exposed.

### Contact form

```
POST https://cms.efoli.com/api/public/contact
```

| Field | Required | Notes |
| --- | --- | --- |
| `site` | yes | Site slug |
| `name` | yes | Max 200 chars |
| `email` | yes | Format-validated |
| `message` | yes | Max 5000 chars |
| `subject` | no | Max 300 chars |
| `hcaptchaToken` | conditional | Required when `hcaptchaEnabled` is true |

```json
{
  "site": "discountray",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Pricing question",
  "message": "Do you offer annual billing?",
  "hcaptchaToken": "P0_eyJ0eXAiOiJKV1Qi…"
}
```

Errors come back as `{ "error": "…" }` with a 400: `name, email, and message
are required`, `Invalid email format`, `hCaptcha verification required`,
`hCaptcha verification failed`.

---

## Next.js implementation

### Environment

```bash
NEXT_PUBLIC_CMS_URL=https://cms.efoli.com
CMS_SITE_SLUG=discountray
REVALIDATE_SECRET=<same value as in the CMS>
PREVIEW_SECRET=<same value as in the CMS>
```

### Fetch helper

```ts
// lib/cms.ts
const CMS = process.env.NEXT_PUBLIC_CMS_URL!
const SITE = process.env.CMS_SITE_SLUG!

export async function cms<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const qs = new URLSearchParams({ site: SITE })
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v))
  }

  const res = await fetch(`${CMS}${path}?${qs}`, {
    // Cache indefinitely; the CMS pushes updates via on-demand revalidation.
    next: { revalidate: false, tags: ["cms"] },
  })
  if (!res.ok) throw new Error(`CMS ${res.status} on ${path}`)
  return res.json()
}
```

### Blog list (localised route)

```ts
// app/[locale]/blog/page.tsx      (use app/blog/page.tsx for English)
import { cms } from "@/lib/cms"

export default async function BlogIndex({
  params, searchParams,
}: { params: { locale?: string }; searchParams: { page?: string } }) {
  const data = await cms<{ posts: any[]; totalPages: number }>("/api/public/posts", {
    page: searchParams.page ?? 1,
    limit: 12,
    locale: params.locale,   // undefined on the English route
  })

  return (
    <ul>
      {data.posts.map((p) => (
        <li key={p.id}>
          <a href={params.locale ? `/${params.locale}/blog/${p.slug}` : `/blog/${p.slug}`}>
            {p.title}
          </a>
        </li>
      ))}
    </ul>
  )
}
```

### Post page with correct canonical + hreflang

This is the part that protects your SEO — do not simplify it away.

```ts
// app/[locale]/blog/[slug]/page.tsx
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cms } from "@/lib/cms"

const SITE_URL = "https://www.pushbundle.com"
const LOCALES = ["ja", "fr", "de", "es", "zh", "it"]

const pathFor = (locale: string | undefined, slug: string) =>
  locale ? `${SITE_URL}/${locale}/blog/${slug}` : `${SITE_URL}/blog/${slug}`

async function getPost(slug: string, locale?: string) {
  try {
    return await cms<any>(`/api/public/posts/${slug}`, { locale })
  } catch {
    return null
  }
}

export async function generateMetadata(
  { params }: { params: { locale?: string; slug: string } },
): Promise<Metadata> {
  const post = await getPost(params.slug, params.locale)
  if (!post) return {}

  // Fallback pages (English text under /ja/, /fr/, ...) must canonical back to
  // English, or Google counts them as duplicate content.
  const canonical = post.isTranslated
    ? pathFor(params.locale, post.slug)
    : pathFor(undefined, post.slug)

  // Only advertise languages that are genuinely translated.
  const languages: Record<string, string> = { "x-default": pathFor(undefined, post.slug) }
  for (const code of LOCALES) {
    const alt = await getPost(params.slug, code)
    if (alt?.isTranslated) languages[code] = pathFor(code, post.slug)
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical, languages },
    robots: post.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.ogImage || post.coverImage ? [post.ogImage || post.coverImage] : [],
      type: "article",
      publishedTime: post.publishedAt,
    },
  }
}

export default async function PostPage(
  { params }: { params: { locale?: string; slug: string } },
) {
  const post = await getPost(params.slug, params.locale)
  if (!post) notFound()

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
```

> The per-language lookup in `generateMetadata` costs one request per locale.
> It runs at build/revalidate time, not per visitor. If you would rather avoid
> it, ask for `availableLocales` to be added to the single-post response.

---

## On-demand revalidation (required)

The CMS calls this endpoint whenever content changes, so edits appear within
seconds without a redeploy. **Without it, the storefront serves stale content
indefinitely** (the fetch helper above caches forever by design).

```ts
// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(req: NextRequest) {
  if (req.headers.get("x-revalidate-token") !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { path } = await req.json()
  if (!path) return NextResponse.json({ error: "path required" }, { status: 400 })

  revalidatePath(path)
  return NextResponse.json({ revalidated: true, path })
}
```

Set `REVALIDATE_SECRET` to the same value on the CMS and on every storefront.

Paths the CMS sends for a blog post change:

```
/                    /blog                    /blog/{slug}
/ja                  /ja/blog                 /ja/blog/{slug}      (per language)
```

Other types use `/academy` (docs), `/clients-showcase`, `/changelog`,
`/partners`, `/faq` and `/opinions`.

### How this site implements it — `src/app/api/revalidate/route.ts`

Two differences from the sample above, both necessary:

1. **It fails closed.** With `REVALIDATE_SECRET` unset the sample compares the
   header against `undefined`, so a request with no token at all authenticates.
   Ours returns 503 and refuses to run.

2. **It maps the CMS's section path to a cache TAG as well as revalidating the
   path.** Two of the paths above do not exist on this site:

   | CMS sends | This site | Tag revalidated |
   | --- | --- | --- |
   | `/opinions` | no such page — reviews render on `/` | `cms:opinions` |
   | `/academy` | help docs live at `/docs` | `cms:docs` |
   | `/blog`, `/blog/{slug}`, `/` | as sent | `cms:blog` |
   | `/partners` | as sent | `cms:partners` |
   | `/changelog` | as sent | `cms:changelog` |

   Without the mapping, `revalidatePath('/opinions')` invalidates nothing we
   serve and the reviews rail keeps whatever it fetched first — the fetch helper
   caches with `revalidate: false`, so "first" means forever. Verified: a local
   build served an empty reviews section long after the CMS had nine of them.

   `/clients-showcase` and `/faq` are ignored: this site consumes neither
   collection from the CMS.

---

## Draft preview

Lets an editor open an unpublished post on the real site — real header, real
CSS, real layout — before publishing it. Uses Next.js draft mode.

```
CMS editor              storefront                        CMS API
[Preview on site] ────► /api/preview?secret=…&slug=…
                        draftMode().enable()
                        redirect -> /blog/my-post
                              │
                              └── fetch + x-preview-token ──► returns DRAFT
                        renders the page + "Preview mode" banner
```

The CMS half already exists. Three small files are needed on each storefront.

### 1. Enter preview

```ts
// app/api/preview/route.ts
import { draftMode } from "next/headers"
import { redirect } from "next/navigation"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== process.env.PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 })
  }

  const slug = searchParams.get("slug")
  if (!slug) return new Response("slug required", { status: 400 })

  draftMode().enable()
  const locale = searchParams.get("locale")
  redirect(locale ? `/${locale}/blog/${slug}` : `/blog/${slug}`)
}
```

### 2. Exit preview

```ts
// app/api/preview/exit/route.ts
import { draftMode } from "next/headers"
import { redirect } from "next/navigation"

export async function GET() {
  draftMode().disable()
  redirect("/")
}
```

### 3. Make the fetch helper draft-aware

Replace the fetch in `lib/cms.ts` with this version. In draft mode it forwards
the token and disables caching so every reload shows the newest draft.

```ts
import { draftMode } from "next/headers"

export async function cms<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const qs = new URLSearchParams({ site: SITE })
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v))
  }

  const { isEnabled } = draftMode()

  const res = await fetch(`${CMS}${path}?${qs}`, {
    headers: isEnabled ? { "x-preview-token": process.env.PREVIEW_SECRET! } : {},
    cache: isEnabled ? "no-store" : undefined,
    next: isEnabled ? undefined : { revalidate: false, tags: ["cms"] },
  })
  if (!res.ok) throw new Error(`CMS ${res.status} on ${path}`)
  return res.json()
}
```

### 4. Preview banner

A draft must never be mistaken for the live page.

```tsx
// in app/layout.tsx
import { draftMode } from "next/headers"

export default function RootLayout({ children }) {
  const { isEnabled } = draftMode()
  return (
    <html>
      <body>
        {isEnabled && (
          <div style={{ background: "#b45309", color: "#fff", padding: "8px 16px" }}>
            Preview mode — showing unpublished content.{" "}
            <a href="/api/preview/exit" style={{ textDecoration: "underline" }}>Exit</a>
          </div>
        )}
        {children}
      </body>
    </html>
  )
}
```

Also mark preview pages `noindex`:

```ts
const { isEnabled } = draftMode()
return { robots: isEnabled ? { index: false, follow: false } : undefined }
```

### Preview response fields

| Field | Meaning |
| --- | --- |
| `isPreview` | Always `true` when the token was accepted |
| `status` | `DRAFT` · `PUBLISHED` · `SCHEDULED` · `ARCHIVED` |

### Rules

- The token unlocks **every unpublished draft on every site** — keep it server-side only, never in client JavaScript.
- Send it as a **header**, not a query string; query strings land in access logs, browser history and `Referer` headers.
- Preview responses must be `noindex` and uncached.
- Only the single-post endpoint supports preview. Listings always return published content, so a draft never appears in `/api/public/posts`.
- Draft **translations** work too: `?locale=ja` with the token returns an unpublished Japanese version.

---

## Go-live checklist

- [ ] `NEXT_PUBLIC_CMS_URL`, `CMS_SITE_SLUG`, `REVALIDATE_SECRET` set
- [ ] `/api/revalidate` deployed and returning 401 without the token
- [ ] An edit in the CMS appears on the storefront within seconds
- [ ] Only published content is visible; drafts never appear
- [ ] List order is stable — editing an item does not move it
- [ ] `content` HTML sanitised before rendering
- [ ] **i18n:** fallback pages canonical to English; `hreflang` only lists real translations
- [ ] **i18n:** slugs identical across languages, only the prefix differs
- [ ] **Preview:** `/api/preview` returns 401 without the secret
- [ ] **Preview:** the banner shows, and Exit returns you to the published page
- [ ] **Preview:** preview pages are `noindex`; a draft is never publicly reachable

---

_Generated from https://cms.efoli.com/api-docs_
