import type { Metadata } from "next";
import { Inter, Red_Hat_Display } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

// Body text (matches the current site's Inter usage)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

// Headings / display (the `font-display` utility in globals.css)
const redHat = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-red-hat",
  display: "swap",
});

const GA_MEASUREMENT_ID = "G-MYXZB5LRXQ";

// Per-page `metadata`/`generateMetadata` supply their own full <title>.
export const metadata: Metadata = {
  metadataBase: new URL("https://efoli.com"),
  title: "B2B eCommerce Solutions & Shopify Apps | eFoli",
  description:
    "Scalable Shopify apps and B2B eCommerce solutions built for growth. Power your business with intuitive products, custom development, and 24/7 support.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${redHat.variable}`}>
      <body className="font-sans">{children}</body>
      {/* GA4 — @next/third-parties handles SPA pageviews on route change */}
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </html>
  );
}
