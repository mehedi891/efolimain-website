# Migration Plan: React Router 7 → Next.js

**Status:** Planning / assessment. Nothing migrated yet.
**Date:** 2026-09-07
**Author:** Engineering

This document maps the current React Router 7 (framework mode, SSR) app onto
Next.js, file by file and concept by concept, and calls out the limitations and
risks before any code is written. Read it end to end before starting — the
biggest cost isn't the routes, it's the Server/Client Component boundary.

---

## 1. Recommendation up front

- **Target: Next.js (latest) App Router**, not Pages Router. The App Router is
  the current, supported model, and — importantly — the CMS integration in
  [`docs/cms.md`](cms.md) is already written for Next.js (`draftMode()`,
  `revalidatePath()`, `revalidateTag()`). Migrating to App Router *deletes* the
  custom preview-cookie and revalidation shims we wrote to fake those APIs.
- **Effort: medium-to-large.** ~22 routes, 71 JS/JSX files, ~84 static asset
  imports, 16 files using `framer-motion`/`motion`. The routing, data, and SEO
  parts are mechanical. The real work is deciding the **`"use client"`
  boundary** and replacing the `handle` + `useMatches` layout system, which has
  **no direct Next equivalent**.
- **Deployment: Vercel (decided).** We drop the self-hosted Node/Docker setup
  (`react-router-serve`, port 4004, [`Dockerfile`](../Dockerfile)) entirely.
  Vercel builds and hosts Next natively — no Dockerfile, no `next start`, no
  standalone output. This is the ideal host for this app: on-demand
  revalidation, ISR, `draftMode()` preview, image optimization, and Edge
  middleware are all first-class and zero-config. See §6a for the Vercel-specific
  setup.

---

## 2. Current architecture (what we're migrating from)

| Concern | Current implementation |
|---|---|
| Framework | React Router 7 "framework mode", `ssr: true` ([`react-router.config.js`](../react-router.config.js)) |
| Bundler | Vite 6 + `@react-router/dev` + `@tailwindcss/vite` ([`vite.config.js`](../vite.config.js)) |
| Routing | **Config-based** in [`app/routes.js`](../app/routes.js) (not file-based) |
| Server entry | `@react-router/serve ./build/server/index.js`, port 4004 |
| Container | [`Dockerfile`](../Dockerfile) — `node:20-alpine`, multi-stage |
| Data loading | `loader` exports (SSR fetch) on 6 routes |
| Mutations | One `action` (contact form) in [`app/routes/contact.jsx`](../app/routes/contact.jsx) — nodemailer + hCaptcha |
| SEO | `meta` exports (title/description/OG) + `"script:ld+json"` for JSON-LD |
| Per-route layout flags | `handle = { darkFooter, darkHeader, isBannerHide, isHeaderBgTransparent }` read via `useMatches` in [`app/layouts/layout.jsx`](../app/layouts/layout.jsx) |
| Global head | `links` export (Google Fonts) + GA in [`app/root.jsx`](../app/root.jsx) |
| URL hygiene | Root `loader` 301-canonicalizes trailing slashes; skips legacy blog paths |
| Cookies | `createCookie` in [`app/utils/preview.server.js`](../app/utils/preview.server.js) |
| Response routes | `sitemap.xml`, `api/revalidate`, `api/preview`, `api/preview/exit`, 11 legacy-redirect matchers |
| Styling | Tailwind CSS v4 (`@theme` in [`app/app.css`](../app/app.css)) |
| Animation | `framer-motion` (6 files) + `motion/react` (10 files) |
| Forms | `react-hook-form` + `@hcaptcha/react-hcaptcha` + `useFetcher` ([`app/component/Form/Form.jsx`](../app/component/Form/Form.jsx)) |
| Data seams | [`app/data/blogPosts.js`](../app/data/blogPosts.js), [`jobs.js`](../app/data/jobs.js), [`affiliateContent.js`](../app/data/affiliateContent.js) — server-only, read `process.env` |

**Client hooks in use (drive the `"use client"` decision):** `useLoaderData`
(10), `useNavigation` (14), `NavLink` (5), `useSearchParams` (2), `useMatches`
(2), `useLocation` (2), `useFetcher` (2). `<Link>` appears 63 times.

---

## 3. Route-by-route mapping

Config routes in `app/routes.js` become the Next `app/` file tree. All internal
paths (`/about-us`, `/contact-us`, etc.) are preserved exactly — **no public URL
changes**, which is critical for SEO.

| Current route (`app/routes.js`) | File | Next.js target |
|---|---|---|
| `index` | `routes/home.jsx` | `app/page.jsx` (Server Component; fetches latest posts) |
| `about-us` | `routes/about.jsx` | `app/about-us/page.jsx` |
| `career` | `routes/career.jsx` | `app/career/page.jsx` (fetches jobs) |
| `contact-us` | `routes/contact.jsx` | `app/contact-us/page.jsx` + Server Action (or `app/contact-us/route` handler) for the POST |
| `service` | `routes/service.jsx` | `app/service/page.jsx` |
| `offer` | `routes/offer.jsx` | `app/offer/page.jsx` |
| `affiliate` | `routes/affiliate.jsx` | `app/affiliate/page.jsx` |
| `blog` | `routes/blog.jsx` | `app/blog/page.jsx` (reads `searchParams` for page/category/tag/q) |
| `blog/:slug` | `routes/blogPost.jsx` | `app/blog/[slug]/page.jsx` (`generateMetadata`, `draftMode()`) |
| `sitemap.xml` | `routes/sitemap[.xml].jsx` | `app/sitemap.js` (native) **or** `app/sitemap.xml/route.js` |
| `api/revalidate` | `routes/apiRevalidate.jsx` | `app/api/revalidate/route.js` (`POST`) |
| `api/preview` | `routes/apiPreview.jsx` | `app/api/preview/route.js` → `draftMode().enable()` |
| `api/preview/exit` | `routes/apiPreviewExit.jsx` | `app/api/preview/exit/route.js` → `draftMode().disable()` |
| `*` (catch-all) | `routes/404.jsx` | `app/not-found.jsx` |
| 11 `blog/…` legacy matchers | `routes/blogLegacyRedirect.jsx` | Consolidate into **`proxy.ts`** (Next 16's renamed middleware) and/or `next.config` `redirects()` (see §5) |

### Layout tree
- [`app/root.jsx`](../app/root.jsx) `Layout` (the `<html><body>` shell, fonts,
  GA) → **`app/layout.jsx`** (root layout).
- [`app/layouts/layout.jsx`](../app/layouts/layout.jsx) (Navbar + Footer +
  preview banner) → a shared layout. **But** it currently branches on per-route
  `handle` flags via `useMatches`, which Next doesn't support — see §4.1.

---

## 4. Concept-by-concept mapping

### 4.1 Black header/footer per page — `handle` + `useMatches` (the hard one) ⚠️
This is the **dark Navbar/Footer on certain pages**. Today each route can export
`handle = { darkFooter, darkHeader, isBannerHide, isHeaderBgTransparent }`, and
[`layout.jsx`](../app/layouts/layout.jsx) reads all matched handles with
`useMatches` to theme the shared Navbar/Footer (black vs white, hide the CTA
banner, transparent header). **Next.js has no `handle` or `useMatches`** — this
per-route→shared-layout signaling has to be rebuilt.

**Exact current matrix (must be preserved 1:1):**

| Page | darkHeader | darkFooter | isBannerHide | Effect |
|---|---|---|---|---|
| `/` home | — | — | — | Light header, light footer, CTA banner shown |
| `/about-us` | ✅ | ✅ | — | **Black header + black footer** |
| `/contact-us` | ✅ | ✅ | — | **Black header + black footer** |
| `/service` | ✅ | ✅ | ✅ | **Black header + black footer**, no CTA banner |
| `/offer` | — | ✅ | ✅ | Light header, **black footer**, no CTA banner |
| `/career` | — | ✅ | — | Light header, **black footer** |
| `/affiliate`, `/blog`, `/blog/[slug]` | — | — | — | Light (default) |

`isHeaderBgTransparent` is plumbed through the layout but **no route sets it**
today — safe to drop unless you want it later.

**Next.js has no `handle` or `useMatches`.** Options, best first:

1. **Move Navbar/Footer out of a single shared layout and let each page
   compose them** with explicit props (`<Navbar dark />`). Most explicit, most
   verbose. A small `<SiteChrome dark hideBanner>` wrapper component keeps it
   tidy.
2. **Route groups with distinct layouts** — e.g. `app/(dark)/layout.jsx` vs
   `app/(light)/layout.jsx`. Clean, but the current flags are a 4-boolean matrix
   (dark header ≠ dark footer ≠ banner-hidden), so you'd need several groups and
   pages would be sorted into them.
3. **Client context set per page** — a `<ChromeConfig dark />` client component
   at the top of each page writing to context the Navbar/Footer read. Closest to
   the current runtime behavior; adds a client boundary.

**Recommendation:** option 1 (explicit props via a `SiteChrome` wrapper). It's
the least magic and the flag matrix is small and static per page.

**Is the color per-page or per-browser?** Per **page**, and fully deterministic.
The dark/light chrome is decided by the route, rendered on the **server**, and
baked into the HTML — so `/contact-us` arrives black in every browser (Chrome,
Safari, Firefox, incognito, first visit, any device), with **no flash of the
wrong color** and **no dependence on cookies or `localStorage`**. It is *not* a
user theme preference that could differ between browsers. This is precisely why
option 1 (a Server Component reading a static prop) is preferred over option 3
(client context): option 1 needs zero client JavaScript to get the color right,
so there's never a light→dark flicker on load. (Option 3 also works but resolves
the color on the client, risking a brief flash.)

### 4.2 `loader` → Server Components / data functions
Loaders become plain `async` Server Components that call the existing data
seams directly. The seams ([`blogPosts.js`](../app/data/blogPosts.js),
[`jobs.js`](../app/data/jobs.js)) need **no changes** — they're framework-
agnostic `fetch` + `process.env`. Example:

```jsx
// app/career/page.jsx
import { getOpenJobs } from "@/data/jobs";
export default async function CareerPage() {
  const jobs = await getOpenJobs();
  return <Careerpage jobs={jobs} />;
}
```

- Blog listing reads filters from the `searchParams` prop instead of
  `useSearchParams` in the loader.
- Caching: today the seams do their own in-memory TTL cache. Under Next we can
  keep that, or move to `fetch(..., { next: { revalidate, tags } })` +
  `revalidateTag` so on-demand revalidation becomes native (see §4.7).

### 4.3 `action` (contact form) → Server Action or Route Handler
The contact `action` (formData → hCaptcha verify → nodemailer) becomes either:
- a **Server Action** (`"use server"`) called from the form, or
- a **Route Handler** `app/api/contact/route.js` that the client `fetch`es.

`nodemailer` needs the **Node.js runtime** (not Edge) — fine for both. The
client [`Form.jsx`](../app/component/Form/Form.jsx) uses `useFetcher` +
`react-hook-form`; migrate `fetcher.submit(...)` to `useActionState` (Server
Action) or a `fetch` to the route handler. `react-hook-form` and hCaptcha stay
as-is (client-side).

### 4.4 `meta` → `metadata` / `generateMetadata`
Static `meta()` → `export const metadata`. Data-dependent titles (blog
list/post) → `export async function generateMetadata({ params, searchParams })`.
The `"script:ld+json"` trick in RR meta has no metadata-API equivalent — render
JSON-LD as an explicit tag in the Server Component:

```jsx
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
```

`robots`/canonical/OG all map cleanly onto the `metadata` object
(`alternates.canonical`, `robots`, `openGraph`).

### 4.5 Fonts + GA (`links` / root scripts)
- Google Fonts → `next/font/google` (Inter, Red Hat Display) — self-hosts the
  fonts and removes the render-blocking `<link>`s. Or keep the `<link>`s in
  `app/layout.jsx` head.
- GA → `@next/third-parties/google` (`<GoogleAnalytics gaId>`), plus a small
  client component using `usePathname`/`useSearchParams` for SPA pageviews,
  replacing the `useLocation` effect in `root.jsx`.

### 4.6 Trailing-slash canonicalization
Root loader 301s `/x/` → `/x`. Next does this natively with
`trailingSlash: false` (the default) — it auto-redirects the slash form.
**Caveat:** Next emits **308** (permanent redirect), not 301. Google treats 308
== 301, so SEO is unaffected, but if an exact 301 is required, use `proxy.ts`
returning `NextResponse.redirect(url, 301)`.

### 4.7 Preview + revalidation (this gets *simpler*)
The custom shims exist only because RR lacks these APIs. Next has them natively,
and [`docs/cms.md`](cms.md) is already written against them:
- [`preview.server.js`](../app/utils/preview.server.js) `createCookie` +
  `isPreviewRequest` → **`draftMode()`** from `next/headers`. Delete the file.
- [`apiPreview.jsx`](../app/routes/apiPreview.jsx) /
  [`apiPreviewExit.jsx`](../app/routes/apiPreviewExit.jsx) → route handlers
  calling `draftMode().enable()/.disable()`.
- [`apiRevalidate.jsx`](../app/routes/apiRevalidate.jsx) `clearBlogCache()` →
  `revalidatePath(path)` / `revalidateTag("cms:blog")`. Keep the fail-closed
  secret check.
- Preview banner in the layout → read `draftMode().isEnabled` in the layout
  (Server Component).

### 4.8 Static assets (~84 imports)
`import img from "./x.webp"` works in Next too (static imports return an object
with `src`/`width`/`height`). Two paths:
- **Minimal:** keep `<img src={img.src} />` (or `<img src={img} />` via the
  object) — least churn.
- **Recommended over time:** migrate to `next/image` for automatic
  optimization. On Vercel this is zero-config (built-in image optimizer, no
  `next.config` `images` setup needed for local/static imports), but it needs
  `width`/`height` or a `fill` container and touches many components. Do this as
  a **follow-up**, not during the port. Note Vercel meters Image Optimization
  usage — for a marketing site the volume is small, but keep it in mind.

`app/images/*` and `public/*` → put anything referenced by literal path in
`public/`; keep component-colocated imports as static imports.

### 4.9 Misc
- `import.meta.env.DEV` (in `root.jsx` ErrorBoundary) → `process.env.NODE_ENV`.
- `isRouteErrorResponse` / `ErrorBoundary` → `app/error.jsx` + `not-found.jsx`.
- `useNavigation` full-page "Loading…" states → Next `loading.jsx` (Suspense)
  per segment. Behavior differs slightly (per-segment skeletons vs one global
  overlay); acceptable, arguably better.
- Tailwind v4: swap `@tailwindcss/vite` for `@tailwindcss/postcss` +
  `postcss.config.mjs`. `app.css` `@theme` block is unchanged.
- `@/…` path alias via `tsconfig.json` `paths` (replaces `../../..` relatives).

### 4.10 TypeScript (decided)

The new project is **TypeScript**. Implications:

- **File extensions:** components/pages → `.tsx`; utilities/data/config → `.ts`.
  All ~71 files get renamed as they're ported (do it per-file during the port,
  not as one mechanical rename — types are added alongside).
- **`tsconfig.json`** replaces [`jsconfig.json`](../jsconfig.json); Next
  generates a baseline and `next-env.d.ts` on first run. Keep `strict: true`
  (the current jsconfig already opts into strict null/function checks).
- **Type the data seams first** — [`blogPosts.ts`](../app/data/blogPosts.js),
  [`jobs.ts`](../app/data/jobs.js), [`affiliateContent.ts`](../app/data/affiliateContent.js).
  Define `Post`, `Category`, `Job`, `AffiliateConfig`, etc. once; everything
  downstream (pages, `generateMetadata`, components) reuses them. This is where
  TS pays off most — the CMS/easy.jobs JSON shapes get real types.
- **Framework types are built-in:** `Metadata` / `generateMetadata` are typed by
  `next`; page props (`params`, `searchParams`) are typed per route; route
  handlers use the standard `Request`/`Response` (Web) types. No more untyped
  `loader`/`meta` return shapes.
- **Server Action** for the contact form gets a typed input/return
  (`{ success: boolean; message: string }`), consumed by `useActionState`.
- **Scope note:** typing adds up-front effort but is best done *during* the port,
  not after. Treat "no `any` in the data seams and page props" as the bar; UI
  components can start loosely typed and tighten over time. `react-hook-form`,
  `framer-motion`/`motion`, hCaptcha and react-icons all ship their own types.

---

### 4.11 What Next.js 16 changes for us (decided target)

We target **Next.js 16 + React 19** — the current major. For a greenfield build
there's no reason to start on an older version. What 16 means concretely here:

- **`middleware.ts` → `proxy.ts`** — the file is renamed and the export is
  `proxy()` with `proxyConfig` (same capabilities). All redirect/canonical logic
  (§5) lives here. This is the one rename that touches our plan directly; the
  `@next/codemod upgrade` handles it automatically if we ever start from a 15
  template.
- **Turbopack is the default bundler** (stable) for `next dev` and `next build`
  — faster builds, no Webpack config needed. Nothing in our stack requires
  Webpack.
- **Async request APIs** (`cookies()`, `headers()`, `draftMode()`, `params`,
  `searchParams`) are async — already the norm since 15, so `draftMode()` and the
  blog `searchParams` reads (§4.2, §4.7) are written `await`-first from the start.
- **Cache Components / `use cache` + PPR** are available. Optional for us, but a
  natural fit: mark the blog data reads cacheable and refresh them with
  `revalidateTag("cms:blog")` on the CMS webhook (§4.7) instead of the in-memory
  TTL cache. Treat as an enhancement, not required for parity.
- **React 19** matches the app's current React version, so `react-hook-form`,
  `motion`, hCaptcha and react-icons behave the same as today.

No blockers — every dependency we use supports 16 + React 19.

### 4.12 Will the animations work?

**Yes — all of them, unchanged.** Every animation API in the codebase is
client-side and framework-agnostic; the library code copies over verbatim.
Inventory across 16 files: `motion.*` (99 uses), `whileInView` (12),
`AnimatePresence` (11), `useReducedMotion` (6), `useMotionValue` (6),
`useScroll` (4), `useInView` (4), `useTransform` (2), `useSpring` (2),
`useAnimation` (2), plus pure CSS `@keyframes` in [`app.css`](../app/app.css)
(rotation, shimmer, aurora, grid) which need zero changes.

The only requirement: each animated file gets **`"use client"`** at the top
(motion needs hooks/browser APIs). Forgetting it is a **build-time error, not a
silent break**, so it can't slip through. The page stays a Server Component and
passes props to the animated Client Component.

Two things verified so this isn't a risk:

- **No route-transition animations.** `AnimatePresence` is used only for local UI
  (FAQ accordions, the offer page) — *not* page-to-page transitions. Cross-route
  exit animations are the one hard case in the App Router; **we don't use them.**
- **SSR flash is identical to today.** Motion renders the `initial` state on the
  server and animates after hydration — the same behavior the current SSR app
  already has. No new flicker.

Standardize on the `motion` package (`motion/react`) everywhere during the port
(the code currently mixes `framer-motion` and `motion/react`).

## 5. Legacy WordPress redirects
The 11 config matchers in `app/routes.js` all point at
[`blogLegacyRedirect.jsx`](../app/routes/blogLegacyRedirect.jsx). In Next they
consolidate into **`proxy.ts`** (Next 16's renamed middleware — `export function
proxy()` + `proxyConfig`, formerly `middleware.ts`). This is needed because
category/tag map to *query* redirects, which `next.config` `redirects()` can't
express for the `?category=<slug>` target — `redirects()` can rewrite path
params but not turn a path segment into a query param cleanly. The proxy handles
all cases in one place:

- `/blog/page/:n` → `/blog`
- `/blog/category/:slug[/page/:n]` → `/blog?category=:slug`
- `/blog/tag/:slug[/page/:n]` → `/blog?tag=:slug`
- `/blog/author/*`, `/blog/feed`, date archives `/blog/:year/:month` → `/blog`
- `/blog/:slug/feed` → `/blog/:slug`

The proxy also lets us emit exact **301**s. Keep the same target mapping as the
current file so no ranking equity is lost.

---

## 6. Limitations, risks & gotchas

1. **`handle`/`useMatches` has no equivalent** — the per-route dark/light chrome
   system must be redesigned (§4.1). Highest-touch change.
2. **`"use client"` boundary is the real work.** Every component using hooks,
   event handlers, or `framer-motion`/`motion` must be a Client Component.
   Given 16 animation files + Navbar/Form/blog-interactivity, **most page
   components will be `"use client"`**. Server Components will mostly be the
   thin route wrappers that fetch data and pass props down. This is normal for a
   heavily-animated marketing site, but it means we don't get large RSC payload
   savings — set expectations accordingly.
3. **Redirect status codes change to 308/307** by default. SEO-equivalent, but
   use the proxy if exact 301/302 is mandated.
4. **Config→file routing loses route reuse.** One file served 11 legacy
   matchers via distinct `id`s; Next can't do that — hence `proxy.ts` (§5).
5. **JSON-LD** loses the `"script:ld+json"` helper; render explicit
   `<script type="application/ld+json">` tags (§4.4).
6. **`useFetcher` form flow** must be rebuilt on Server Actions / route handler
   + `useActionState`. Watch the success-modal effect and `reset()` timing.
7. **nodemailer is Node-runtime only** — don't set Edge runtime on the contact
   handler/action. On Vercel it runs as a Node serverless function (the
   default). Outbound SMTP to Gmail on port 587 works from Vercel functions;
   `createTransport` per invocation is fine (functions are ephemeral). Watch the
   function timeout (10s default on Hobby, configurable via `maxDuration`) —
   hCaptcha verify + send is well under it, but a hung SMTP connection could
   approach it, so keep the existing error handling.
8. **Loading UX differs** — global navigation overlay → per-segment
   `loading.jsx`. Decide whether to replicate the current full-screen loader.
9. **Two motion import styles** (`framer-motion` and `motion/react`) — Next 16 +
   React 19 works with `motion` (the newer package); standardize on one during
   the port to avoid duplicate deps.
10. **Env vars** carry over unchanged (SMTP_*, HCAPTCHA_SECRET_KEY, CMS_*,
    EASYJOBS_*, REVALIDATE_SECRET, PREVIEW_SECRET). Server-only vars stay
    unprefixed (never `NEXT_PUBLIC_`). The data seams already read them at
    request time, so no change there. On Vercel these are set in **Project →
    Settings → Environment Variables** (per Production/Preview/Development), not
    in a `.env` file shipped in an image.
11. **Deploy model changes to Vercel** — no Dockerfile, no `react-router-serve`,
    no port binding. Push to a Git branch → Vercel builds and gives a Preview
    URL; merge to `main` → Production. See §6a.
12. **`.react-router/` and `build/`** artifacts, `react-router.config.js`,
    `vite.config.js`, [`Dockerfile`](../Dockerfile), `.dockerignore`, and all
    `@react-router/*` deps get removed.

**Not affected (drop-in):** the three data seams, `app.css`/Tailwind theme,
`react-hook-form`, hCaptcha, react-icons, all business logic and copy, all
public URLs, the CMS/easy.jobs/SMTP contracts.

---

## 6a. Vercel setup (target host)

**Deploy flow.** Connect the GitHub repo to a Vercel project. Every branch push
gets a **Preview deployment** (unique URL); merging to `main` promotes to
**Production**. No Dockerfile, no `next start` — Vercel detects Next.js and
builds it. Framework preset: Next.js; build command and output are auto-detected.

**Environment variables.** Set all server secrets in **Project → Settings →
Environment Variables**, scoped to Production / Preview / Development as needed:
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `HCAPTCHA_SECRET_KEY`,
`CMS_API_URL`, `CMS_SITE`, `EASYJOBS_API_KEY` (+ optional `EASYJOBS_*`),
`REVALIDATE_SECRET`, `PREVIEW_SECRET`. None get the `NEXT_PUBLIC_` prefix — they
must stay server-only. Use `vercel env pull` to sync them into a local
`.env.local` for `vercel dev`.

**Functions & runtimes.**

- Route handlers (contact / revalidate / preview) run as **Node serverless
  functions** — required for nodemailer. Don't opt them into Edge.
- `proxy.ts` (trailing slash + legacy blog redirects, §5) runs on Vercel's
  **Edge** layer — pure redirects, no Node APIs, so it's a perfect fit and
  runs before the cache for near-zero latency.
- Consider `maxDuration` on the contact handler if Gmail SMTP is ever slow.

**Preview & revalidation on Vercel.**

- `draftMode()` works natively; the CMS "Preview on site" button hits
  `/api/preview?secret=…&slug=…` on the deployment.
- On-demand revalidation via `revalidatePath`/`revalidateTag` is first-class.
  Point the CMS revalidation webhook at
  `https://<production-domain>/api/revalidate` with the `REVALIDATE_SECRET`.
- With `fetch(..., { next: { tags: ["cms:blog"] } })` in the data seams, a single
  `revalidateTag("cms:blog")` refreshes the blog list, post pages, home rail and
  sitemap together — cleaner than the current in-memory cache. (Optional
  improvement; the existing TTL cache also works.)

**Domain & DNS.** Add `efoli.com` (and `www`) in **Project → Settings →
Domains**; cut over DNS at go-live. Preview deploys get `*.vercel.app` URLs for
QA before the switch.

**`vercel.json`.** Likely unneeded — redirects/headers live in `proxy.ts`
and `next.config`. Add it only for things those can't express (e.g. a specific
function region or `maxDuration` override).

> The Vercel MCP connector in this workspace needs authorization before it can
> drive the project from here (connect it in claude.ai connector settings, or
> use the Vercel dashboard / `vercel` CLI directly).

---

## 7. Suggested phased plan

> **Progress (Phases 1–8 done):** All eight pages ported and verified in the
> browser; contact form (Server route + nodemailer/hCaptcha) and native
> preview/revalidate endpoints working; SEO parity complete — JSON-LD
> auto-extracted from the RR sources into lib/jsonld.ts, self-referencing
> canonicals, blog noindex on search/pagination, custom 404. Full build passes;
> TypeScript clean. **Remaining: Phase 9 (Vercel deploy — needs the user to
> connect the repo + set env vars) and Phase 10 (next/image + polish).**
>
> **Earlier progress:** Phases 1–3 done on branch `feat/nextjs-migration`, in the
> `next-app/` subdirectory (the React Router app at the repo root is untouched).
> Next 16.3.4 + React 19.2.8 + TS + Tailwind v4 scaffolded; theme/fonts/GA
> ported; `blogPosts.ts` + `jobs.ts` typed; `proxy.ts` + `sitemap.ts` built and
> **verified** (build passes, every redirect is a single-hop 301, sitemap serves
> 7 static + live CMS post URLs). Site chrome (`SiteChrome` + `Navbar` + `Footer`
> + `PreviewBanner`) ported and **verified in the browser** — light *and* black
> header/footer both render correctly, server-side. `affiliateContent` is
> deferred to Phase 4 — it's page content bound to image assets and the affiliate
> component, not an external API seam, so it ports with that page. Dev runs on
> **port 4005** (RR stays 4004).

1. ✅ **Scaffold** — Next 16 (App Router, **TypeScript**) in `next-app/`; Tailwind
   v4 (PostCSS), `next/font` (Inter + Red Hat Display), `@/*` alias, env
   (`.env.local` + committed `.env.example`), GA via `@next/third-parties`, base
   `app/layout.tsx`.
2. ✅ **Data & SEO plumbing** — typed `blogPosts.ts` + `jobs.ts` seams; `proxy.ts`
   (trailing slash + legacy redirects, `skipTrailingSlashRedirect: true` so it's
   one hop); native `app/sitemap.ts`.
3. ✅ **Site chrome** (§4.1) — `SiteChrome` (Server Component) composes `Navbar`
   (client), `Footer` (server), and `PreviewBanner` from explicit per-page props
   (`darkHeader`/`darkFooter`/`hideBanner`/`preview`). Chrome assets copied to
   `public/`. The `preview` prop is wired to `draftMode()` in Phase 6 (kept off
   the shared chrome so marketing pages stay static/ISR-capable).
4. **Port pages** in order of independence: static (offer/service/about) →
   home → career/affiliate → blog list → blog post. Mark client boundaries as
   you go.
5. **Contact form** — Server Action + `Form.jsx` rewrite (hCaptcha, nodemailer,
   success modal).
6. **Preview + revalidate** route handlers on native `draftMode()`/
   `revalidatePath` — delete the RR shims.
7. **Redirects/canonical parity check** — verify every URL in §3 and §5 returns
   the same status + target as today (script the old vs new responses).
8. **SEO parity check** — diff `<title>`, canonical, robots, OG, and JSON-LD per
   page against the live site before cutover.
9. **Vercel deploy** — connect repo, set env vars, verify on the Preview URL,
   add the domain, then cut over DNS (§6a). Delete `Dockerfile`/`.dockerignore`.
10. **Follow-ups (post-cutover):** `next/image` adoption, standardize on one
    `motion` package, per-segment `loading.jsx` polish.

---

## 8. Open questions (decide before starting)

- ~~**Host**~~ — **Decided: Vercel** (see §6a).
- ~~**TS vs JS**~~ — **Decided: TypeScript** (see §4.10).
- ~~**Chrome-theming approach**~~ — **Decided: option 1** (`SiteChrome`, Server
  Component, per-page server-rendered — see §4.1).
- ~~**Next.js + React version**~~ — **Decided: Next.js 16 + React 19** (current
  major; see §4.11 for what 16 changes for us).
- **Loading UX** — replicate the full-screen loader, or adopt per-segment
  skeletons?
- **Exact 301 requirement** — is 308 acceptable for redirects, or must we force
  301 via `proxy.ts` everywhere?
- **Timing** — big-bang cutover vs running both and switching DNS/proxy.
