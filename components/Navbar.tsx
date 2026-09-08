"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";

const navLinks: { name: string; href: string; end?: boolean; badge?: string }[] = [
  { name: "Home", href: "/", end: true },
  { name: "Free Tools", href: "/free-tools", badge: "Free" },
  { name: "About Us", href: "/about-us" },
  { name: "Blog", href: "/blog" },
  { name: "Career", href: "/career" },
  { name: "Service", href: "/service" },
  { name: "Contact Us", href: "/contact-us" },
];

interface NavbarProps {
  parentClassName?: string;
  linkClassName?: string;
  isDark?: boolean;
}

export default function Navbar({
  parentClassName,
  linkClassName,
  isDark,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Replaces React Router's <NavLink>: Home matches exactly, others match on
  // prefix (so /blog stays active on /blog/<slug>).
  const isActive = (href: string, end?: boolean) =>
    end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`${
        scrolled && isDark
          ? "bg-[#090A0B]"
          : isDark
            ? "md:bg-transparent"
            : "bg-inherit"
      } sticky top-0 z-50 ${parentClassName ?? ""}`}
    >
      <nav className="mx-auto max-w-7xl px-4 py-4 md:px-0">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.svg" alt="EFOLI, LLC" className="h-18 w-18" />
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-10.5">
            {navLinks.map((l) => {
              const active = isActive(l.href, l.end);
              return (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className={`inline-flex items-center gap-1.5 ${
                      active
                        ? "active text-[#0D99FF] font-medium"
                        : `text-[#13181E] font-medium ${linkClassName ?? ""}`
                    }`}
                  >
                    <Button text1={l.name} text2={l.name} />
                    {l.badge && (
                      <span className="rounded-full bg-[#0D99FF] px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none text-white">
                        {l.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Link href="/#efProducts">
              <Button
                pClass="rounded-lg text-sm px-5 py-2.5 font-medium text-white shadow-sm bg-[#0D99FF]"
                text1="Explore Our Products"
                text2="Explore Our Products"
              />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50"
          >
            <svg
              className={`h-5 w-5 transition-transform ${open ? "rotate-90" : ""} ${linkClassName ?? ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        className={`lg:hidden overflow-hidden border-t border-gray-100 transition-[max-height] duration-300 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <ul className="space-y-1">
            {navLinks.map((l) => {
              const active = isActive(l.href, l.end);
              return (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "group flex items-center justify-between rounded-lg px-3 py-2 transition-colors",
                      "text-[16px]",
                      active
                        ? "text-[#1d74bf] bg-[#1d74bf]/5"
                        : `${linkClassName ?? ""} hover:text-[#1d74bf] hover:bg-gray-50`,
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2">
                      <span className="relative">
                        {l.name}
                        <span
                          className={[
                            "pointer-events-none absolute left-0 right-0 -bottom-1 h-[2px] rounded bg-[#1d74bf]",
                            "origin-left transition-transform duration-200 ease-out",
                            active
                              ? "scale-x-100"
                              : "scale-x-0 group-hover:scale-x-100",
                          ].join(" ")}
                        />
                      </span>
                      {l.badge && (
                        <span className="rounded-full bg-[#0D99FF] px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none text-white">
                          {l.badge}
                        </span>
                      )}
                    </span>
                    <svg
                      className="h-4 w-4 opacity-60 group-hover:opacity-100"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="pt-3">
            <Link href="/#efProducts">
              <Button
                pClass="rounded-lg px-5 py-2.5 font-medium text-white shadow-sm bg-[#0D99FF]"
                text1="Try Our Products"
                text2="Try Our Products"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
