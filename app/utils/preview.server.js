import { createCookie } from "react-router";

/**
 * Draft-preview state, stored in an httpOnly cookie.
 *
 * The Next.js reference in docs/cms.md uses `draftMode()`; this site is React
 * Router, so preview is a small signed cookie instead. The cookie only carries
 * a flag ("on") — the actual PREVIEW_SECRET is read from the environment in the
 * data layer and sent to the CMS as a header, never stored in the cookie or
 * exposed to the client.
 */
export const previewCookie = createCookie("ej_preview", {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60, // 1 hour — an editing session, not permanent
});

/** True when the request carries an active preview cookie. */
export async function isPreviewRequest(request) {
  const value = await previewCookie.parse(request.headers.get("Cookie"));
  return value === "on";
}
