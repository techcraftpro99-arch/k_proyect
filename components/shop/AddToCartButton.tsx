"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/CartProvider";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { localizeProduct } from "@/lib/i18n/localize";
import type { Product } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
  effectivePrice: number;
}

export function AddToCartButton({ product, effectivePrice }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { t, locale } = useI18n();
  const localized = localizeProduct(product, locale);

  return (
    <Button
      variant="outline"
      className="flex-1 rounded-full border-slate-200 bg-white/80"
      onClick={() =>
        addItem({
          productId: product.id,
          slug: product.slug,
          name: localized.name,
          price: effectivePrice,
          thumbnailUrl: product.thumbnailUrl,
        })
      }
    >
      {t.product.addToCart}
    </Button>
  );
}
