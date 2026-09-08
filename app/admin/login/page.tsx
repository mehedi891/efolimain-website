import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin login · eFoli",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  // Already signed in → go straight to the dashboard.
  if (await getAdminSession()) redirect("/admin");
  return (
    <main className="grid min-h-dvh place-items-center bg-[#fafcfd] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="font-display text-2xl font-bold text-[#0D99FF]">eFoli</p>
          <p className="mt-1 text-sm text-[#4B5154]">Free-tools admin</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
