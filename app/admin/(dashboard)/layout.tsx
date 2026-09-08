import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import LogoutButton from "./LogoutButton";

export const metadata: Metadata = {
  title: "Admin · eFoli Free Tools",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="min-h-dvh bg-[#fafcfd]">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div>
            <p className="font-display text-lg font-bold text-[#0D99FF] leading-none">eFoli</p>
            <p className="text-xs text-gray-500">Free-tools admin</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[#4B5154] sm:inline">{session.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
