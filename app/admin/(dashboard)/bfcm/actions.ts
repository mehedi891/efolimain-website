"use server";

/**
 * Admin mutations for BFCM partners + categories. Each action re-checks the
 * admin session (Server Actions are public endpoints), writes through
 * lib/bfcm/store (which re-validates), then refreshes the public page and the
 * admin views so changes show immediately.
 */

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { PAGE_PATH } from "@/data/bfcmCampaign";
import * as store from "@/lib/bfcm/store";
import type { Result } from "@/lib/bfcm/store";

function refresh() {
  revalidatePath(PAGE_PATH);
  revalidatePath("/admin/bfcm/partners");
  revalidatePath("/admin/bfcm/categories");
}

async function run(fn: (email: string) => Promise<Result>): Promise<Result> {
  const session = await requireAdmin();
  try {
    const res = await fn(session.email);
    if (res.ok) refresh();
    return res;
  } catch (err) {
    console.error("[admin/bfcm] action failed:", err);
    return { ok: false, error: "Something went wrong saving. Please try again." };
  }
}

export async function savePartnerAction(id: string | null, input: unknown): Promise<Result> {
  return run((email) => store.savePartner(id, input, email));
}

export async function setPartnerActiveAction(id: string, isActive: boolean): Promise<Result> {
  return run((email) => store.setPartnerActive(id, isActive, email));
}

export async function deletePartnerAction(id: string): Promise<Result> {
  return run(() => store.deletePartner(id));
}

export async function reorderPartnersAction(ids: string[]): Promise<Result> {
  return run(() => store.reorderPartners(ids));
}

export async function saveCategoryAction(id: string | null, input: unknown): Promise<Result> {
  return run(() => store.saveCategory(id, input));
}

export async function setCategoryActiveAction(id: string, isActive: boolean): Promise<Result> {
  return run(() => store.setCategoryActive(id, isActive));
}

export async function deleteCategoryAction(id: string): Promise<Result> {
  return run(() => store.deleteCategory(id));
}

export async function reorderCategoriesAction(ids: string[]): Promise<Result> {
  return run(() => store.reorderCategories(ids));
}
