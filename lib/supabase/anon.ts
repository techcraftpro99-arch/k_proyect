import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/** Read-only client for catalog queries (no cookies — safe for generateStaticParams). */
export function createAnonClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
