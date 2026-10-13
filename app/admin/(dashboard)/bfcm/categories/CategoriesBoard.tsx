"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FiCheck, FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import type { BfcmCategory } from "@/lib/bfcm/types";
import { LIMITS } from "@/lib/bfcm/validate";
import { SortableList, Switch } from "../Sortable";
import { deleteCategoryAction, reorderCategoriesAction, saveCategoryAction, setCategoryActiveAction } from "../actions";

type Cat = BfcmCategory & { partnerCount: number };
type Status = { kind: "ok" | "error"; text: string } | null;

const inputCls =
  "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#13181E] focus:border-[#0D99FF] focus:outline-none focus:ring-2 focus:ring-[#0D99FF]/30";

export default function CategoriesBoard({ initial }: { initial: Cat[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  // Re-sync when the server sends fresh data (after add/rename/refresh).
  const [synced, setSynced] = useState(initial);
  if (initial !== synced) {
    setSynced(initial);
    setItems(initial);
  }
  const [status, setStatus] = useState<Status>(null);
  const [pending, startTransition] = useTransition();
  const [newCat, setNewCat] = useState({ label: "", color: "#3e97f0" });
  const [editing, setEditing] = useState<{ id: string; label: string; color: string } | null>(null);

  function act(call: () => Promise<{ ok: boolean; error?: string; errors?: Record<string, string | undefined> }>, okText: string, onFail?: () => void) {
    setStatus(null);
    startTransition(async () => {
      const res = await call();
      if (res.ok) {
        setStatus({ kind: "ok", text: okText });
        router.refresh();
      } else {
        onFail?.();
        const fieldMsg = res.errors && Object.values(res.errors).find(Boolean);
        setStatus({ kind: "error", text: res.error ?? fieldMsg ?? "Couldn't save. Please try again." });
      }
    });
  }

  function reorder(next: Cat[]) {
    const prev = items;
    setItems(next);
    act(() => reorderCategoriesAction(next.map((c) => c.id)), "Tab order saved — the page is updated.", () => setItems(prev));
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    const label = newCat.label.trim();
    if (!label) return setStatus({ kind: "error", text: "Enter a category name." });
    act(() => saveCategoryAction(null, { label, color: newCat.color }), `Added “${label}”.`);
    setNewCat({ label: "", color: newCat.color });
  }

  function saveEdit() {
    if (!editing) return;
    const { id, label, color } = editing;
    act(() => saveCategoryAction(id, { label, color }), "Category saved.");
    setEditing(null);
  }

  function toggle(c: Cat, isActive: boolean) {
    const prev = items;
    setItems(items.map((x) => (x.id === c.id ? { ...x, isActive } : x)));
    act(() => setCategoryActiveAction(c.id, isActive), `“${c.label}” is now ${isActive ? "shown" : "hidden"}.`, () => setItems(prev));
  }

  function remove(c: Cat) {
    if (!window.confirm(`Delete the “${c.label}” category?`)) return;
    act(() => deleteCategoryAction(c.id), `Deleted “${c.label}”.`);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[#13181E]">Partner categories</h1>
      <p className="mt-1 max-w-2xl text-sm text-[#4B5154]">
        These are the filter tabs on the partner section (after “All deals”). Drag <span aria-hidden>⠿</span> to change the tab
        order. A hidden category hides its tab and its deals; tabs with no visible deals are hidden automatically.
      </p>

      <form onSubmit={add} className="mt-5 flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 ring-1 ring-gray-200">
        <div>
          <label htmlFor="new-cat-label" className="text-sm font-semibold text-[#13181E]">
            New category
          </label>
          <input
            id="new-cat-label"
            value={newCat.label}
            maxLength={LIMITS.categoryLabel}
            onChange={(e) => setNewCat({ ...newCat, label: e.target.value })}
            placeholder="e.g. Shipping"
            className={`mt-1 block w-64 ${inputCls}`}
          />
        </div>
        <div>
          <label htmlFor="new-cat-color" className="text-sm font-semibold text-[#13181E]">
            Card colour
          </label>
          <input
            id="new-cat-color"
            type="color"
            value={newCat.color}
            onChange={(e) => setNewCat({ ...newCat, color: e.target.value })}
            className="mt-1 block h-10 w-16 cursor-pointer rounded-lg border border-gray-300 bg-white p-1"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D99FF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0A7ACC] disabled:opacity-60 cursor-pointer"
        >
          <FiPlus aria-hidden /> Add category
        </button>
      </form>

      <p
        role="status"
        aria-live="polite"
        className={`mt-4 min-h-6 text-sm font-medium ${status?.kind === "error" ? "text-red-600" : "text-[#15803d]"}`}
      >
        {pending ? "Saving…" : status?.text}
      </p>

      <SortableList
        dndId="bfcm-categories"
        items={items}
        onReorder={reorder}
        itemLabel={(c) => `Drag to reorder ${c.label}`}
        className="mt-2 space-y-2"
        renderItem={(c, _i, handle, dragging) => {
          const isEditing = editing?.id === c.id;
          return (
            <div
              className={`flex flex-wrap items-center gap-3 rounded-xl bg-white p-3 ring-1 sm:flex-nowrap ${
                dragging ? "shadow-lg ring-[#0D99FF]" : "ring-gray-200"
              } ${c.isActive ? "" : "opacity-60"}`}
            >
              {handle}
              {isEditing ? (
                <>
                  <input
                    type="color"
                    value={editing.color}
                    onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                    aria-label="Card colour"
                    className="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-gray-300 bg-white p-1"
                  />
                  <input
                    value={editing.label}
                    maxLength={LIMITS.categoryLabel}
                    onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    aria-label="Category name"
                    className={`min-w-0 flex-1 ${inputCls}`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="grid h-9 w-9 place-items-center rounded-lg bg-[#0D99FF] text-white cursor-pointer"
                    aria-label="Save category"
                  >
                    <FiCheck aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="grid h-9 w-9 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
                    aria-label="Cancel editing"
                  >
                    <FiX aria-hidden />
                  </button>
                </>
              ) : (
                <>
                  <span className="h-6 w-6 shrink-0 rounded-md ring-1 ring-black/10" style={{ background: c.color }} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[#13181E]">{c.label}</p>
                    <p className="text-xs text-gray-500">
                      {c.partnerCount} partner{c.partnerCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <Switch checked={c.isActive} onChange={(v) => toggle(c, v)} label={`Show ${c.label} tab`} disabled={pending} />
                  <button
                    type="button"
                    onClick={() => setEditing({ id: c.id, label: c.label, color: c.color })}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#0D99FF] cursor-pointer"
                    aria-label={`Edit ${c.label}`}
                  >
                    <FiEdit2 aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(c)}
                    disabled={pending || c.partnerCount > 0}
                    title={c.partnerCount > 0 ? "Move or delete its partners first" : undefined}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    aria-label={c.partnerCount > 0 ? `${c.label} has partners — can't delete` : `Delete ${c.label}`}
                  >
                    <FiTrash2 aria-hidden />
                  </button>
                </>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
