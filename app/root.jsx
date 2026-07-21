import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { useEffect } from "react";

import "./app.css";

const GA_MEASUREMENT_ID = "G-MYXZB5LRXQ";

/**
 * Legacy WordPress blog archives: /blog/page/…, /blog/category/…, /blog/tag/…,
 * /blog/author/…, /blog/feed, plus anything two segments deep under /blog
 * (date archives like /blog/2024/08/ and per-post feeds like /blog/<slug>/feed/).
 * A normal post URL (/blog/<slug>/) is only one segment deep, so it isn't matched.
 */
const LEGACY_BLOG_PATH =
  /^\/blog\/(?:page|category|tag|author|feed)(?:\/|$)|^\/blog\/[^/]+\/[^/]+/;

/**
 * Canonicalize every URL to NO trailing slash (/blog, not /blog/).
 *
 * Without this both forms resolve with a 200 — duplicate content that splits
 * ranking signals. A single 301 keeps one canonical form.
 *
 * The root path "/" keeps its slash, and paths whose last segment contains a
 * dot (/sitemap.xml, /robots.txt, asset requests) are left alone.
 */
export function loader({ request }) {
  const { pathname, search } = new URL(request.url);

  if (pathname !== "/" && pathname.endsWith("/")) {
    // Legacy WordPress blog URLs always carry a trailing slash. Normalizing
    // them here would cost an extra hop before their own 301 fires, so let
    // routes/blogLegacyRedirect.jsx handle them directly in a single redirect.
    if (LEGACY_BLOG_PATH.test(pathname)) return null;

    const stripped = pathname.replace(/\/+$/, "");
    const lastSegment = stripped.split("/").pop();
    if (!lastSegment.includes(".")) {
      return redirect(`${stripped}${search}`, 301);
    }
  }

  return null;
}

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Red+Hat+Display:wght@400;500;600;700;800;900&display=swap",
  },
  {
    rel: "preconnect",
    href: "https://www.googletagmanager.com",
    crossOrigin: "anonymous",
  },
];

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />

        {/* Google tag (gtag.js) */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname + window.location.search,
              });
            `,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (!window.gtag) return;

    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  return <Outlet />;
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
