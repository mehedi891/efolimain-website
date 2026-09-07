/**
 * Lightweight branded loading state for dynamic routes (shown by Next while a
 * server segment streams). Replaces the React Router full-screen navigation
 * loader with per-segment Suspense fallbacks.
 */
export default function RouteLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-[#f2fbfa]">
      <div className="flex flex-col items-center gap-4">
        <span
          className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#0D99FF]/25 border-t-[#0D99FF]"
          aria-hidden
        />
        <p className="font-display text-lg font-semibold text-[#13181E]">{label}</p>
      </div>
    </div>
  );
}
