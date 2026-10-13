import type { Metadata } from "next";
import { listCategories } from "@/lib/bfcm/store";
import CategoriesBoard from "./CategoriesBoard";
import DbMissing from "../DbMissing";

export const metadata: Metadata = { title: "Partner categories · eFoli admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function BfcmCategoriesAdmin() {
  const categories = await listCategories();
  if (!categories) return <DbMissing />;
  return <CategoriesBoard initial={categories} />;
}
