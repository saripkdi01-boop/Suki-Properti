"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Property } from "@/lib/properties";
import { formatRupiahShort, formatSpek, formatAlamat } from "@/lib/format";

function PhotoFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-laguna-100 text-laguna-700">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9.5 12 4l9 5.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" strokeLinejoin="round" />
      </svg>
      <span className="px-3 text-center text-xs font-semibold">Foto tidak tersedia</span>
    </div>
  );
}

export default function PropertyCard({ property }: { property: Property }) {
  const [imgError, setImgError] = useState(false);
  const photo = property.images?.[0];
  const isSubsidi = property.category === "rumah_subsidi";

  return (
    <Link
      href={`/properti/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-laguna-100">
        {photo && !imgError ? (
          <Image
            src={photo}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <PhotoFallback />
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow ${
              isSubsidi ? "bg-gold-500" : "bg-laguna-700"
            }`}
          >
            {isSubsidi ? "Subsidi" : "Komersil"}
          </span>
          {property.can_kpr && (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-laguna-800 shadow">
              Bisa KPR
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-lg font-extrabold tracking-tight text-laguna-900">
          {formatRupiahShort(property.price)}
        </p>
        <h3 className="line-clamp-1 text-sm font-bold text-stone-800 group-hover:text-laguna-800">
          {property.title}
        </h3>
        <p className="line-clamp-1 text-xs text-stone-500">{formatAlamat(property)}</p>
        <p className="mt-auto pt-1 text-xs font-semibold text-stone-600">
          {formatSpek(property)}
        </p>
      </div>
    </Link>
  );
}
