import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { APP_GOALS, appsByKeys, appStoreHref } from "@/data/apps";

/**
 * "Built by a Shopify app studio" — indirect app promotion, grouped by goal.
 * Shown at the bottom of the free-tools hub and every individual tool page.
 */
export default function AppStudioSection() {
  return (
    <section className="border-t border-gray-100 bg-[#fafcfd]">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[#0D99FF] ring-1 ring-[#0D99FF]/15">
            From the makers
          </span>
          <h2 className="mt-6 font-display text-3xl md:text-4xl font-bold tracking-[-1px] text-[#13181E]">
            Built by a Shopify app studio
          </h2>
          <p className="mt-4 text-lg/[1.6] text-[#4B5154]">
            These free tools come from eFoli — the team behind six Shopify apps that help merchants
            grow AOV, sell B2B, and automate operations. Whatever you&apos;re optimizing, there&apos;s
            probably an app for it.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {APP_GOALS.map((g) => (
            <div key={g.goal} className="rounded-2xl bg-white p-6 ring-1 ring-gray-200">
              <h3 className="font-display text-lg font-bold text-[#13181E]">{g.goal}</h3>
              <p className="mt-1 text-sm text-gray-500">{g.blurb}</p>
              <div className="mt-4 space-y-1">
                {appsByKeys(g.appKeys).map((a) => (
                  <a
                    key={a.key}
                    href={appStoreHref(a)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group -mx-2 flex items-center gap-3 rounded-xl p-2 transition hover:bg-[#F2FBFA]"
                  >
                    <Image src={a.icon} alt={a.name} className="h-9 w-9 shrink-0 rounded-lg object-contain" />
                    <span className="min-w-0">
                      <span className="block font-semibold text-[#13181E]">{a.name}</span>
                      <span className="block text-sm text-gray-500">{a.tagline}</span>
                    </span>
                    <FiArrowUpRight
                      aria-hidden
                      className="ml-auto shrink-0 text-gray-300 transition group-hover:text-[#0D99FF] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
