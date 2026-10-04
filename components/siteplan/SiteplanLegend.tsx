import type { SiteplanStatus } from "@/lib/siteplan";

interface SiteplanLegendProps {
  statuses: SiteplanStatus[];
}

/**
 * Legenda status denah — datanya dari DB (siteplan_statuses), bukan hardcode.
 * Tambah/ubah status cukup via database, tanpa deploy ulang.
 */
export default function SiteplanLegend({ statuses }: SiteplanLegendProps) {
  if (statuses.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2" aria-label="Legenda status kavling">
      {statuses.map((s) => (
        <span
          key={s.code}
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs text-stone-700"
        >
          <span
            className="inline-block h-3 w-3 rounded-sm border border-stone-300"
            style={{ backgroundColor: s.color_hex }}
          />
          {s.label}
        </span>
      ))}
    </div>
  );
}
