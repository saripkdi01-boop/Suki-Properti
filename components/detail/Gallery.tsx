"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface GalleryProps {
  images: string[];
  title: string;
}

function EmptyPhoto() {
  return (
    <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-laguna-100 text-laguna-700">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9.5 12 4l9 5.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" strokeLinejoin="round" />
      </svg>
      <span className="text-sm font-semibold">Foto tidak tersedia</span>
    </div>
  );
}

export default function Gallery({ images, title }: GalleryProps) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const [lightbox, setLightbox] = useState(false);

  const count = images.length;
  const allFailed = count > 0 && images.every((_, i) => failed[i]);

  const close = useCallback(() => setLightbox(false), []);
  const go = useCallback(
    (dir: 1 | -1) => {
      if (count === 0) return;
      setActive((i) => (i + dir + count) % count);
    },
    [count]
  );

  // Keyboard: Escape tutup, panah navigasi
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, go]);

  if (count === 0 || allFailed) return <EmptyPhoto />;

  const markFailed = (i: number) => setFailed((f) => ({ ...f, [i]: true }));

  return (
    <div>
      {/* Foto utama */}
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="group relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-stone-200 bg-laguna-100"
        aria-label="Buka galeri foto"
      >
        {failed[active] ? (
          <EmptyPhoto />
        ) : (
          <Image
            key={images[active]}
            src={images[active]}
            alt={`${title} — foto ${active + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
            onError={() => markFailed(active)}
            priority
          />
        )}
        <span className="absolute bottom-3 right-3 rounded-full bg-laguna-950/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {active + 1} / {count}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-laguna-950/70 p-2 text-white opacity-0 backdrop-blur transition group-hover:opacity-100" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {/* Strip thumbnail */}
      {count > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 bg-laguna-100 transition ${
                i === active ? "border-gold-500" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`Lihat foto ${i + 1}`}
            >
              {failed[i] ? (
                <span className="flex h-full w-full items-center justify-center text-xs text-laguna-600">Gagal</span>
              ) : (
                <Image
                  src={src}
                  alt={`${title} — thumbnail ${i + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                  onError={() => markFailed(i)}
                  loading="lazy"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-laguna-950/90 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Galeri foto"
        >
          {/* Tombol tutup */}
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/25"
            aria-label="Tutup galeri"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>

          {/* Counter */}
          <span className="absolute left-1/2 top-5 z-10 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur">
            {active + 1} / {count}
          </span>

          {/* Prev */}
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-3 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/25"
              aria-label="Foto sebelumnya"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Foto besar */}
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {failed[active] ? (
              <div className="flex h-full w-full items-center justify-center text-white/70">Foto tidak dapat dimuat</div>
            ) : (
              <Image
                key={images[active]}
                src={images[active]}
                alt={`${title} — foto ${active + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                onError={() => markFailed(active)}
              />
            )}
          </div>

          {/* Next */}
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-3 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/25"
              aria-label="Foto berikutnya"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
