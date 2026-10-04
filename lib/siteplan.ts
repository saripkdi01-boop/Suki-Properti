import { getSupabase } from "./supabase";

/** GeoJSON Polygon minimal — koordinat [lng, lat] untuk mode geo. */
export interface KavlingPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

export interface SiteplanStatus {
  code: string;
  label: string;
  color_hex: string;
  sort_order: number;
}

export interface SiteplanLocation {
  id: string;
  slug: string;
  name: string;
  property_slug: string | null;
  center_lat: number | null;
  center_lng: number | null;
  default_zoom: number;
  crs_mode: "geo" | "simple";
}

export interface SiteplanKavling {
  id: string;
  code: string;
  status: string;
  polygon: KavlingPolygon;
  land_area_sqm: number | null;
  building_area_sqm: number | null;
  price: number | null;
}

export interface SiteplanData {
  location: SiteplanLocation;
  kavlings: SiteplanKavling[];
  statuses: SiteplanStatus[];
}

function isPolygon(v: unknown): v is KavlingPolygon {
  if (typeof v !== "object" || v === null) return false;
  const p = v as { type?: unknown; coordinates?: unknown };
  return p.type === "Polygon" && Array.isArray(p.coordinates);
}

/**
 * Ambil denah terbit untuk sebuah slug properti.
 * Mengembalikan null bila: kredensial tak ada, tabel belum dimigrasi,
 * lokasi tak ada / tak terbit, atau tak ada kavling valid.
 * Pemanggil WAJIB menyembunyikan komponen bila null (aturan anti-data-kosong).
 */
export async function getSiteplanByPropertySlug(
  propertySlug: string
): Promise<SiteplanData | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data: loc, error: locErr } = await sb
      .from("siteplan_locations")
      .select("id,slug,name,property_slug,center_lat,center_lng,default_zoom,crs_mode")
      .eq("property_slug", propertySlug)
      .eq("is_published", true)
      .maybeSingle();
    if (locErr || !loc) return null;

    const locRow = loc as unknown as SiteplanLocation;
    const [kavRes, statRes] = await Promise.all([
      sb
        .from("siteplan_kavlings")
        .select("id,code,status,polygon,land_area_sqm,building_area_sqm,price")
        .eq("location_id", locRow.id)
        .order("code"),
      sb
        .from("siteplan_statuses")
        .select("code,label,color_hex,sort_order")
        .order("sort_order"),
    ]);

    const kavlings: SiteplanKavling[] = [];
    for (const r of (kavRes.data ?? []) as Record<string, unknown>[]) {
      if (!isPolygon(r.polygon)) continue; // lewati data rusak, jangan crash
      kavlings.push({
        id: String(r.id),
        code: String(r.code),
        status: String(r.status ?? "ready"),
        polygon: r.polygon,
        land_area_sqm: typeof r.land_area_sqm === "number" ? r.land_area_sqm : null,
        building_area_sqm:
          typeof r.building_area_sqm === "number" ? r.building_area_sqm : null,
        price: typeof r.price === "number" ? r.price : null,
      });
    }
    if (kavlings.length === 0) return null;

    return {
      location: {
        ...locRow,
        crs_mode: locRow.crs_mode === "simple" ? "simple" : "geo",
      },
      kavlings,
      statuses: (statRes.data ?? []) as SiteplanStatus[],
    };
  } catch {
    return null; // tabel belum dimigrasi → sembunyikan komponen
  }
}
