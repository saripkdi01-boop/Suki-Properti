"use client";

import dynamic from "next/dynamic";
import type { SiteplanKavling } from "@/lib/siteplan";

/**
 * Wrapper dynamic import (ssr:false) — WAJIB dipakai untuk peta Leaflet,
 * jangan import SiteplanMap langsung di Server Component.
 * (Pola sama dengan components/PropertyMapDynamic.tsx)
 */
const SiteplanMap = dynamic(() => import("./SiteplanMap"), {
  ssr: false,
  loading: () => (
    <div
      className="sp-skeleton h-[420px] w-full rounded-2xl border border-stone-200"
      aria-label="Memuat denah…"
    />
  ),
});

export interface SiteplanMapDynamicProps {
  kavlings: SiteplanKavling[];
  statusColors?: Record<string, string>;
  statusLabels?: Record<string, string>;
  center?: [number, number];
  zoom?: number;
  crsMode?: "geo" | "simple";
  className?: string;
}

export default function SiteplanMapDynamic(props: SiteplanMapDynamicProps) {
  return <SiteplanMap {...props} />;
}
