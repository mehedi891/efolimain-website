/**
 * Draft-preview banner. Shown when Next's draftMode is enabled (wired in
 * Phase 6). The Exit link clears draft mode via the /api/preview/exit route.
 */
export default function PreviewBanner() {
  return (
    <div className="sticky top-0 z-[100] flex items-center justify-center gap-3 bg-[#b45309] px-4 py-2 text-center text-sm font-medium text-white">
      <span>Preview mode — showing unpublished content.</span>
      <a
        href="/api/preview/exit"
        className="font-semibold underline underline-offset-2 hover:opacity-90"
      >
        Exit
      </a>
    </div>
  );
}
