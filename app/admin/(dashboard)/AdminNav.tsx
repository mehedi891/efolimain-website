"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Leads", exact: true },
  { href: "/admin/bfcm/partners", label: "BFCM partners" },
  { href: "/admin/bfcm/categories", label: "Partner categories" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin sections" className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
      {LINKS.map((l) => {
        const active = l.exact ? pathname === l.href : pathname === l.href || pathname.startsWith(`${l.href}/`);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold transition ${
              active ? "border-[#0D99FF] text-[#0D99FF]" : "border-transparent text-[#4B5154] hover:text-[#13181E]"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
