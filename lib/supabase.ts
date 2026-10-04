import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const PLACEHOLDER = "ISI_SAAT_DEPLOY_VERCEL";

let client: SupabaseClient | null = null;
let warned = false;

/** True hanya bila kredensial asli (bukan placeholder) tersedia. */
export function hasRealCredentials(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!url && !!key && key !== PLACEHOLDER;
}

/**
 * Client Supabase read-only (anon key). Mengembalikan null bila kredensial
 * belum di-set — pemanggil WAJIB menangani null dengan mengembalikan data
 * kosong, agar `next build` tetap lolos tanpa key asli.
 */
export function getSupabase(): SupabaseClient | null {
  if (!hasRealCredentials()) {
    if (!warned) {
      warned = true;
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY belum di-set — query dikembalikan kosong."
      );
    }
    return null;
  }
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return client;
}
