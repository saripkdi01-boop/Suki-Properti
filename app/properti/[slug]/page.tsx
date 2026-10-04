import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/detail/Gallery";
import KprSimulator from "@/components/detail/KprSimulator";
import ContactCard from "@/components/detail/ContactCard";
import PropertyCard from "@/components/PropertyCard";
import PropertyMapDynamic from "@/components/PropertyMapDynamic";
import PropertySiteplan from "@/components/detail/PropertySiteplan";
import { BRAND, ATTRIBUTION_TEXT } from "@/lib/brand";
import { getPropertyBySlug, getRelated } from "@/lib/properties";
import { parseDescription } from "@/lib/parse";
import { formatRupiahFull, formatSpek, formatAlamat } from "@/lib/format";

export const dynamic = "force-dynamic";

interface PageParams {
  slug: string;
}

function lokasiMeta(prop: Awaited<ReturnType<typeof getPropertyBySlug>> & {}): string {
  return `${prop.title} di ${formatAlamat({ district: prop.district, regency_name: prop.regency_name })}`;
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  // notFound() di sini (fase metadata, sebelum streaming body) agar status HTTP 404 benar-benar terkirim
  if (!property) notFound();
  const lokasi = lokasiMeta(property);
  const harga = formatRupiahFull(property.price);
  const spek = formatSpek(property);
  return {
    title: `${lokasi} — ${harga} | ${BRAND.name}`,
    description: `${lokasi}. ${spek !== "—" ? spek + ". " : ""}${BRAND.tagline}.`,
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const parsed = parseDescription(property.description);
  const related = await getRelated(property, 4);
  const alamat = formatAlamat({ district: property.district, regency_name: property.regency_name });
  const isSubsidi = property.category === "rumah_subsidi";
  const hasCoords = property.latitude !== null && property.longitude !== null;

  const specRows: { label: string; value: string }[] = [];
  if (property.bedrooms !== null) specRows.push({ label: "Kamar tidur", value: `${property.bedrooms} KT` });
  if (property.bathrooms !== null) specRows.push({ label: "Kamar mandi", value: `${property.bathrooms} KM` });
  if (property.building_area_sqm !== null) specRows.push({ label: "Luas bangunan", value: `${property.building_area_sqm} m²` });
  if (property.land_area_sqm !== null) specRows.push({ label: "Luas tanah", value: `${property.land_area_sqm} m²` });
  if (property.floors !== null) specRows.push({ label: "Jumlah lantai", value: String(property.floors) });
  if (property.certificate_type) specRows.push({ label: "Sertifikat", value: property.certificate_type });
  if (property.subsidy_program) specRows.push({ label: "Program subsidi", value: property.subsidy_program });
  if (property.can_kpr !== null) specRows.push({ label: "Bisa KPR", value: property.can_kpr ? "Ya" : "Tidak" });

  const addressParts = [
    property.address_detail,
    property.subdistrict_name,
    property.district,
    property.regency_name,
  ].filter(Boolean) as string[];
  const alamatPenuh = addressParts.length > 0 ? addressParts.join(", ") : "Sulawesi Tenggara";

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: alamatPenuh,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address_detail ?? undefined,
      addressLocality: property.district ?? undefined,
      addressRegion: property.regency_name ?? undefined,
      addressCountry: "ID",
    },
  };
  if (hasCoords) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: property.latitude,
      longitude: property.longitude,
    };
  }
  if (property.price !== null) {
    jsonLd.offers = {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "IDR",
    };
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="py-4 text-sm text-stone-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-laguna-700">Beranda</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/properti" className="hover:text-laguna-700">Cari Properti</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="truncate font-medium text-stone-700" aria-current="page">
            {property.title}
          </li>
        </ol>
      </nav>

      <Gallery images={property.images} title={property.title} />

      {/* Header harga + nama + alamat */}
      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          {isSubsidi && (
            <span className="rounded-full bg-gold-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-laguna-950">
              Subsidi
            </span>
          )}
          {property.can_kpr && (
            <span className="rounded-full bg-laguna-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-laguna-700">
              Bisa KPR
            </span>
          )}
        </div>
        <p className="mt-2 text-3xl font-extrabold text-laguna-900">{formatRupiahFull(property.price)}</p>
        <h1 className="mt-1 text-xl font-bold text-stone-900">{property.title}</h1>
        <p className="mt-1 text-sm text-stone-600">{alamat}</p>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Kolom kiri */}
        <div className="min-w-0 space-y-8">
          {/* Spesifikasi */}
          {specRows.length > 0 && (
            <section aria-label="Spesifikasi">
              <h2 className="text-lg font-bold text-laguna-900">Spesifikasi</h2>
              <dl className="mt-3 overflow-hidden rounded-2xl border border-stone-200 bg-white">
                {specRows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-2 gap-2 px-4 py-3 text-sm ${i % 2 === 1 ? "bg-stone-50" : ""}`}
                  >
                    <dt className="text-stone-500">{row.label}</dt>
                    <dd className="font-semibold text-stone-800">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Tipe rumah */}
          {parsed.types.length > 0 && (
            <section aria-label="Tipe rumah">
              <h2 className="text-lg font-bold text-laguna-900">Tipe Rumah</h2>
              <div className="mt-3 overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full min-w-[560px] bg-white text-sm">
                  <thead>
                    <tr className="bg-laguna-50 text-left text-xs uppercase tracking-wide text-laguna-800">
                      <th className="px-4 py-3 font-semibold">Tipe</th>
                      <th className="px-4 py-3 font-semibold">Harga</th>
                      <th className="px-4 py-3 font-semibold">LB/LT</th>
                      <th className="px-4 py-3 font-semibold">KT/KM</th>
                      <th className="px-4 py-3 font-semibold">Lantai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.types.map((t) => (
                      <tr key={t.name} className="border-t border-stone-100">
                        <td className="px-4 py-3 font-semibold text-stone-800">
                          {t.name}
                          {t.label && (
                            <span className="ml-2 rounded-full bg-gold-400/30 px-2 py-0.5 text-[11px] font-bold text-laguna-900">
                              {t.label}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-stone-700">{formatRupiahFull(t.price)}</td>
                        <td className="px-4 py-3 text-stone-700">
                          {[t.lb !== null ? `LB ${t.lb} m²` : null, t.lt !== null ? `LT ${t.lt} m²` : null]
                            .filter(Boolean)
                            .join(" / ") || "—"}
                        </td>
                        <td className="px-4 py-3 text-stone-700">
                          {[t.kt !== null ? `${t.kt} KT` : null, t.km !== null ? `${t.km} KM` : null]
                            .filter(Boolean)
                            .join(" / ") || "—"}
                        </td>
                        <td className="px-4 py-3 text-stone-700">{t.floors ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Fasilitas */}
          {property.amenities.length > 0 && (
            <section aria-label="Fasilitas">
              <h2 className="text-lg font-bold text-laguna-900">Fasilitas</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <li
                    key={a}
                    className="rounded-full border border-laguna-200 bg-laguna-50 px-3 py-1.5 text-sm text-laguna-800"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Deskripsi */}
          {property.description && (
            <section aria-label="Deskripsi">
              <h2 className="text-lg font-bold text-laguna-900">Deskripsi</h2>
              <p className="mt-3 whitespace-pre-line rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-relaxed text-stone-700">
                {property.description}
              </p>
            </section>
          )}

          {/* Peta lokasi */}
          {hasCoords && (
            <section aria-label="Peta lokasi">
              <h2 className="text-lg font-bold text-laguna-900">Peta Lokasi</h2>
              <div className="mt-3 overflow-hidden rounded-2xl border border-stone-200">
                <PropertyMapDynamic
                  points={[
                    {
                      lat: property.latitude!,
                      lng: property.longitude!,
                      price: property.price,
                      slug: property.slug,
                      title: property.title,
                    },
                  ]}
                  center={[property.latitude!, property.longitude!]}
                  zoom={15}
                  fitBounds={false}
                  className="h-64 w-full"
                />
              </div>
              {property.maps_link && (
                <a
                  href={property.maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-laguna-600 px-4 py-2.5 text-sm font-semibold text-laguna-700 transition hover:bg-laguna-50"
                >
                  Buka di Google Maps
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
            </section>
          )}

                    {/* Denah unit — disembunyikan otomatis bila tak ada data terbit */}
          <PropertySiteplan propertySlug={property.slug} />

          {/* Atribusi */}
          <section aria-label="Atribusi data" className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs leading-relaxed text-stone-600">{ATTRIBUTION_TEXT}</p>
            {parsed.sourceUrl && (
              <a
                href={parsed.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-laguna-700 hover:text-laguna-900"
              >
                Lihat data asli di SiKumbang
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </section>
        </div>

        {/* Kolom kanan sticky */}
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <KprSimulator price={property.price} isSubsidi={isSubsidi} />
          <ContactCard parsed={parsed} title={property.title} alamat={alamat} />
        </aside>
      </div>

      {/* Properti terkait */}
      {related.length > 0 && (
        <section className="mt-12" aria-label="Properti terkait">
          <h2 className="text-lg font-bold text-laguna-900">Properti Terkait</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
