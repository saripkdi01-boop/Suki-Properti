import SiteplanMapDynamic from "@/components/siteplan/SiteplanMapDynamic";
import SiteplanLegend from "@/components/siteplan/SiteplanLegend";
import SiteplanPrintButton from "@/components/siteplan/SiteplanPrintButton";
import { getSiteplanByPropertySlug } from "@/lib/siteplan";

interface PropertySiteplanProps {
  propertySlug: string;
}

/**
 * Seksi "Denah Unit" di halaman detail properti.
 * Mengembalikan null (tak merender apa pun) bila tak ada denah terbit —
 * sesuai aturan anti-data-kosong. Aman dipanggil walau tabel siteplan
 * belum dimigrasi (query gagal → null → disembunyikan).
 */
export default async function PropertySiteplan({
  propertySlug,
}: PropertySiteplanProps) {
  const data = await getSiteplanByPropertySlug(propertySlug);
  if (!data) return null;

  const { location, kavlings, statuses } = data;
  const statusColors: Record<string, string> = {};
  const statusLabels: Record<string, string> = {};
  for (const s of statuses) {
    statusColors[s.code] = s.color_hex;
    statusLabels[s.code] = s.label;
  }
  const center: [number, number] | undefined =
    location.center_lat !== null && location.center_lng !== null
      ? [location.center_lat, location.center_lng]
      : undefined;

  return (
    <section aria-label="Denah unit" className="siteplan-section">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-laguna-900">Denah Unit</h2>
        <SiteplanPrintButton />
      </div>
      <p className="mt-1 text-sm text-stone-600">
        {location.name} — klik kavling pada denah untuk melihat detail.
      </p>
      <div className="mt-3">
        <SiteplanLegend statuses={statuses} />
      </div>
      <div className="mt-3 overflow-hidden rounded-2xl border border-stone-200">
        <SiteplanMapDynamic
          kavlings={kavlings}
          statusColors={statusColors}
          statusLabels={statusLabels}
          center={center}
          zoom={location.default_zoom}
          crsMode={location.crs_mode}
          className="h-[420px] w-full"
        />
      </div>
      <style>{`@media print{.siteplan-section .leaflet-container{height:60vh!important}}`}</style>
    </section>
  );
}
