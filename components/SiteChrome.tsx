import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PreviewBanner from "./PreviewBanner";

export interface SiteChromeProps {
  children: ReactNode;
  /** Black header on this page (about-us, contact-us, service). */
  darkHeader?: boolean;
  /** Black footer on this page (about-us, contact-us, service, offer, career). */
  darkFooter?: boolean;
  /** Hide the "Let's Make a Real Impact" CTA banner (service, offer). */
  hideBanner?: boolean;
  /** Show the draft-preview banner (blog post pages in draft mode — Phase 6). */
  preview?: boolean;
}

/**
 * Per-page site chrome. Replaces React Router's shared layout + `handle` +
 * `useMatches` system (which Next has no equivalent for). Each page composes
 * this with explicit props, so the black/light header/footer is decided by the
 * route and rendered on the server — identical in every browser, no flicker,
 * no client state. See docs/nextjs-migration.md §4.1 for the per-page matrix.
 */
export default function SiteChrome({
  children,
  darkHeader = false,
  darkFooter = false,
  hideBanner = false,
  preview = false,
}: SiteChromeProps) {
  return (
    <>
      {preview && <PreviewBanner />}
      <Navbar
        parentClassName={
          darkHeader
            ? "bg-[#0A0C00]"
            : "bg-white/90 backdrop-blur border-b border-gray-100"
        }
        linkClassName={darkHeader ? "text-white" : "text-[#4b5154]"}
        isDark={darkHeader}
      />
      {children}
      <Footer isDark={darkFooter} isBannerHide={hideBanner} />
    </>
  );
}
