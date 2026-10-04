/**
 * Warna status kavling — fallback bila tabel `siteplan_statuses` tak terbaca.
 * Sumber: audit read-only sdpcore.com (Okt 2026).
 */
export const SITEPLAN_STATUS_COLORS: Record<string, string> = {
  ready: "#ffffff",
  booking: "#00c853",
  booking_fee: "#ffff80",
  on_proses_bank: "#ff7300",
  sp3k: "#6ab5ff",
  akad: "#fb00ff",
  serah_terima: "#800040",
  user_cancel: "#ffffff",
  pembelian_cash: "#00ffd5",
};

/** Kembalikan hex warna untuk kode status; default putih (Ready). */
export function statusColor(code: string | null | undefined): string {
  if (!code) return SITEPLAN_STATUS_COLORS.ready;
  return SITEPLAN_STATUS_COLORS[code] ?? SITEPLAN_STATUS_COLORS.ready;
}
