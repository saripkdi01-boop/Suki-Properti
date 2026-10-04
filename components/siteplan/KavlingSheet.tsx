"use client";

import type { SiteplanKavling } from "@/lib/siteplan";

interface KavlingSheetProps {
  kavling: SiteplanKavling | null;
  statusLabel: string;
  statusColorHex: string;
  onClose: () => void;
}

function formatRupiah(n: number): string {
  return "Rp" + n.toLocaleString("id-ID");
}

/**
 * Detail kavling saat polygon diklik — bottom sheet di mobile, modal di desktop.
 * Setara modal "Detail Data Kavling" sdpcore, versi PUBLIK (tanpa data customer).
 */
export default function KavlingSheet({
  kavling,
  statusLabel,
  statusColorHex,
  onClose,
}: KavlingSheetProps) {
  if (!kavling) return null;
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/50 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail kavling ${kavling.code}`}
    >
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-5 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-stone-500">Kavling</p>
            <h3 className="text-xl font-bold text-stone-900">{kavling.code}</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-700">
            <span
              className="inline-block h-3 w-3 rounded-sm border border-stone-300"
              style={{ backgroundColor: statusColorHex }}
            />
            {statusLabel}
          </span>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-stone-500">Luas Tanah</dt>
            <dd className="font-semibold text-stone-900">
              {kavling.land_area_sqm != null ? `${kavling.land_area_sqm} m²` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-stone-500">Luas Bangunan</dt>
            <dd className="font-semibold text-stone-900">
              {kavling.building_area_sqm != null ? `${kavling.building_area_sqm} m²` : "—"}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-stone-500">Harga</dt>
            <dd className="text-lg font-bold text-teal-800">
              {kavling.price != null ? formatRupiah(kavling.price) : "Hubungi marketing"}
            </dd>
          </div>
        </dl>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-teal-700 py-2.5 font-semibold text-white hover:bg-teal-800"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
