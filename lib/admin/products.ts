import { createAdminClient } from "@/lib/supabase/admin";
import {
  extractStoragePath,
  resolveStoragePublicUrl,
} from "@/lib/storage/paths";
import type { Product } from "@/types/product";
import type { ProductAdminInput } from "@/lib/validations/product-admin.schema";

export { getCategoriesAdmin } from "@/lib/admin/categories";

export interface ProductFileRecord {
  id: string;
  storagePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

function mapRow(row: {
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
  is_active: boolean;
  categories: {
    id: string;
    name: string;
    name_en?: string | null;
    slug: string;
    icon: string;
    sort_order: number;
  };
}): Product {
  const previewPaths = Array.isArray(row.preview_images)
    ? (row.preview_images as string[])
    : [];

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
      id: row.categories.id,
      name: row.categories.name,
      nameEn: row.categories.name_en?.trim() || null,
      slug: row.categories.slug,
      icon: row.categories.icon,
      sortOrder: row.categories.sort_order,
    },
    thumbnailUrl: resolveStoragePublicUrl(row.thumbnail_path),
    previewImages: previewPaths.map((path) => resolveStoragePublicUrl(path)),
    tags: row.tags ?? [],
    isFeatured: row.is_featured,
    isBestseller: row.is_bestseller,
    discountPercent: row.discount_percent,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    paymentLink: row.payment_link?.trim() || null,
  };
}

async function syncDigitalFile(
  productId: string,
  digitalFile: ProductAdminInput["digitalFile"]
) {
  if (digitalFile === undefined) return null;

  const supabase = createAdminClient();
  await supabase.from("product_files").delete().eq("product_id", productId);

  if (!digitalFile) return null;

  const { error } = await supabase.from("product_files").insert({
    product_id: productId,
    storage_path: digitalFile.storagePath,
    file_name: digitalFile.fileName,
    file_size: digitalFile.fileSize,
    mime_type: digitalFile.mimeType,
  });

  return error?.message ?? null;
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) => mapRow(row as Parameters<typeof mapRow>[0]));
}

export async function getProductFilesAdmin(
  productId: string
): Promise<ProductFileRecord[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("product_files")
    .select("id, storage_path, file_name, file_size, mime_type")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  return (
    data?.map((file) => ({
      id: file.id,
      storagePath: file.storage_path,
      fileName: file.file_name,
      fileSize: file.file_size,
      mimeType: file.mime_type,
    })) ?? []
  );
}

export async function createProductAdmin(input: ProductAdminInput) {
  const supabase = createAdminClient();
  const tags = input.tags
    ? input.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const previewImages =
    input.previewImages.length > 0
      ? input.previewImages
      : input.thumbnailPath
        ? [input.thumbnailPath]
        : [];

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      name_en: input.nameEn?.trim() || null,
      slug: input.slug,
      description: input.description,
      description_en: input.descriptionEn?.trim() || null,
      short_description: input.shortDescription,
      short_description_en: input.shortDescriptionEn?.trim() || null,
      price: input.price,
      category_id: input.categoryId,
      thumbnail_path: input.thumbnailPath || "products/placeholder.svg",
      preview_images: previewImages,
      tags,
      is_featured: input.isFeatured,
      is_bestseller: input.isBestseller,
      discount_percent: input.discountPercent ?? null,
      rating: input.rating,
      review_count: input.reviewCount,
      payment_link: input.paymentLink?.trim() || null,
      is_active: input.isActive,
    })
    .select("*, categories(*)")
    .single();

  if (error) return { product: null, error: error.message };

  const fileError = await syncDigitalFile(data.id, input.digitalFile ?? null);
  if (fileError) {
    return { product: null, error: fileError };
  }

  return { product: mapRow(data as Parameters<typeof mapRow>[0]) };
}

export async function updateProductAdmin(id: string, input: ProductAdminInput) {
  const supabase = createAdminClient();
  const tags = input.tags
    ? input.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const previewImages =
    input.previewImages.length > 0
      ? input.previewImages
      : input.thumbnailPath
        ? [input.thumbnailPath]
        : [];

  const { data, error } = await supabase
    .from("products")
    .update({
      name: input.name,
      name_en: input.nameEn?.trim() || null,
      slug: input.slug,
      description: input.description,
      description_en: input.descriptionEn?.trim() || null,
      short_description: input.shortDescription,
      short_description_en: input.shortDescriptionEn?.trim() || null,
      price: input.price,
      category_id: input.categoryId,
      thumbnail_path: input.thumbnailPath,
      preview_images: previewImages,
      tags,
      is_featured: input.isFeatured,
      is_bestseller: input.isBestseller,
      discount_percent: input.discountPercent ?? null,
      rating: input.rating,
      review_count: input.reviewCount,
      payment_link: input.paymentLink?.trim() || null,
      is_active: input.isActive,
    })
    .eq("id", id)
    .select("*, categories(*)")
    .single();

  if (error) return { product: null, error: error.message };

  const fileError = await syncDigitalFile(id, input.digitalFile ?? null);
  if (fileError) {
    return { product: null, error: fileError };
  }

  return { product: mapRow(data as Parameters<typeof mapRow>[0]) };
}

export async function deleteProductAdmin(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export { extractStoragePath, resolveStoragePublicUrl };
