"use client";

import { useEffect, useState } from "react";
import type { PropertyFilters } from "@/lib/properties";

export interface FilterBarProps {
  filters: PropertyFilters;
  onChange: (patch: Partial<PropertyFilters>) => void;
  regencies: { name: string; count: number }[];
  districts: { name: string; count: number }[];
}

type PriceRangeKey = "all" | "lt150" | "150-200" | "200-300" | "gt300";

const JUTA = 1_000_000;

const PRICE_RANGES: { key: PriceRangeKey; label: string; min?: number; max?: number }[] = [
  { key: "all", label: "Semua harga" },
  { key: "lt150", label: "< Rp150 jt", max: 150 * JUTA },
  { key: "150-200", label: "Rp150–200 jt", min: 150 * JUTA, max: 200 * JUTA },
  { key: "200-300", label: "Rp200–300 jt", min: 200 * JUTA, max: 300 * JUTA },
  { key: "gt300", label: "> Rp300 jt", min: 300 * JUTA },
];

function priceRangeKeyOf(filters: PropertyFilters): PriceRangeKey {
  const found = PRICE_RANGES.find(
    (r) => (r.min ?? undefined) === filters.priceMin && (r.max ?? undefined) === filters.priceMax
  );
  return found?.key ?? "all";
}

const selectClass =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-800 shadow-sm focus:border-laguna-500 focus:outline-none focus:ring-2 focus:ring-laguna-200 disabled:cursor-not-allowed disabled:opacity-50";

export default function FilterBar({ filters, onChange, regencies, districts }: FilterBarProps) {
  const [qLocal, setQLocal] = useState(filters.q ?? "");
  const [prevExternalQ, setPrevExternalQ] = useState(filters.q ?? "");

  // Sinkron saat filter kata kunci berubah dari luar (mis. tombol Reset):
  // penyesuaian state saat render — pola resmi React untuk props yang berubah.
  if (prevExternalQ !== (filters.q ?? "")) {
    setPrevExternalQ(filters.q ?? "");
    setQLocal(filters.q ?? "");
  }

  // Debounce 400ms: kirim perubahan kata kunci ke parent.
  useEffect(() => {
    const current = filters.q ?? "";
    if (qLocal === current) return;
    const t = setTimeout(() => {
      onChange({ q: qLocal.trim() ? qLocal.trim() : undefined });
    }, 400);
    return () => clearTimeout(t);
  }, [qLocal, filters.q, onChange]);

  const handlePriceRange = (key: PriceRangeKey) => {
    const r = PRICE_RANGES.find((x) => x.key === key);
    onChange({ priceMin: r?.min, priceMax: r?.max });
  };

  return (
    <div className="sticky top-16 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 py-3 sm:grid-cols-3 lg:grid-cols-7 lg:px-6">
        <label className="col-span-2 sm:col-span-3 lg:col-span-2">
          <span className="sr-only">Kata kunci</span>
          <input
            type="search"
            value={qLocal}
            onChange={(e) => setQLocal(e.target.value)}
            placeholder="Cari nama perumahan, alamat…"
            className={selectClass}
          />
        </label>

        <label>
          <span className="sr-only">Kabupaten / Kota</span>
          <select
            value={filters.regency ?? ""}
            onChange={(e) =>
              onChange({ regency: e.target.value || undefined, district: undefined })
            }
            className={selectClass}
          >
            <option value="">Semua Kab/Kota</option>
            {regencies.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name} ({r.count})
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Kecamatan</span>
          <select
            value={filters.district ?? ""}
            onChange={(e) => onChange({ district: e.target.value || undefined })}
            disabled={!filters.regency}
            className={selectClass}
          >
            <option value="">Semua Kecamatan</option>
            {districts.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} ({d.count})
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Kisaran harga</span>
          <select
            value={priceRangeKeyOf(filters)}
            onChange={(e) => handlePriceRange(e.target.value as PriceRangeKey)}
            className={selectClass}
          >
            {PRICE_RANGES.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Tipe properti</span>
          <select
            value={filters.category ?? ""}
            onChange={(e) =>
              onChange({
                category: e.target.value
                  ? (e.target.value as "rumah_subsidi" | "properti_developer")
                  : undefined,
              })
            }
            className={selectClass}
          >
            <option value="">Semua Tipe</option>
            <option value="rumah_subsidi">Subsidi</option>
            <option value="properti_developer">Komersil</option>
          </select>
        </label>

        <label>
          <span className="sr-only">Kamar tidur minimal</span>
          <select
            value={filters.bedroomsMin ?? ""}
            onChange={(e) =>
              onChange({ bedroomsMin: e.target.value ? Number(e.target.value) : undefined })
            }
            className={selectClass}
          >
            <option value="">KT: Semua</option>
            <option value="1">KT: 1+</option>
            <option value="2">KT: 2+</option>
            <option value="3">KT: 3+</option>
          </select>
        </label>

        <label>
          <span className="sr-only">Urutkan</span>
          <select
            value={filters.sort ?? "terbaru"}
            onChange={(e) =>
              onChange({ sort: e.target.value as "terbaru" | "termurah" | "termahal" })
            }
            className={selectClass}
          >
            <option value="terbaru">Terbaru</option>
            <option value="termurah">Termurah</option>
            <option value="termahal">Termahal</option>
          </select>
        </label>
      </div>
    </div>
  );
}
