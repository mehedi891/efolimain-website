"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import s from "@/app/bfcm-offers/bfcm.module.css";
import PartnerCard from "@/app/bfcm-offers/PartnerCard";
import { slugify, toPublicPartner, untilLabel } from "@/lib/bfcm/format";
import { imageUrlProblem, normalizeImageUrl } from "@/lib/bfcm/imageHosts";
import { CODE_NOTE_PRESETS, LIMITS, parsePartnerInput, type FieldErrors } from "@/lib/bfcm/validate";
import type { BfcmCategory, BfcmPartner } from "@/lib/bfcm/types";
import { deletePartnerAction, savePartnerAction } from "../actions";

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#13181E] placeholder:text-gray-400 focus:border-[#0D99FF] focus:outline-none focus:ring-2 focus:ring-[#0D99FF]/30";

function Field({
  id,
  label,
  error,
  hint,
  count,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  count?: { value: string; max: number };
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-[#13181E]">
          {label}
        </label>
        {count && (
          <span className={`text-xs tabular-nums ${count.value.length > count.max ? "text-red-600" : "text-gray-400"}`}>
            {count.value.length}/{count.max}
          </span>
        )}
      </div>
      <div className="mt-1">{children}</div>
      {error ? (
        <p id={`${id}-err`} className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}

/** Image link input with a thumbnail, load check and aspect-ratio check. */
function ImageField({
  id,
  label,
  value,
  onChange,
  error,
  ratio,
  ratioHint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  ratio: number;
  ratioHint: string;
}) {
  const [load, setLoad] = useState<{ url: string; ok: boolean; w?: number; h?: number } | null>(null);
  const url = value.trim() ? normalizeImageUrl(value) : "";
  const problem = url ? imageUrlProblem(url) : null;
  const status = load && load.url === url ? load : null;
  const off = status?.ok && status.w && status.h ? Math.abs(status.w / status.h - ratio) / ratio > 0.15 : false;

  let note: ReactNode = <>Paste a direct image link (optional). {ratioHint}</>;
  let tone = "text-gray-500";
  if (error || problem) {
    note = error || problem;
    tone = "text-red-600 font-medium";
  } else if (status && !status.ok) {
    note = "Couldn't load this image — make sure the link opens the image itself, not a web page.";
    tone = "text-amber-700 font-medium";
  } else if (off) {
    note = `This image is ${status!.w}×${status!.h}. ${ratioHint} It will be cropped to fit.`;
    tone = "text-amber-700 font-medium";
  } else if (status?.ok) {
    note = `Looks good (${status.w}×${status.h}).`;
    tone = "text-[#15803d]";
  }

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-[#13181E]">
        {label}
      </label>
      <div className="mt-1 flex items-center gap-3">
        <input
          id={id}
          type="url"
          inputMode="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://cdn.shopify.com/…"
          className={inputCls}
          aria-invalid={!!(error || problem) || undefined}
        />
        {url && !problem && (
          <img
            key={url}
            src={url}
            alt=""
            className="h-10 w-16 shrink-0 rounded-md bg-gray-100 object-cover ring-1 ring-gray-200"
            onLoad={(e) => setLoad({ url, ok: true, w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
            onError={() => setLoad({ url, ok: false })}
          />
        )}
      </div>
      <p className={`mt-1 text-xs ${tone}`}>{note}</p>
    </div>
  );
}

export default function PartnerForm({
  initial,
  categories,
  defaultUntil,
}: {
  initial: BfcmPartner | null;
  categories: BfcmCategory[];
  defaultUntil: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [f, setF] = useState({
    name: initial?.name ?? "",
    developer: initial?.developer ?? "",
    category: initial?.category ?? categories.find((c) => c.isActive)?.slug ?? categories[0]?.slug ?? "",
    description: initial?.description ?? "",
    offerBadge: initial?.offerBadge ?? "",
    terms: initial?.terms ?? "",
    validUntil: initial?.validUntil ?? defaultUntil,
    hideAfterEnd: initial?.hideAfterEnd ?? false,
    hasCode: initial ? !!initial.code : true,
    code: initial?.code ?? "",
    codeNote: initial?.codeNote ?? CODE_NOTE_PRESETS[0],
    ctaUrl: initial?.ctaUrl ?? "",
    bannerUrl: initial?.bannerUrl ?? "",
    logoUrl: initial?.logoUrl ?? "",
    useAccent: !!initial?.accentColor,
    accentColor: initial?.accentColor ?? "#3e97f0",
    isActive: initial?.isActive ?? true,
  });
  const set = <K extends keyof typeof f>(key: K, value: (typeof f)[K]) => {
    setF((prev) => ({ ...prev, [key]: value }));
    // Editing a field clears its error (and the code/note pair clears together).
    setErrors((prev) => {
      if (!(key in prev) && key !== "hasCode") return prev;
      const next = { ...prev };
      delete next[key as keyof FieldErrors];
      if (key === "hasCode") {
        delete next.code;
        delete next.codeNote;
      }
      return next;
    });
  };

  const payload = {
    ...f,
    code: f.hasCode ? f.code : "",
    codeNote: f.hasCode ? "" : f.codeNote,
    accentColor: f.useAccent ? f.accentColor : "",
  };

  // Live preview — only show images whose links would be accepted on save.
  const okImg = (u: string) => (u.trim() && !imageUrlProblem(normalizeImageUrl(u)) ? normalizeImageUrl(u) : null);
  const category = categories.find((c) => c.slug === f.category);
  const preview = toPublicPartner(
    {
      ...payload,
      code: payload.code.trim() || null,
      codeNote: payload.codeNote.trim() || null,
      accentColor: payload.accentColor || null,
      bannerUrl: okImg(f.bannerUrl),
      logoUrl: okImg(f.logoUrl),
      name: f.name || "Partner app name",
      developer: f.developer || "Developer",
      description: f.description || "Short description of the deal.",
      offerBadge: f.offerBadge || "50% OFF",
      terms: f.terms || "Plans · eligibility",
      slug: initial?.slug ?? slugify(f.name),
    },
    category,
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const parsed = parsePartnerInput(payload);
    if (!parsed.ok) {
      setErrors(parsed.errors);
      const first = Object.keys(parsed.errors)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    setErrors({});
    startTransition(async () => {
      const res = await savePartnerAction(initial?.id ?? null, parsed.data);
      if (res.ok) {
        router.push("/admin/bfcm/partners");
        router.refresh();
      } else {
        setErrors(res.errors ?? {});
        setFormError(res.error ?? "Please fix the highlighted fields.");
      }
    });
  }

  function remove() {
    if (!initial || !window.confirm(`Delete “${initial.name}”? This can't be undone.`)) return;
    startTransition(async () => {
      const res = await deletePartnerAction(initial.id);
      if (res.ok) {
        router.push("/admin/bfcm/partners");
        router.refresh();
      } else setFormError(res.error ?? "Couldn't delete.");
    });
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-gray-200">
        <p className="font-display text-lg font-bold text-[#13181E]">Add a category first</p>
        <p className="mt-1 text-sm text-[#4B5154]">
          Every deal belongs to a category tab.{" "}
          <Link href="/admin/bfcm/categories" className="font-semibold text-[#0D99FF] underline">
            Manage categories
          </Link>
        </p>
      </div>
    );
  }

  const text = (key: "name" | "developer" | "offerBadge" | "terms", label: string, placeholder: string) => (
    <Field id={`f-${key}`} label={label} error={errors[key]} count={{ value: f[key], max: LIMITS[key] }}>
      <input
        id={`f-${key}`}
        value={f[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className={inputCls}
        aria-invalid={!!errors[key] || undefined}
      />
    </Field>
  );

  return (
    <div>
      <Link href="/admin/bfcm/partners" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D99FF]">
        <FiArrowLeft aria-hidden /> All partners
      </Link>
      <h1 className="mt-3 font-display text-2xl font-bold text-[#13181E]">{initial ? `Edit ${initial.name}` : "Add partner deal"}</h1>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <form onSubmit={submit} noValidate className="space-y-5 rounded-2xl bg-white p-6 ring-1 ring-gray-200">
          <div className="grid gap-5 sm:grid-cols-2">
            {text("name", "Partner app name", "Outfy – Social Media Auto Post")}
            {text("developer", "Developer (shown as “by …”)", "Outfy Inc")}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="f-category" label="Category" error={errors.category} hint="Sets the tab and the card colour.">
              <select id="f-category" value={f.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                    {c.isActive ? "" : " (hidden)"}
                  </option>
                ))}
              </select>
            </Field>
            {text("offerBadge", "Offer badge", "50% OFF")}
          </div>

          <Field
            id="f-description"
            label="Description"
            error={errors.description}
            count={{ value: f.description, max: LIMITS.description }}
            hint="The card shows up to 3 lines."
          >
            <textarea
              id="f-description"
              rows={3}
              value={f.description}
              onChange={(e) => set("description", e.target.value)}
              className={inputCls}
              aria-invalid={!!errors.description || undefined}
            />
          </Field>

          {text("terms", "Terms (🏷 line)", "Growth & Unlimited annual plans · forever")}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="f-validUntil" label="Valid until (🕒 line)" error={errors.validUntil} hint={`Shown as “${untilLabel(f.validUntil)}”.`}>
              <input
                id="f-validUntil"
                type="date"
                value={f.validUntil}
                onChange={(e) => set("validUntil", e.target.value)}
                className={inputCls}
              />
            </Field>
            <label className="flex items-start gap-2 self-center pt-5 text-sm text-[#13181E]">
              <input
                type="checkbox"
                checked={f.hideAfterEnd}
                onChange={(e) => set("hideAfterEnd", e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#0D99FF]"
              />
              <span>
                Hide automatically after this date
                <span className="block text-xs text-gray-500">Off = stays visible until you hide it.</span>
              </span>
            </label>
          </div>

          <fieldset className="rounded-xl border border-gray-200 p-4">
            <legend className="px-1 text-sm font-semibold text-[#13181E]">Discount code</legend>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="hasCode" checked={f.hasCode} onChange={() => set("hasCode", true)} className="accent-[#0D99FF]" />
                Has a code (shows a Copy button)
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="hasCode" checked={!f.hasCode} onChange={() => set("hasCode", false)} className="accent-[#0D99FF]" />
                No code — show a note
              </label>
            </div>
            <div className="mt-3">
              {f.hasCode ? (
                <Field id="f-code" label="Code" error={errors.code} count={{ value: f.code, max: LIMITS.code }}>
                  <input
                    id="f-code"
                    value={f.code}
                    onChange={(e) => set("code", e.target.value.toUpperCase())}
                    placeholder="BFCM50"
                    className={`${inputCls} font-semibold tracking-wider`}
                  />
                </Field>
              ) : (
                <Field id="f-codeNote" label="Note" error={errors.codeNote} hint="Pick a suggestion or type your own.">
                  <input
                    id="f-codeNote"
                    list="code-note-presets"
                    value={f.codeNote}
                    onChange={(e) => set("codeNote", e.target.value)}
                    className={inputCls}
                  />
                  <datalist id="code-note-presets">
                    {CODE_NOTE_PRESETS.map((n) => (
                      <option key={n} value={n} />
                    ))}
                  </datalist>
                </Field>
              )}
            </div>
          </fieldset>

          <Field id="f-ctaUrl" label="“Get deal” link" error={errors.ctaUrl} hint="Full https:// link — opens in a new tab.">
            <input
              id="f-ctaUrl"
              type="url"
              inputMode="url"
              value={f.ctaUrl}
              onChange={(e) => set("ctaUrl", e.target.value)}
              placeholder="https://efoli.com/blog/best-shopify-bfcm-apps#app-…"
              className={inputCls}
              aria-invalid={!!errors.ctaUrl || undefined}
            />
          </Field>

          <ImageField
            id="f-bannerUrl"
            label="Banner image"
            value={f.bannerUrl}
            onChange={(v) => set("bannerUrl", v)}
            error={errors.bannerUrl}
            ratio={1200 / 628}
            ratioHint="Best size: 1200×628."
          />
          <ImageField
            id="f-logoUrl"
            label="Logo"
            value={f.logoUrl}
            onChange={(v) => set("logoUrl", v)}
            error={errors.logoUrl}
            ratio={1}
            ratioHint="Use a square image, at least 256×256."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex items-start gap-2 text-sm text-[#13181E]">
              <input
                type="checkbox"
                checked={f.useAccent}
                onChange={(e) => set("useAccent", e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#0D99FF]"
              />
              <span>
                Custom card colour
                <span className="block text-xs text-gray-500">Off = uses the category colour.</span>
              </span>
            </label>
            {f.useAccent && (
              <Field id="f-accentColor" label="Card colour" error={errors.accentColor}>
                <input
                  id="f-accentColor"
                  type="color"
                  value={f.accentColor}
                  onChange={(e) => set("accentColor", e.target.value)}
                  className="h-10 w-20 cursor-pointer rounded-lg border border-gray-300 bg-white p-1"
                />
              </Field>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-[#13181E]">
            <input
              type="checkbox"
              checked={f.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="h-4 w-4 accent-[#0D99FF]"
            />
            Show on the page
          </label>

          {formError && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {formError}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-[#0D99FF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0A7ACC] disabled:opacity-60 cursor-pointer"
              >
                {pending ? "Saving…" : initial ? "Save changes" : "Add partner"}
              </button>
              <Link
                href="/admin/bfcm/partners"
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#13181E] hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
            {initial && (
              <button
                type="button"
                onClick={remove}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 cursor-pointer"
              >
                <FiTrash2 aria-hidden /> Delete partner
              </button>
            )}
          </div>
        </form>

        <aside className="lg:sticky lg:top-24">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Live preview</p>
          <div className={`${s.page} ${s.partners}`} style={{ padding: 24, borderRadius: 20 }}>
            <PartnerCard p={preview} preview />
          </div>
          {!f.isActive && <p className="mt-2 text-xs font-medium text-amber-700">Hidden — this card won&apos;t show on the page.</p>}
        </aside>
      </div>
    </div>
  );
}
