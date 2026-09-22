"use client";

import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { useI18n } from "@/components/i18n/LocaleProvider";

interface ProductGridProps {
  products: Product[];
  unavailable?: boolean;
}

export function ProductGrid({ products, unavailable = false }: ProductGridProps) {
  const { t } = useI18n();

  if (unavailable) {
    return (
      <div className="glass-card flex min-h-[300px] items-center justify-center p-8 text-center">
        <div>
          <p className="text-lg font-medium">{t.shop.catalogUnavailable}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.shop.catalogUnavailableHint}
          </p>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="glass-card flex min-h-[300px] items-center justify-center p-8 text-center">
        <div>
          <p className="text-lg font-medium">{t.shop.noProducts}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.shop.noProductsHint}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
