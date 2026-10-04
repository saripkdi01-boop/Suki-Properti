"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Property, PropertyCategory, PropertyFilters } from "@/lib/properties";
import { getProperties, getRegencies, getDistricts } from "@/lib/properties";
import PropertyCard from "@/components/PropertyCard";
import PropertyMapDynamic from "@/components/PropertyMapDynamic";
import type { MapPoint } from "@/components/PropertyMap";
import FilterBar from "./FilterBar";

const PER_PAGE = 24;

function parseNum(v: string | null): number | undefined {
  if (v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function parseSort(v: string | null): PropertyFilters["sort"] {
  return v === "termurah" || v === "termahal" || v === "terbaru" ? v : undefined;
}

function parseCategory(v: string | null): PropertyCategory | undefined {
  return v === "rumah_subsidi" || v === "properti_developer" ? v : undefined;
}

/** Bangun state filter awal dari query string URL agar tautan bisa di-share. */
function initialState(sp: URLSearchParams): { filters: PropertyFilters; page: number } {
  return {
    filters: {
      q: sp.get("q") ?? undefined,
      regency: sp.get("regency") ?? undefined,
      district: sp.get("district") ?? undefined,
      priceMin: parseNum(sp.get("priceMin")),
      priceMax: parseNum(sp.get("priceMax")),
      category: parseCategory(sp.get("category")),
      bedroomsMin: parseNum(sp.get("bedroomsMin")),
      sort: parseSort(sp.get("sort")),
    },
    page: Math.max(1, parseNum(sp.get("page")) ?? 1),
  };
}

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div className="aspect-[4/3] w-full bg-stone-200" />
      <div className="space-y-2 p-4">
        <div className="h-5 w-2/3 rounded bg-stone-200" />
        <div className="h-4 w-full rounded bg-stone-200" />
        <div className="h-3 w-1/2 rounded bg-stone-200" />
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-laguna-100 text-laguna-700">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.8-3.8" strokeLinecap="round" />
        </svg>
      </span>
      <h2 className="text-lg font-bold text-stone-800">Tidak ada hasil</h2>
      <p className="max-w-sm text-sm text-stone-500">
        Coba longgarkan filter harga atau hapus kata kunci.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-1 rounded-full bg-laguna-700 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-laguna-800"
      >
        Reset filter
      </button>
    </div>
  );
}

export default function PropertiExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [initial] = useState(() => initialState(searchParams));
  const [filters, setFilters] = useState<PropertyFilters>(initial.filters);
  const [page, setPage] = useState<number>(initial.page);
  const [items, setItems] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [regencies, setRegencies] = useState<{ name: string; count: number }[]>([]);
  const [districts, setDistricts] = useState<{ name: string; count: number }[]>([]);
  const [tab, setTab] = useState<"daftar" | "peta">("daftar");

  // Ambil daftar kab/kota sekali saat mount (bukan hardcode).
  useEffect(() => {
    let cancelled = false;
    getRegencies().then((r) => {
      if (!cancelled) setRegencies(r);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Ambil kecamatan setiap kab/kota berubah. Pengosongan daftar saat regency
  // dikosongkan ditangani di handleFilterChange (event handler, bukan effect).
  useEffect(() => {
    if (!filters.regency) return;
    let cancelled = false;
    getDistricts(filters.regency).then((d) => {
      if (!cancelled) setDistricts(d);
    });
    return () => {
      cancelled = true;
    };
  }, [filters.regency]);

  // Fetch data setiap filter / halaman berubah.
  useEffect(() => {
    let cancelled = false;
    getProperties(filters, page, PER_PAGE).then((res) => {
      if (cancelled) return;
      setItems(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  // Sinkronkan filter + halaman ke URL agar tautan bisa di-share.
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.regency) params.set("regency", filters.regency);
    if (filters.district) params.set("district", filters.district);
    if (filters.priceMin !== undefined) params.set("priceMin", String(filters.priceMin));
    if (filters.priceMax !== undefined) params.set("priceMax", String(filters.priceMax));
    if (filters.category) params.set("category", filters.category);
    if (filters.bedroomsMin !== undefined) params.set("bedroomsMin", String(filters.bedroomsMin));
    if (filters.sort) params.set("sort", filters.sort);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(qs ? `/properti?${qs}` : "/properti", { scroll: false });
  }, [filters, page, router]);

  const handleFilterChange = (patch: Partial<PropertyFilters>) => {
    setLoading(true);
    // Regency dikosongkan → daftar kecamatan ikut dikosongkan di sini
    // (agar tidak perlu setState di dalam effect).
    if ("regency" in patch && patch.regency !== filters.regency) {
      setDistricts([]);
    }
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1); // reset ke halaman 1 setiap filter berubah
  };

  const goPage = (p: number) => {
    setLoading(true);
    setPage(p);
  };

  const handleReset = () => {
    setLoading(true);
    setDistricts([]);
    setFilters({});
    setPage(1);
  };

  // Pin peta selalu sinkron dengan item halaman yang sedang tampil.
  const points: MapPoint[] = useMemo(
    () =>
      items
        .filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
        .map((p) => ({
          lat: p.latitude as number,
          lng: p.longitude as number,
          price: p.price,
          slug: p.slug,
          title: p.title,
        })),
    [items]
  );

  const showFrom = total === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const showTo = Math.min(page * PER_PAGE, total);

  const mapPane = (
    <div className="lg:sticky lg:top-24">
      <PropertyMapDynamic
        points={points}
        fitBounds
        className="h-[70vh] w-full lg:h-[calc(100vh-8rem)]"
      />
    </div>
  );

  return (
    <div>
      <FilterBar filters={filters} onChange={handleFilterChange} regencies={regencies} districts={districts} />

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-laguna-900">
              Cari Properti
            </h1>
            {!loading && (
              <p className="mt-1 text-sm text-stone-500">
                {total} perumahan ditemukan
              </p>
            )}
          </div>
          {/* Tab Daftar / Peta — hanya mobile */}
          <div className="grid grid-cols-2 rounded-full border border-stone-200 bg-white p-1 lg:hidden">
            {(["daftar", "peta"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                aria-pressed={tab === t}
                className={`rounded-full px-5 py-1.5 text-sm font-bold transition ${
                  tab === t ? "bg-laguna-700 text-white shadow" : "text-stone-500"
                }`}
              >
                {t === "daftar" ? "Daftar" : "Peta"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Panel daftar */}
          <section className={tab === "daftar" ? "" : "hidden lg:block"} aria-label="Daftar properti">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : total === 0 ? (
              <EmptyState onReset={handleReset} />
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  {items.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>

                <nav className="mt-8 flex flex-col items-center gap-2" aria-label="Paginasi">
                  <p className="text-sm text-stone-500">
                    Menampilkan {showFrom}–{showTo} dari {total}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={page <= 1 || loading}
                      onClick={() => goPage(Math.max(1, page - 1))}
                      className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-700 shadow-sm hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ← Sebelumnya
                    </button>
                    <span className="text-sm font-semibold text-stone-600">
                      Halaman {page} dari {Math.max(totalPages, 1)}
                    </span>
                    <button
                      type="button"
                      disabled={page >= totalPages || loading}
                      onClick={() => goPage(page + 1)}
                      className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-700 shadow-sm hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Berikutnya →
                    </button>
                  </div>
                </nav>
              </>
            )}
          </section>

          {/* Peta */}
          <aside className={tab === "peta" ? "" : "hidden lg:block"} aria-label="Peta properti">
            {mapPane}
          </aside>
        </div>
      </div>
    </div>
  );
}
