// Temporary placeholder — the real homepage is ported in Phase 4.
// Kept minimal so the app builds and the scaffold/theme can be verified.
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-4xl font-bold text-[#13181e]">
        eFoli — Next.js migration scaffold
      </h1>
      <p className="mt-4 text-lg text-[#4b5154]">
        Phase 1–2 scaffold is live. Pages, chrome, and content are ported in
        later phases. See <code>docs/nextjs-migration.md</code>.
      </p>
    </main>
  );
}
