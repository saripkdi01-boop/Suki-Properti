import { getSupabase } from "./supabase";

export type PropertyCategory = "rumah_subsidi" | "properti_developer";

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  province: string | null;
  city: string | null;
  regency_name: string | null;
  district: string | null;
  subdistrict_name: string | null;
  address_detail: string | null;
  latitude: number | null;
  longitude: number | null;
  maps_link: string | null;
  price: number | null;
  price_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  building_area_sqm: number | null;
  land_area_sqm: number | null;
  floors: number | null;
  images: string[];
  amenities: string[];
  subsidy_program: string | null;
  can_kpr: boolean | null;
  certificate_type: string | null;
  category: PropertyCategory | string;
  property_type: string | null;
  status: string | null;
  published_at: string | null;
}

export interface PropertyFilters {
  q?: string;
  regency?: string;
  district?: string;
  priceMin?: number;
  priceMax?: number;
  category?: PropertyCategory;
  bedroomsMin?: number;
  sort?: "terbaru" | "termurah" | "termahal";
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

const SELECT =
  "id,title,slug,description,province,city,regency_name,district,subdistrict_name,address_detail,latitude,longitude,maps_link,price,price_type,bedrooms,bathrooms,building_area_sqm,land_area_sqm,floors,images,amenities,subsidy_program,can_kpr,certificate_type,category,property_type,status,published_at";

const STATUS_ACTIVE = "available"; // nilai status aktual di DB production (bukan 'active')
const PER_PAGE = 24;

function normalize(row: Record<string, unknown>): Property {
  return {
    ...(row as object),
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    amenities: Array.isArray(row.amenities) ? (row.amenities as string[]) : [],
  } as Property;
}

/** Daftar properti dengan filter + paginasi. Harga NULL selalu ikut kecuali filter harga aktif. */
export async function getProperties(
  filters: PropertyFilters = {},
  page = 1,
  perPage = PER_PAGE
): Promise<PagedResult<Property>> {
  const empty: PagedResult<Property> = { items: [], total: 0, page, perPage, totalPages: 0 };
  const sb = getSupabase();
  if (!sb) return empty;

  let query = sb.from("properties").select(SELECT, { count: "exact" }).eq("status", STATUS_ACTIVE);

  if (filters.q) {
    const q = filters.q.trim();
    if (q) query = query.or(`title.ilike.%${q}%,address_detail.ilike.%${q}%,district.ilike.%${q}%`);
  }
  if (filters.regency) query = query.eq("regency_name", filters.regency);
  if (filters.district) query = query.eq("district", filters.district);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.bedroomsMin) query = query.gte("bedrooms", filters.bedroomsMin);
  // Filter harga: baris price NULL otomatis tersisih oleh SQL (tidak dikarang, tidak dihapus diam-diam)
  if (filters.priceMin !== undefined) query = query.gte("price", filters.priceMin);
  if (filters.priceMax !== undefined) query = query.lte("price", filters.priceMax);

  switch (filters.sort) {
    case "termurah":
      query = query.order("price", { ascending: true, nullsFirst: false });
      break;
    case "termahal":
      query = query.order("price", { ascending: false, nullsFirst: false });
      break;
    case "terbaru":
    default:
      query = query.order("published_at", { ascending: false });
      break;
  }

  const from = (page - 1) * perPage;
  const { data, count, error } = await query.range(from, from + perPage - 1);
  if (error) {
    console.error("[getProperties]", error.message);
    return empty;
  }
  const total = count ?? 0;
  return {
    items: (data ?? []).map(normalize),
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

/** Detail satu properti berdasarkan slug. */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("properties")
    .select(SELECT)
    .eq("slug", slug)
    .eq("status", STATUS_ACTIVE)
    .maybeSingle();
  if (error || !data) return null;
  return normalize(data as Record<string, unknown>);
}

/** Daftar kabupaten/kota unik beserta jumlah listing — JANGAN hardcode. */
export async function getRegencies(): Promise<{ name: string; count: number }[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("properties")
    .select("regency_name")
    .eq("status", STATUS_ACTIVE)
    .limit(1000);
  if (error || !data) return [];
  const counts = new Map<string, number>();
  for (const r of data as { regency_name: string | null }[]) {
    if (r.regency_name) counts.set(r.regency_name, (counts.get(r.regency_name) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/** Daftar kecamatan unik dalam satu kabupaten/kota. */
export async function getDistricts(regency: string): Promise<{ name: string; count: number }[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("properties")
    .select("district")
    .eq("status", STATUS_ACTIVE)
    .eq("regency_name", regency)
    .limit(1000);
  if (error || !data) return [];
  const counts = new Map<string, number>();
  for (const r of data as { district: string | null }[]) {
    if (r.district) counts.set(r.district, (counts.get(r.district) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, "id"));
}

/** Properti terkait: kab/kota sama dulu, dilengkapi kategori sama bila kurang. */
export async function getRelated(prop: Property, limit = 4): Promise<Property[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const out: Property[] = [];
  if (prop.regency_name) {
    const { data } = await sb
      .from("properties")
      .select(SELECT)
      .eq("status", STATUS_ACTIVE)
      .eq("regency_name", prop.regency_name)
      .neq("id", prop.id)
      .order("published_at", { ascending: false })
      .limit(limit);
    for (const r of (data ?? []) as Record<string, unknown>[]) out.push(normalize(r));
  }
  if (out.length < limit) {
    const { data } = await sb
      .from("properties")
      .select(SELECT)
      .eq("status", STATUS_ACTIVE)
      .eq("category", prop.category)
      .neq("id", prop.id)
      .order("published_at", { ascending: false })
      .limit(limit * 2);
    for (const r of (data ?? []) as Record<string, unknown>[]) {
      if (out.length >= limit) break;
      if (!out.some((p) => p.id === (r.id as string))) out.push(normalize(r));
    }
  }
  return out;
}

/** Statistik jujur dari DB untuk homepage — bukan angka mati. */
export async function getStats(): Promise<{ total: number; subsidi: number; regencies: number }> {
  const sb = getSupabase();
  if (!sb) return { total: 0, subsidi: 0, regencies: 0 };
  const [all, sub, regs] = await Promise.all([
    sb.from("properties").select("id", { count: "exact", head: true }).eq("status", STATUS_ACTIVE),
    sb
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("status", STATUS_ACTIVE)
      .eq("category", "rumah_subsidi"),
    getRegencies(),
  ]);
  return { total: all.count ?? 0, subsidi: sub.count ?? 0, regencies: regs.length };
}

/** Semua slug untuk sitemap. */
export async function getAllSlugs(): Promise<string[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("properties")
    .select("slug")
    .eq("status", STATUS_ACTIVE)
    .limit(2000);
  if (error || !data) return [];
  return (data as { slug: string }[]).map((r) => r.slug).filter(Boolean);
}
