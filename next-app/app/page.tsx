import SiteChrome from "@/components/SiteChrome";

// Temporary placeholder — the real homepage is ported in Phase 4.
// Wrapped in SiteChrome (light chrome) to verify Navbar + Footer.
export default function Home() {
  return (
    <SiteChrome>
      <main className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="font-display text-4xl font-bold text-[#13181e]">
          eFoli — Next.js migration scaffold
        </h1>
        <p className="mt-4 text-lg text-[#4b5154]">
          Phase 3 chrome (Navbar + Footer + preview banner) is in place. Real
          page content is ported in Phase 4. See{" "}
          <code>docs/nextjs-migration.md</code>.
        </p>
      </main>
    </SiteChrome>
  );
}
