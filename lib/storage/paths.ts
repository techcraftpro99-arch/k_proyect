const PREVIEWS_BUCKET = "product-previews";

export function resolveStoragePublicUrl(
  path: string,
  bucket = PREVIEWS_BUCKET
): string {
  if (!path) return "/images/products/placeholder.svg";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (base) {
    return `${base}/storage/v1/object/public/${bucket}/${path}`;
  }
  return path;
}

export function extractStoragePath(urlOrPath: string): string {
  if (urlOrPath.includes("/product-previews/")) {
    return urlOrPath.split("/product-previews/")[1] ?? urlOrPath;
  }
  if (urlOrPath.startsWith("/images/")) return urlOrPath;
  return urlOrPath.replace(/^\//, "");
}
