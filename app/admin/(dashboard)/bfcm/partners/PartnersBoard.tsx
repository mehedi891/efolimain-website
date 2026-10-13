"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { FiEdit2, FiExternalLink, FiPlus, FiTrash2 } from "react-icons/fi";
import type { BfcmCategory, BfcmPartner } from "@/lib/bfcm/types";
import { initialsOf, isExpired, untilLabel } from "@/lib/bfcm/format";
import { SortableList, Switch } from "../Sortable";
import { deletePartnerAction, reorderPartnersAction, setPartnerActiveAction } from "../actions";

type Status = { kind: "ok" | "error"; text: string } | null;

export default function PartnersBoard({
  initial,
  categories,
  visibleCount,
  pagePath,
}: {
  initial: BfcmPartner[];
  categories: BfcmCategory[];
  visibleCount: number;
  pagePath: string;
}) {
  const [items, setItems] = useState(initial);
  const [status, setStatus] = useState<Status>(null);
  const [pending, startTransition] = useTransition();
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));

  // Where each partner lands on the public page (mirrors getPublicBfcmData).
  const rankById = new Map<string, number>();
  let rank = 0;
  for (const p of items) {
    const cat = catBySlug.get(p.category);
    if (p.isActive && cat?.isActive && !(p.hideAfterEnd && isExpired(p.validUntil))) rankById.set(p.id, ++rank);
  }

  function save(prev: BfcmPartner[], next: BfcmPartner[], call: () => Promise<{ ok: boolean; error?: string }>, okText: string) {
    setItems(next);
    setStatus(null);
    startTransition(async () => {
      const res = await call();
      if (res.ok) setStatus({ kind: "ok", text: okText });
      else {
        setItems(prev);
        setStatus({ kind: "error", text: res.error ?? "Couldn't save. Please try again." });
      }
    });
  }

  function reorder(next: BfcmPartner[]) {
    save(items, next, () => reorderPartnersAction(next.map((p) => p.id)), "Order saved — the page is updated.");
  }

  function toggle(p: BfcmPartner, isActive: boolean) {
    const next = items.map((x) => (x.id === p.id ? { ...x, isActive } : x));
    save(items, next, () => setPartnerActiveAction(p.id, isActive), `${p.name} is now ${isActive ? "shown" : "hidden"}.`);
  }

  function remove(p: BfcmPartner) {
    if (!window.confirm(`Delete “${p.name}”? This can't be undone.`)) return;
    save(items, items.filter((x) => x.id !== p.id), () => deletePartnerAction(p.id), `${p.name} deleted.`);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#13181E]">BFCM partner deals</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#4B5154]">
            Drag <span aria-hidden>⠿</span> to change the order on the page. The first {visibleCount} visible deals show
            first; the rest are under “View more”.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={pagePath}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-[#13181E] hover:bg-gray-50"
          >
            View page <FiExternalLink aria-hidden />
          </a>
          <Link
            href="/admin/bfcm/partners/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D99FF] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0A7ACC]"
          >
            <FiPlus aria-hidden /> Add partner
          </Link>
        </div>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`mt-4 min-h-6 text-sm font-medium ${status?.kind === "error" ? "text-red-600" : "text-[#15803d]"}`}
      >
        {pending ? "Saving…" : status?.text}
      </p>

      {items.length === 0 ? (
        <div className="mt-2 rounded-2xl bg-white p-8 text-center ring-1 ring-gray-200">
          <p className="font-display text-lg font-bold text-[#13181E]">No partners yet</p>
          <p className="mt-1 text-sm text-[#4B5154]">
            Import the current deals with{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
              node --env-file=.env.local --experimental-strip-types scripts/seed-bfcm-partners.mts
            </code>{" "}
            or add one manually.
          </p>
        </div>
      ) : (
        <SortableList
          dndId="bfcm-partners"
          items={items}
          onReorder={reorder}
          itemLabel={(p) => `Drag to reorder ${p.name}`}
          className="mt-2 space-y-2"
          renderItem={(p, _i, handle, dragging) => {
            const cat = catBySlug.get(p.category);
            const r = rankById.get(p.id);
            const expired = isExpired(p.validUntil);
            return (
              <div
                className={`flex flex-wrap items-center gap-3 rounded-xl bg-white p-3 ring-1 transition sm:flex-nowrap ${
                  dragging ? "shadow-lg ring-[#0D99FF]" : "ring-gray-200"
                } ${p.isActive ? "" : "opacity-60"}`}
              >
                {handle}

                <span
                  className={`w-20 shrink-0 rounded-full px-2 py-0.5 text-center text-xs font-semibold ${
                    !r ? "bg-gray-100 text-gray-500" : r <= visibleCount ? "bg-[#e9f4ff] text-[#1d74bf]" : "bg-amber-50 text-amber-700"
                  }`}
                  title={!r ? "Not on the page" : r <= visibleCount ? "Shown before “View more”" : "Under “View more”"}
                >
                  {!r ? "Hidden" : r <= visibleCount ? `#${r}` : `#${r} · more`}
                </span>

                {p.logoUrl ? (
                  <img src={p.logoUrl} alt="" className="h-10 w-10 shrink-0 rounded-lg object-contain ring-1 ring-gray-200" />
                ) : (
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-sm font-bold text-white"
                    style={{ background: p.accentColor || cat?.color || "#3e97f0" }}
                  >
                    {initialsOf(p.name)}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[#13181E]">{p.name}</p>
                  <p className="truncate text-xs text-gray-500">
                    by {p.developer} · {untilLabel(p.validUntil)}
                    {expired && <span className="ml-1 font-semibold text-red-600">· Ended{p.hideAfterEnd ? " (auto-hidden)" : ""}</span>}
                    {!expired && p.hideAfterEnd && <span className="ml-1">· auto-hides after</span>}
                  </p>
                </div>

                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-[#13181E] ring-1 ring-gray-200">
                  <span className="h-2 w-2 rounded-full" style={{ background: cat?.color ?? "#9ca3af" }} aria-hidden />
                  {cat?.label ?? p.category}
                  {cat && !cat.isActive && <span className="text-gray-400">(hidden)</span>}
                </span>

                <span className="shrink-0 rounded-full bg-[#d6ff4f] px-2.5 py-1 text-xs font-bold text-[#0b1020]">{p.offerBadge}</span>

                <Switch checked={p.isActive} onChange={(v) => toggle(p, v)} label={`Show ${p.name} on the page`} disabled={pending} />

                <Link
                  href={`/admin/bfcm/partners/${p.id}`}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#0D99FF]"
                  aria-label={`Edit ${p.name}`}
                >
                  <FiEdit2 aria-hidden />
                </Link>
                <button
                  type="button"
                  onClick={() => remove(p)}
                  disabled={pending}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 cursor-pointer"
                  aria-label={`Delete ${p.name}`}
                >
                  <FiTrash2 aria-hidden />
                </button>
              </div>
            );
          }}
        />
      )}
    </div>
  );
}
