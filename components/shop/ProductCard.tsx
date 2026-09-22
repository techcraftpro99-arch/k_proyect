"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/cart/CartProvider";
import { useI18n } from "@/components/i18n/LocaleProvider";
import {
  formatPrice,
  formatReviewCount,
  getEffectivePrice,
  isProductPhotoUrl,
} from "@/lib/format";
import { localizeProduct } from "@/lib/i18n/localize";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { t, locale } = useI18n();
  const localized = localizeProduct(product, locale);
  const effectivePrice = getEffectivePrice(product);

  function handleAddToCart() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: localized.name,
      price: effectivePrice,
      thumbnailUrl: product.thumbnailUrl,
    });
  }

  return (
    <article className="glass-card product-card-hover flex flex-col overflow-hidden">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden rounded-t-2xl"
      >
        <div className="surface-brand absolute inset-0" />
        <Image
          src={product.thumbnailUrl}
          alt={localized.name}
          fill
          className={
            isProductPhotoUrl(product.thumbnailUrl)
              ? "rounded-t-2xl object-cover"
              : "rounded-t-2xl object-contain p-6"
          }
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.discountPercent && (
          <Badge className="absolute right-3 top-3 bg-[#9E00FF] text-white">
            -{product.discountPercent}%
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold leading-tight hover:text-[#9E00FF]">
              {localized.name}
            </h3>
          </Link>
        </div>

        <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{product.rating.toFixed(1)}</span>
          <span>
            ({formatReviewCount(product.reviewCount)} {t.product.reviews})
          </span>
        </div>

        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-lg font-bold">{formatPrice(effectivePrice)}</span>
          {product.discountPercent && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="mt-auto flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-full border-slate-200 bg-white/80"
            onClick={handleAddToCart}
          >
            {t.product.addToCart}
          </Button>
          <Link href={`/checkout?buy=${product.slug}`} className="flex-1">
            <Button className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90">
              {t.product.buyNow}
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
