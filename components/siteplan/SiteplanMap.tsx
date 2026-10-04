"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { SiteplanKavling } from "@/lib/siteplan";
import { statusColor } from "@/lib/siteplan-status";
import KavlingSheet from "./KavlingSheet";

interface SiteplanMapProps {
  kavlings: SiteplanKavling[];
  /** Warna per kode status; bila kosong dipakai fallback lib/siteplan-status.ts */
  statusColors?: Record<string, string>;
  statusLabels?: Record<string, string>;
  /** [lat, lng] awal — dipakai bila fitBounds gagal atau mode geo tanpa bounds */
  center?: [number, number];
  zoom?: number;
  /** "geo": lat/lng nyata + OSM · "simple": denah skematik tanpa basemap */
  crsMode?: "geo" | "simple";
  className?: string;
}

/** Escape HTML untuk data dari database sebelum masuk tooltip Leaflet. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Peta denah interaktif: polygon kavling berwarna per status (GeoJSON + canvas).
 * Pengganti modern pola SVG-inline sdpcore: ringan, lazy per lokasi, mobile-friendly.
 */
export default function SiteplanMap({
  kavlings,
  statusColors = {},
  statusLabels = {},
  center = [-3.99, 122.52], // Kendari
  zoom = 17,
  crsMode = "geo",
  className = "h-[420px] w-full",
}: SiteplanMapProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);
  const [selected, setSelected] = useState<SiteplanKavling | null>(null);
  const selectRef = useRef(setSelected);

  const colorOf = (code: string): string =>
    statusColors[code] ?? statusColor(code);

  // Inisialisasi peta sekali
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !divRef.current || mapRef.current) return;

      const map =
        crsMode === "simple"
          ? L.map(divRef.current, { crs: L.CRS.Simple, scrollWheelZoom: false })
          : L.map(divRef.current, { scrollWheelZoom: false });
      map.on("focus", () => map.scrollWheelZoom.enable());
      map.on("blur", () => map.scrollWheelZoom.disable());

      if (crsMode === "geo") {
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);
      }

      // GeoJSON dari kavling; koordinat GeoJSON = [lng, lat]
      const features = kavlings.map((k) => ({
        type: "Feature",
        properties: { __kavling: k },
        geometry: k.polygon,
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const layer = (L as any).geoJSON(features, {
        renderer: L.canvas(), // ribuan polygon tetap lancar
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style: (f: any) => ({
          fillColor: colorOf(f?.properties?.__kavling?.status ?? "ready"),
          fillOpacity: 0.75,
          color: "#0f766e",
          weight: 1,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onEachFeature: (f: any, ly: any) => {
          const k = f?.properties?.__kavling as SiteplanKavling | undefined;
          if (!k) return;
          ly.bindTooltip(esc(k.code), {
            permanent: true,
            direction: "center",
            className: "kavling-label",
          });
          ly.on("click", () => selectRef.current(k));
        },
      });
      layer.addTo(map);

      try {
        const b = layer.getBounds();
        if (b && b.isValid()) map.fitBounds(b.pad(0.05));
        else if (crsMode === "geo") map.setView(center, zoom);
      } catch {
        /* abaikan — peta tetap tampil */
      }

      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      <div
        ref={divRef}
        className="h-full w-full rounded-2xl border border-stone-200"
        aria-label="Denah unit interaktif"
      />
      <KavlingSheet
        kavling={selected}
        statusLabel={selected ? statusLabels[selected.status] ?? selected.status : ""}
        statusColorHex={selected ? colorOf(selected.status) : "#ffffff"}
        onClose={() => setSelected(null)}
      />
      <style>{`.kavling-label{background:transparent;border:0;box-shadow:none;font-weight:700;font-size:11px;color:#134e4a;pointer-events:none;}`}</style>
    </div>
  );
}
