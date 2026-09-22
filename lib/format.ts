import type { Product } from "@/types/product";

export function getEffectivePrice(product: Product): number {
  if (product.discountPercent) {
    return product.price * (1 - product.discountPercent / 100);
  }
  return product.price;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatReviewCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`;
  return String(count);
}

/** True for raster photos (PNG, JPG, JFIF, WebP…). False for SVG placeholders. */
export function isProductPhotoUrl(url: string): boolean {
  if (!url) return false;
  if (/\.svg(\?|$)/i.test(url)) return false;
  return /\.(png|jpe?g|jfif|webp|gif|avif|bmp)(\?|$)/i.test(url);
}
