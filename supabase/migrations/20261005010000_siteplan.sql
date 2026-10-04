-- ============================================================================
-- Migrasi: modul Siteplan Interaktif ("Denah Unit") — Suki-Properti
-- Blueprint: workspace/your_files/suki-properti-baru/blueprint-siteplan-interaktif.md
--
-- CARA JALANKAN: Supabase Dashboard → SQL Editor → New query → paste seluruh
-- file ini → Run. Idempotent (aman dijalankan ulang).
-- Tabel BARU saja; public.properties TIDAK disentuh.
-- ============================================================================

-- 1. Daftar status kavling (dari audit sdpcore.com, Okt 2026)
create table if not exists siteplan_statuses (
  code text primary key,
  label text not null,
  color_hex text not null,
  sort_order int not null
);

insert into siteplan_statuses (code, label, color_hex, sort_order) values
  ('ready',          'Ready',          '#ffffff', 1),
  ('booking',        'Booking',        '#00c853', 2),
  ('booking_fee',    'Booking Fee',    '#ffff80', 3),
  ('on_proses_bank', 'On Proses Bank', '#ff7300', 4),
  ('sp3k',           'SP3K',           '#6ab5ff', 5),
  ('akad',           'Akad',           '#fb00ff', 6),
  ('serah_terima',   'Serah Terima',   '#800040', 7),
  ('user_cancel',    'User Cancel',    '#ffffff', 8),
  ('pembelian_cash', 'Pembelian Cash', '#00ffd5', 9)
on conflict (code) do nothing;

-- 2. Lokasi denah (satu denah per perumahan; dikaitkan ke listing via slug)
create table if not exists siteplan_locations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  property_slug text,  -- kait ke public.properties.slug (join di app, tanpa FK keras)
  center_lat double precision,
  center_lng double precision,
  default_zoom int not null default 17,
  crs_mode text not null default 'geo' check (crs_mode in ('geo', 'simple')),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3. Kavling (polygon GeoJSON; koordinat [lng, lat] untuk mode geo)
create table if not exists siteplan_kavlings (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references siteplan_locations(id) on delete cascade,
  code text not null,  -- mis. "C-7"
  status text not null default 'ready' references siteplan_statuses(code),
  polygon jsonb not null,
  land_area_sqm numeric,
  building_area_sqm numeric,
  price numeric,       -- NULL = "Hubungi marketing" (aturan anti-data-karangan)
  created_at timestamptz not null default now(),
  unique (location_id, code)
);
create index if not exists idx_kavlings_location on siteplan_kavlings(location_id);

-- 4. RLS: publik hanya baca yang terbit; tulis hanya via service role (backoffice kelak)
alter table siteplan_statuses enable row level security;
alter table siteplan_locations enable row level security;
alter table siteplan_kavlings enable row level security;

drop policy if exists "publik baca status" on siteplan_statuses;
create policy "publik baca status" on siteplan_statuses
  for select using (true);

drop policy if exists "publik baca denah terbit" on siteplan_locations;
create policy "publik baca denah terbit" on siteplan_locations
  for select using (is_published = true);

drop policy if exists "publik baca kavling terbit" on siteplan_kavlings;
create policy "publik baca kavling terbit" on siteplan_kavlings
  for select using (exists (
    select 1 from siteplan_locations l
    where l.id = siteplan_kavlings.location_id
      and l.is_published = true
  ));
