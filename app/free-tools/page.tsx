import type { Metadata } from "next";
import Link from "next/link";
import { FiActivity, FiArrowRight, FiShare2, FiCode, FiCpu } from "react-icons/fi";
import SiteChrome from "@/components/SiteChrome";
import BfcmCountdown from "@/components/BfcmCountdown";

const TITLE = "Free Shopify Tools | eFoli";
const DESCRIPTION =
  "Free tools for Shopify merchants from eFoli — audit your store's speed, SEO, conversion, and Black Friday readiness in seconds.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://efoli.com/free-tools" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "https://efoli.com/free-tools" },
};

interface Tool {
  href: string;
  name: string;
  blurb: string;
  Icon: typeof FiActivity;
  available: boolean;
}

const TOOLS: Tool[] = [
  {
    href: "/free-tools/shopify-store-audit",
    name: "Shopify Store Audit",
    blurb:
      "Instant report on speed, mobile, SEO, conversion, apps, and BFCM readiness — with prioritized fixes.",
    Icon: FiActivity,
    available: true,
  },
  {
    href: "/free-tools/meta-social-preview",
    name: "Meta & Social Preview",
    blurb:
      "See how any page looks in Google and on social shares (Facebook, X, LinkedIn) — and fix the tags.",
    Icon: FiShare2,
    available: true,
  },
  {
    href: "/free-tools/structured-data-checker",
    name: "Structured Data Checker",
    blurb:
      "Validate Product, Organization & Breadcrumb JSON-LD and find what's blocking Google rich results.",
    Icon: FiCode,
    available: true,
  },
  {
    href: "/free-tools/ai-visibility-checker",
    name: "AI Visibility Checker",
    blurb:
      "Can ChatGPT, Claude & Perplexity find your store? Check AI-crawler access and generate an llms.txt.",
    Icon: FiCpu,
    available: true,
  },
];

export default function FreeToolsHub() {
  return (
    <SiteChrome darkFooter hideBanner>
      <main className="bg-white">
        <section className="max-w-7xl mx-auto px-4 pt-20 pb-16 md:pt-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-[#F2FBFA] px-4 py-1.5 text-sm font-semibold text-[#0D99FF] ring-1 ring-[#0D99FF]/15">
              Free tools
            </span>
            <h1 className="mt-6 font-display text-4xl md:text-6xl font-bold tracking-[-1.5px] text-[#13181E]">
              Free tools for Shopify merchants
            </h1>
            <p className="mt-5 text-lg md:text-xl/[1.6] text-[#4B5154]">
              Quick, no-login diagnostics from the eFoli team. Find what&apos;s
              costing you sales — then fix it before the biggest weekend of the year.
            </p>
            <div className="mt-8">
              <BfcmCountdown align="start" />
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map(({ href, name, blurb, Icon, available }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col rounded-2xl bg-white p-7 ring-1 ring-gray-200 transition hover:ring-[#0D99FF]/40 hover:shadow-[0_18px_50px_-30px_rgba(13,153,255,0.5)]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#F2FBFA] text-2xl text-[#0D99FF]">
                  <Icon aria-hidden />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold text-[#13181E]">{name}</h2>
                <p className="mt-2 flex-1 text-[#4B5154]">{blurb}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#0D99FF]">
                  {available ? "Try it free" : "Coming soon"}
                  {available && <FiArrowRight aria-hidden className="transition group-hover:translate-x-1" />}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
