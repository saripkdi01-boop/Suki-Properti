"use client";

import dynamic from "next/dynamic";
import type { MapPoint } from "./PropertyMap";

/**
 * Wrapper dynamic import (ssr:false) — WAJIB dipakai untuk peta Leaflet,
 * jangan import PropertyMap langsung di Server Component.
 */
const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="sp-skeleton h-[420px] w-full rounded-2xl border border-stone-200" aria-label="Memuat peta…" />
  ),
});

export interface PropertyMapDynamicProps {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
  fitBounds?: boolean;
  className?: string;
}

export default function PropertyMapDynamic(props: PropertyMapDynamicProps) {
  return <PropertyMap {...props} />;
}
