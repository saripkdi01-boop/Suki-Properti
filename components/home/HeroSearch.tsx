"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Rentang harga → pasangan priceMin/priceMax (rupiah). "semua" = tanpa filter. */
const PRICE_RANGES = [
  { value: "semua", label: "Semua harga" },
  { value: "lt150", label: "Di bawah Rp 150 jt", priceMax: 150_000_000 },
  { value: "150-200", label: "Rp 150 – 200 jt", priceMin: 150_000_000, priceMax: 200_000_000 },
  { value: "200-300", label: "Rp 200 – 300 jt", priceMin: 200_000_000, priceMax: 300_000_000 },
  { value: "gt300", label: "Di atas Rp 300 jt", priceMin: 300_000_000 },
] as const;

const TYPES = [
  { value: "semua", label: "Semua tipe" },
  { value: "rumah_subsidi", label: "Subsidi" },
  { value: "properti_developer", label: "Komersil" },
] as const;

export default function HeroSearch({
  regencies,
}: {
  regencies: { name: string; count: number }[];
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [regency, setRegency] = useState("");
  const [priceRange, setPriceRange] = useState<string>("semua");
  const [category, setCategory] = useState<string>("semua");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    const keyword = q.trim();
    if (keyword) params.set("q", keyword);
    if (regency) params.set("regency", regency);
    const range = PRICE_RANGES.find((r) => r.value === priceRange);
    if (range && "priceMin" in range && range.priceMin !== undefined)
      params.set("priceMin", String(range.priceMin));
    if (range && "priceMax" in range && range.priceMax !== undefined)
      params.set("priceMax", String(range.priceMax));
    if (category === "rumah_subsidi" || category === "properti_developer")
      params.set("category", category);
    const qs = params.toString();
    router.push(qs ? `/properti?${qs}` : "/properti");
  }

  const fieldCls =
    "w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm font-medium text-stone-800 outline-none transition focus:border-laguna-500 focus:bg-white focus:ring-2 focus:ring-laguna-200";
  const labelCls = "mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500";

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label="Pencarian properti"
      className="w-full rounded-2xl bg-white p-4 shadow-xl shadow-laguna-950/20 sm:p-5"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
        <div className="sm:col-span-2 lg:col-span-2">
          <label htmlFor="hero-q" className={labelCls}>
            Kata kunci
          </label>
          <input
            id="hero-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nama perumahan, kecamatan…"
            className={fieldCls}
          />
        </div>
        <div>
          <label htmlFor="hero-regency" className={labelCls}>
            Kab / Kota
          </label>
          <select
            id="hero-regency"
            value={regency}
            onChange={(e) => setRegency(e.target.value)}
            className={fieldCls}
          >
            <option value="">Semua wilayah</option>
            {regencies.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="hero-price" className={labelCls}>
            Kisaran harga
          </label>
          <select
            id="hero-price"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className={fieldCls}
          >
            {PRICE_RANGES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="hero-type" className={labelCls}>
            Tipe
          </label>
          <div className="flex gap-2">
            <select
              id="hero-type"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${fieldCls} flex-1`}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-laguna-700 px-5 py-2.5 text-sm font-extrabold text-white shadow transition hover:bg-laguna-800 active:scale-95"
            >
              Cari
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
