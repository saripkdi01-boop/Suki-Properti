import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { getProperties, getRegencies, getStats } from "@/lib/properties";
import PropertyCard from "@/components/PropertyCard";
import PropertyMapDynamic from "@/components/PropertyMapDynamic";
import type { MapPoint } from "@/components/PropertyMap";
import HeroSearch from "@/components/home/HeroSearch";

export const metadata: Metadata = {
  title: "Beranda",
  description: BRAND.description,
};

function MapPinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function HomeIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function BuildingIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M9 21v-4h6v4" />
      <path d="M8 7h2M8 11h2M14 7h2M14 11h2M8 15h2M14 15h2" />
    </svg>
  );
}

const STEPS = [
  {
    no: "1",
    title: "Cari",
    desc: "Filter perumahan berdasarkan wilayah, kisaran harga, dan tipe subsidi atau komersil.",
  },
  {
    no: "2",
    title: "Bandingkan",
    desc: "Lihat spek, harga, dan lokasi tiap perumahan di peta Sulawesi Tenggara.",
  },
  {
    no: "3",
    title: "Hubungi marketing",
    desc: "Hubungi kontak resmi developer untuk survei lokasi dan proses KPR.",
  },
];

export default async function Home() {
  const [stats, regencies, featured] = await Promise.all([
    getStats(),
    getRegencies(),
    getProperties({}, 1, 8),
  ]);

  const topRegencies = regencies.slice(0, 6);
  const mapPoints: MapPoint[] = featured.items
    .filter((p) => p.latitude !== null && p.longitude !== null)
    .map((p) => ({
      lat: p.latitude as number,
      lng: p.longitude as number,
      price: p.price,
      slug: p.slug,
      title: p.title,
    }));

  const hasData = stats.total > 0;
  const fmt = (n: number) => n.toLocaleString("id-ID");

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-laguna-900 via-laguna-800 to-laguna-700">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Temukan Rumah Impian di Sulawesi Tenggara
            </h1>
            <p className="mt-3 text-base text-laguna-100 sm:text-lg">
              {BRAND.tagline}: jelajahi perumahan subsidi dan komersil berdasarkan
              wilayah, harga, dan peta.
            </p>
          </div>
          <HeroSearch regencies={regencies} />

          {/* Strip statistik — angka asli dari database, tanpa dikarang */}
          {hasData ? (
            <p className="text-sm font-semibold text-laguna-100">
              <span className="font-extrabold text-white">{fmt(stats.total)}</span> perumahan
              terdaftar
              <span className="mx-2 text-laguna-400">·</span>
              <span className="font-extrabold text-white">{fmt(stats.subsidi)}</span> rumah
              subsidi
              <span className="mx-2 text-laguna-400">·</span>
              <span className="font-extrabold text-white">{fmt(stats.regencies)}</span>{" "}
              kab/kota
            </p>
          ) : (
            <p className="text-sm text-laguna-200">
              Data perumahan sedang disiapkan — daftar direktori akan tampil di sini
              setelah terhubung ke database.
            </p>
          )}
        </div>
      </section>

      {/* ── Shortcut kategori & wilayah ──────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-xl font-extrabold tracking-tight text-stone-900">
          Jelajahi berdasarkan kategori
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          <Link
            href="/properti?category=rumah_subsidi"
            className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-md sm:p-5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-400/20 text-gold-600">
              <HomeIcon />
            </span>
            <span>
              <span className="block font-extrabold text-stone-900">Rumah Subsidi</span>
              <span className="block text-xs text-stone-500 sm:text-sm">
                Program pemerintah, harga terjangkau
              </span>
            </span>
          </Link>
          <Link
            href="/properti?category=properti_developer"
            className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-laguna-400 hover:shadow-md sm:p-5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-laguna-100 text-laguna-700">
              <BuildingIcon />
            </span>
            <span>
              <span className="block font-extrabold text-stone-900">Komersil</span>
              <span className="block text-xs text-stone-500 sm:text-sm">
                Dari developer, bebas pilih tipe
              </span>
            </span>
          </Link>
        </div>

        {topRegencies.length > 0 && (
          <>
            <h2 className="mt-8 text-xl font-extrabold tracking-tight text-stone-900">
              Wilayah populer
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {topRegencies.map((r) => (
                <Link
                  key={r.name}
                  href={`/properti?regency=${encodeURIComponent(r.name)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-laguna-800 shadow-sm transition hover:border-laguna-500 hover:bg-laguna-50"
                >
                  <MapPinIcon />
                  {r.name}
                  <span className="text-xs font-bold text-stone-400">{fmt(r.count)}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Unggulan terbaru ─────────────────────────────── */}
      <section className="bg-stone-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-extrabold tracking-tight text-stone-900">
              Unggulan terbaru
            </h2>
            <Link
              href="/properti"
              className="shrink-0 text-sm font-bold text-laguna-700 hover:text-laguna-800 hover:underline"
            >
              Lihat semua →
            </Link>
          </div>
          {featured.items.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {featured.items.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
              <p className="font-bold text-stone-700">Belum ada listing unggulan</p>
              <p className="mt-1 text-sm text-stone-500">
                Daftar perumahan terbaru akan tampil di sini setelah data tersedia.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Preview peta ─────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-xl font-extrabold tracking-tight text-stone-900">
          Jelajahi di peta
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Pin harga perumahan di Sulawesi Tenggara — klik pin untuk detail.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 shadow-sm">
          {mapPoints.length > 0 ? (
            <PropertyMapDynamic points={mapPoints} fitBounds className="h-72 w-full" />
          ) : (
            <div className="flex h-72 w-full items-center justify-center bg-laguna-50 px-6 text-center">
              <p className="max-w-md text-sm text-stone-500">
                Peta akan menampilkan pin lokasi perumahan setelah data tersedia.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Cara kerja ───────────────────────────────────── */}
      <section className="bg-laguna-950">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="text-center text-xl font-extrabold tracking-tight text-white">
            Cara kerja {BRAND.name}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.no}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 text-lg font-extrabold text-laguna-950">
                  {s.no}
                </span>
                <h3 className="mt-3 font-extrabold text-white">{s.title}</h3>
                <p className="mt-1 text-sm text-laguna-100">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-br from-laguna-800 to-laguna-600 px-6 py-12 text-center shadow-lg">
          <h2 className="max-w-xl text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Siap menemukan perumahan yang pas untukmu?
          </h2>
          <p className="max-w-lg text-sm text-laguna-100 sm:text-base">
            Telusuri direktori lengkap dengan filter wilayah, harga, dan peta
            interaktif.
          </p>
          <Link
            href="/properti"
            className="rounded-xl bg-gold-400 px-8 py-3 text-sm font-extrabold text-laguna-950 shadow transition hover:bg-gold-300 active:scale-95"
          >
            Jelajahi semua properti
          </Link>
        </div>
      </section>
    </div>
  );
}
