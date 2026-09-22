import { createAdminClient } from "@/lib/supabase/admin";
import type { Category } from "@/types/product";
import type { CategoryAdminInput } from "@/lib/validations/category-admin.schema";

function mapCategory(row: {
  id: string;
  name: string;
  name_en?: string | null;
  slug: string;
  icon: string;
  sort_order: number;
}): Category {
  return {
    id: row.id,
    name: row.name,
    nameEn: row.name_en?.trim() || null,
    slug: row.slug,
    icon: row.icon,
    sortOrder: row.sort_order,
  };
}

export async function getCategoriesAdmin(): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return data?.map((c) => mapCategory(c)) ?? [];
}

export async function createCategoryAdmin(input: CategoryAdminInput) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: input.name,
      name_en: input.nameEn?.trim() || null,
      slug: input.slug,
      icon: input.icon,
      sort_order: input.sortOrder,
    })
    .select("*")
    .single();

  if (error) {
    const message =
      error.code === "23505"
        ? "Ya existe una categoría con ese slug"
        : error.message;
    return { category: null, error: message };
  }

  return { category: mapCategory(data) };
}

export async function updateCategoryAdmin(id: string, input: CategoryAdminInput) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .update({
      name: input.name,
      name_en: input.nameEn?.trim() || null,
      slug: input.slug,
      icon: input.icon,
      sort_order: input.sortOrder,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    const message =
      error.code === "23505"
        ? "Ya existe una categoría con ese slug"
        : error.message;
    return { category: null, error: message };
  }

  return { category: mapCategory(data) };
}

export async function deleteCategoryAdmin(id: string) {
  const supabase = createAdminClient();

  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    return {
      success: false,
      error: `No se puede eliminar: ${count} producto(s) usan esta categoría`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
