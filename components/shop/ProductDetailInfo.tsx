"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { formatPrice, formatReviewCount } from "@/lib/format";
import { localizeProduct } from "@/lib/i18n/localize";
import type { Product } from "@/types/product";
import { Star } from "lucide-react";

interface ProductDetailInfoProps {
  product: Product;
  effectivePrice: number;
}

export function ProductDetailInfo({
  product,
  effectivePrice,
}: ProductDetailInfoProps) {
  const { t, locale } = useI18n();
  const localized = localizeProduct(product, locale);

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex flex-wrap gap-2">
        <Badge variant="secondary">{localized.category.name}</Badge>
        {product.isFeatured && (
          <Badge className="bg-[#9E00FF]/10 text-[#9E00FF]">
            {t.product.featured}
          </Badge>
        )}
        {product.isBestseller && (
          <Badge className="bg-amber-100 text-amber-700">
            {t.product.bestseller}
          </Badge>
        )}
      </div>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {localized.name}
      </h1>

      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        {product.rating.toFixed(1)} (
        {formatReviewCount(product.reviewCount)} {t.product.reviews})
      </div>

      <div className="mt-6 flex items-baseline gap-3">
        <span className="text-3xl font-bold">{formatPrice(effectivePrice)}</span>
        {product.discountPercent && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
            <Badge className="bg-[#9E00FF] text-white">
              {t.product.save} {product.discountPercent}%
            </Badge>
          </>
        )}
      </div>

      <p className="mt-6 whitespace-pre-line leading-relaxed text-muted-foreground">
        {localized.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="rounded-full">
            #{tag}
          </Badge>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <AddToCartButton product={product} effectivePrice={effectivePrice} />
        <Link
          href={`/checkout?buy=${product.slug}`}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background hover:bg-foreground/90"
        >
          {t.product.buyNow}
        </Link>
      </div>
    </div>
  );
}
