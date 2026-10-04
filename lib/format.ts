/** Format rupiah ringkas untuk kartu & pin peta: 173000000 -> "Rp 173 jt". */
export function formatRupiahShort(price: number | null | undefined): string {
  if (price === null || price === undefined) return "Hubungi marketing";
  if (price >= 1_000_000) {
    const jt = price / 1_000_000;
    const rounded = Math.round(jt * 10) / 10;
    return `Rp ${String(rounded).replace(".", ",")} jt`;
  }
  if (price >= 1000) return `Rp ${Math.round(price / 1000)} rb`;
  return `Rp ${price.toLocaleString("id-ID")}`;
}

/** Format rupiah penuh untuk halaman detail: 173000000 -> "Rp 173.000.000". */
export function formatRupiahFull(price: number | null | undefined): string {
  if (price === null || price === undefined) return "Hubungi marketing";
  return `Rp ${Math.round(price).toLocaleString("id-ID")}`;
}

/** Spek ringkas "2 KT · 1 KM · LT 91 m²". Bagian yang null dilewati (tidak dikarang). */
export function formatSpek(p: {
  bedrooms?: number | null;
  bathrooms?: number | null;
  building_area_sqm?: number | null;
  land_area_sqm?: number | null;
}): string {
  const parts: string[] = [];
  if (p.bedrooms) parts.push(`${p.bedrooms} KT`);
  if (p.bathrooms) parts.push(`${p.bathrooms} KM`);
  if (p.building_area_sqm) parts.push(`LB ${p.building_area_sqm} m²`);
  if (p.land_area_sqm) parts.push(`LT ${p.land_area_sqm} m²`);
  return parts.join(" · ") || "—";
}

/** Alamat ringkas: "Kambu, Kota Kendari". */
export function formatAlamat(p: {
  district?: string | null;
  regency_name?: string | null;
  city?: string | null;
}): string {
  const parts = [p.district, p.regency_name ?? p.city].filter(Boolean) as string[];
  return parts.join(", ") || "Sulawesi Tenggara";
}

/**
 * Hitung cicilan KPR per bulan dengan rumus anuitas standar.
 * @param hargaPlafon total harga properti
 * @param dpPersen uang muka dalam persen (0-100)
 * @param tenorTahun lama kredit dalam tahun
 * @param bungaPersen suku bunga tahunan (flat input, dihitung efektif bulanan)
 */
export function hitungCicilanKPR(
  hargaPlafon: number,
  dpPersen: number,
  tenorTahun: number,
  bungaPersen: number
): { pokok: number; cicilan: number; totalBunga: number } {
  const pokok = Math.max(0, hargaPlafon * (1 - Math.min(100, Math.max(0, dpPersen)) / 100));
  const n = Math.max(1, Math.round(tenorTahun * 12));
  const r = Math.max(0, bungaPersen) / 100 / 12;
  let cicilan: number;
  if (r === 0) {
    cicilan = pokok / n;
  } else {
    const factor = Math.pow(1 + r, n);
    cicilan = (pokok * r * factor) / (factor - 1);
  }
  return { pokok, cicilan, totalBunga: Math.max(0, cicilan * n - pokok) };
}
