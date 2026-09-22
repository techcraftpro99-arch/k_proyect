import type { Category, Product, ProductFilters } from "@/types/product";
import { createAnonClient } from "@/lib/supabase/anon";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

function getPreviewUrl(path: string): string {
  if (!path) return "/images/products/placeholder.svg";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (base) {
    return `${base}/storage/v1/object/public/product-previews/${path}`;
  }
  return `/images/products/${path.split("/").pop()?.replace(/\.(jpg|png)$/i, ".svg") ?? "placeholder.svg"}`;
}

function mapProduct(row: {
  id: string;
  name: string;
  name_en?: string | null;
  slug: string;
  description: string;
  description_en?: string | null;
  short_description: string;
  short_description_en?: string | null;
  price: number;
  thumbnail_path: string;
  preview_images: unknown;
  tags: string[];
  is_featured: boolean;
  is_bestseller: boolean;
  discount_percent: number | null;
  rating: number;
  review_count: number;
  payment_link?: string | null;
  categories: {
    id: string;
    name: string;
    name_en?: string | null;
    slug: string;
    icon: string;
    sort_order: number;
  } | null;
}): Product {
  const previewImages = Array.isArray(row.preview_images)
    ? (row.preview_images as string[]).map(getPreviewUrl)
    : [];

  const category = row.categories ?? {
    id: "unknown",
    name: "Sin categoría",
    name_en: null,
    slug: "sin-categoria",
    icon: "folder",
    sort_order: 999,
  };

  return {
    id: row.id,
    name: row.name,
    nameEn: row.name_en?.trim() || null,
    slug: row.slug,
    description: row.description,
    descriptionEn: row.description_en?.trim() || null,
    shortDescription: row.short_description,
    shortDescriptionEn: row.short_description_en?.trim() || null,
    price: Number(row.price),
    category: {
      id: category.id,
      name: category.name,
      nameEn: category.name_en?.trim() || null,
      slug: category.slug,
      icon: category.icon,
      sortOrder: category.sort_order,
    },
    thumbnailUrl: getPreviewUrl(row.thumbnail_path),
    previewImages,
    tags: row.tags ?? [],
    isFeatured: row.is_featured,
    isBestseller: row.is_bestseller,
    discountPercent: row.discount_percent,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    paymentLink: row.payment_link?.trim() || null,
  };
}

/** Checks if Supabase is reachable (not paused / not misconfigured). */
export async function isCatalogOnline(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = createAnonClient();
    const { error } = await supabase.from("categories").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");

    if (error) {
      console.error("[catalog] categories:", error.message);
      return [];
    }

  return (
    data?.map((c) => ({
      id: c.id,
      name: c.name,
      nameEn: c.name_en?.trim() || null,
      slug: c.slug,
      icon: c.icon,
      sortOrder: c.sort_order,
    })) ?? []
  );
} catch (err) {
    console.error("[catalog] categories:", err);
    return [];
  }
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = createAnonClient();
    let query = supabase
      .from("products")
      .select("*, categories(*)")
      .eq("is_active", true);

    if (filters.category) {
      const { data: categoryRow } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", filters.category)
        .maybeSingle();

      if (!categoryRow) return [];
      query = query.eq("category_id", categoryRow.id);
    }
    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }
    if (filters.featured) query = query.eq("is_featured", true);
    if (filters.bestseller) query = query.eq("is_bestseller", true);

    switch (filters.sort) {
      case "price-asc":
        query = query.order("price", { ascending: true });
        break;
      case "price-desc":
        query = query.order("price", { ascending: false });
        break;
      case "rating":
        query = query.order("rating", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const limit = filters.limit ?? 50;
    const offset = filters.offset ?? 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error("[catalog] products:", error.message);
      return [];
    }

    return (data ?? []).map((row) =>
      mapProduct(row as Parameters<typeof mapProduct>[0])
    );
  } catch (err) {
    console.error("[catalog] products:", err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) return null;

    return mapProduct(data as Parameters<typeof mapProduct>[0]);
  } catch (err) {
    console.error("[catalog] product by slug:", err);
    return null;
  }
}

export async function getProductSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("products")
      .select("slug")
      .eq("is_active", true);

    if (error) {
      console.error("[catalog] product slugs:", error.message);
      return [];
    }

    return data?.map((p) => p.slug) ?? [];
  } catch (err) {
    console.error("[catalog] product slugs:", err);
    return [];
  }
}
