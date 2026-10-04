"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND } from "@/lib/brand";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/properti", label: "Cari Properti" },
  { href: "/tentang", label: "Tentang" },
  { href: "/sumber-data", label: "Sumber Data" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-laguna-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-laguna-700 text-lg font-extrabold text-white">
            S
          </span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight text-laguna-900">
              {BRAND.name}
            </span>
            <span className="hidden text-[11px] font-medium text-stone-500 sm:block">
              {BRAND.tagline}
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-stone-600 hover:bg-laguna-50 hover:text-laguna-800"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/properti"
            className="ml-2 rounded-xl bg-laguna-700 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-laguna-800"
          >
            Cari Rumah
          </Link>
        </nav>
        <button
          className="rounded-lg p-2 text-stone-700 hover:bg-stone-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="border-t border-stone-100 bg-white px-4 py-3 md:hidden" aria-label="Navigasi seluler">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-stone-700 hover:bg-laguna-50"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
