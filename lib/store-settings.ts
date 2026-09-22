import { createAnonClient } from "@/lib/supabase/anon";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { resolveStoragePublicUrl } from "@/lib/storage/paths";
import { DEFAULT_BRAND_IMAGE } from "@/lib/brand-constants";

export { DEFAULT_BRAND_IMAGE } from "@/lib/brand-constants";

export interface StoreSettings {
  brandImagePath: string | null;
  brandImageUrl: string;
}

export async function getStoreSettings(): Promise<StoreSettings> {
  if (!isSupabaseConfigured()) {
    return {
      brandImagePath: null,
      brandImageUrl: DEFAULT_BRAND_IMAGE,
    };
  }

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("store_settings")
      .select("brand_image_path")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data?.brand_image_path) {
      return {
        brandImagePath: null,
        brandImageUrl: DEFAULT_BRAND_IMAGE,
      };
    }

    return {
      brandImagePath: data.brand_image_path,
      brandImageUrl: resolveStoragePublicUrl(data.brand_image_path),
    };
  } catch {
    return {
      brandImagePath: null,
      brandImageUrl: DEFAULT_BRAND_IMAGE,
    };
  }
}

export async function updateStoreBrandImage(
  brandImagePath: string | null
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase not configured" };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("store_settings").upsert({
      id: 1,
      brand_image_path: brandImagePath,
    });

    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Error al guardar",
    };
  }
}
