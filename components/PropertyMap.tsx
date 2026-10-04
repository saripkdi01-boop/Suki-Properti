"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { formatRupiahShort } from "@/lib/format";

export interface MapPoint {
  lat: number;
  lng: number;
  price: number | null;
  slug: string;
  title: string;
}

interface PropertyMapProps {
  points: MapPoint[];
  /** [lat, lng] awal — dipakai bila fitBounds=false atau points kosong */
  center?: [number, number];
  zoom?: number;
  /** true: zoom otomatis mencakup semua pin */
  fitBounds?: boolean;
  className?: string;
}

/** Escape HTML untuk judul dari database sebelum masuk popup Leaflet. */
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export default function PropertyMap({
  points,
  center = [-3.99, 122.52], // Kendari
  zoom = 9,
  fitBounds = true,
  className = "h-[420px] w-full",
}: PropertyMapProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);
  const layerRef = useRef<{ clearLayers: () => void; addTo: (m: unknown) => void } | null>(null);

  // Inisialisasi peta sekali
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet.markercluster");
      if (cancelled || !divRef.current || mapRef.current) return;
      const map = L.map(divRef.current, { scrollWheelZoom: false }).setView(center, zoom);
      map.on("focus", () => map.scrollWheelZoom.enable());
      map.on("blur", () => map.scrollWheelZoom.disable());
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cluster = (L as any).markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 48 });
      cluster.addTo(map);
      layerRef.current = cluster;
      renderPoints();
    })();

    function renderPoints() {
      // dipanggil ulang oleh effect kedua via custom event sederhana
      window.dispatchEvent(new CustomEvent("sp:map-ready"));
    }

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render ulang pin setiap points berubah
  useEffect(() => {
    let alive = true;
    const draw = async () => {
      if (!alive || !mapRef.current || !layerRef.current) return;
      const L = (await import("leaflet")).default;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const map = mapRef.current as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cluster = layerRef.current as any;
      cluster.clearLayers();
      const bounds: [number, number][] = [];
      for (const p of points) {
        if (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)) continue;
        bounds.push([p.lat, p.lng]);
        const label = p.price === null ? "Hubungi" : formatRupiahShort(p.price);
        const icon = L.divIcon({
          className: "sp-price-pin-wrap",
          html: `<div class="sp-price-pin${p.price === null ? " no-price" : ""}">${esc(label)}</div>`,
          iconSize: [0, 0],
        });
        const marker = L.marker([p.lat, p.lng], { icon });
        marker.bindPopup(
          `<a href="/properti/${esc(p.slug)}" style="text-decoration:none">` +
            `<span class="sp-popup-title">${esc(p.title)}</span>` +
            `<span class="sp-popup-price">${esc(formatRupiahShort(p.price))}</span>` +
            `</a>`
        );
        cluster.addLayer(marker);
      }
      if (fitBounds && bounds.length > 0) {
        map.fitBounds(L.latLngBounds(bounds as [number, number][]).pad(0.15));
      } else if (bounds.length === 0) {
        map.setView(center, zoom);
      }
    };
    if (mapRef.current) {
      draw();
    } else {
      const onReady = () => draw();
      window.addEventListener("sp:map-ready", onReady, { once: true });
      return () => window.removeEventListener("sp:map-ready", onReady);
    }
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  return (
    <div
      ref={divRef}
      className={`z-0 overflow-hidden rounded-2xl border border-stone-200 ${className}`}
      role="application"
      aria-label="Peta lokasi properti"
    />
  );
}
