-- ============================================================================
-- SEED CONTOH — DEV ONLY. JANGAN dijalankan di production.
-- Data sintetis bertanda jelas "[CONTOH]" untuk menguji komponen denah.
-- Koordinatnya KARANGAN (sekitar Kendari) — bukan data nyata.
--
-- Cara pakai:
--   1. Jalankan dulu migrasi 20261005010000_siteplan.sql
--   2. Jalankan file ini di SQL Editor
--   3. Untuk uji tampil: set is_published = true SEMENTARA, lalu kembalikan false
--      (atau set property_slug ke slug listing nyata lalu uji di halaman detail)
--   4. Setelah selesai uji: hapus baris contoh (lihat bawah)
-- ============================================================================

insert into siteplan_locations (slug, name, property_slug, center_lat, center_lng, default_zoom, crs_mode, is_published)
values ('contoh-denah-dev', '[CONTOH] Denah Dev', null, -3.9900, 122.5195, 17, 'geo', false)
on conflict (slug) do nothing;

insert into siteplan_kavlings (location_id, code, status, polygon, land_area_sqm, building_area_sqm, price)
select l.id, v.code, v.status, v.polygon::jsonb, v.lt, v.lb, v.price
from siteplan_locations l,
(values
  ('C-1', 'ready',
   '{"type":"Polygon","coordinates":[[[122.5190,-3.9900],[122.5195,-3.9900],[122.5195,-3.9895],[122.5190,-3.9895],[122.5190,-3.9900]]]}',
   120, 45, 350000000),
  ('C-2', 'booking_fee',
   '{"type":"Polygon","coordinates":[[[122.5195,-3.9900],[122.5200,-3.9900],[122.5200,-3.9895],[122.5195,-3.9895],[122.5195,-3.9900]]]}',
   120, 45, 355000000),
  ('C-3', 'on_proses_bank',
   '{"type":"Polygon","coordinates":[[[122.5190,-3.9895],[122.5195,-3.9895],[122.5195,-3.9890],[122.5190,-3.9890],[122.5190,-3.9895]]]}',
   135, 50, null),
  ('C-4', 'serah_terima',
   '{"type":"Polygon","coordinates":[[[122.5195,-3.9895],[122.5200,-3.9895],[122.5200,-3.9890],[122.5195,-3.9890],[122.5195,-3.9895]]]}',
   135, 50, 375000000)
) as v(code, status, polygon, lt, lb, price)
where l.slug = 'contoh-denah-dev'
on conflict (location_id, code) do nothing;

-- Bersih-bersih setelah uji:
-- delete from siteplan_kavlings where location_id = (select id from siteplan_locations where slug = 'contoh-denah-dev');
-- delete from siteplan_locations where slug = 'contoh-denah-dev';
