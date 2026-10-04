# Sultra Properti — Direktori Perumahan Sulawesi Tenggara

Portal direktori perumahan Sulawesi Tenggara: pencarian berbasis peta (ala Zillow),
galeri premium + simulasi KPR (ala Brighton.co.id), berbahasa Indonesia, mobile-first.

**Sumber data:** direktori publik [SiKumbang BP Tapera](https://sikumbang.tapera.go.id/)
— 765 listing perumahan Sultra, sudah live di Supabase `public.properties`.
Situs ini adalah **direktori agregat, bukan marketplace listing**.

## Pengembangan lokal

```bash
npm install
cp .env.example .env.local   # lalu isi key (lihat bawah)
npm run dev
```

## Environment variables (WAJIB di Vercel saat deploy — Fase 7)

| Variable | Nilai |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ibvcfdfsjpytwpnxgylm.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **key anon ASLI** — set di Vercel Dashboard → Project Settings → Environment Variables (jangan commit ke repo!) |

Tanpa key asli, halaman me-render kosong dengan aman (build tetap lolos).

## Aturan kejujuran data (keras)

1. Setiap halaman detail memuat atribusi SiKumbang BP Tapera + link sumber.
2. DILARANG mengarang harga, foto, testimoni, atau klaim cakupan nasional.
3. Harga `NULL` tampil sebagai "Hubungi marketing" — tidak dikarang, tidak disembunyikan diam-diam.
4. Database hanya dibaca (read-only). Jangan tulis ke Supabase dari repo ini.

## Struktur

- `lib/brand.ts` — satu-satunya definisi brand (mudah rebrand)
- `lib/properties.ts` — data layer (filter, paginasi, detail, terkait, statistik)
- `lib/format.ts`, `lib/parse.ts` — format rupiah/KPR, parser deskripsi SiKumbang
- `components/` — Header, Footer, PropertyCard, PropertyMap (Leaflet, ssr:false)
- `app/` — `/`, `/properti`, `/properti/[slug]`, `/tentang`, `/sumber-data`, `/privasi`
