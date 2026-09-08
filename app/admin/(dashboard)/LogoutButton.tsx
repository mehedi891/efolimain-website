"use client";

import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-[#13181E] transition hover:bg-gray-50 cursor-pointer"
    >
      <FiLogOut aria-hidden /> Sign out
    </button>
  );
}
