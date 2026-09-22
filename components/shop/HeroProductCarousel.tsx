"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatPrice,
  formatReviewCount,
  getEffectivePrice,
  isProductPhotoUrl,
} from "@/lib/format";
import type { Product } from "@/types/product";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { localizeProduct } from "@/lib/i18n/localize";

interface HeroProductCarouselProps {
  products: Product[];
}

export function HeroProductCarousel({ products }: HeroProductCarouselProps) {
  const { t, locale } = useI18n();
  const localizedProducts = products.map((p) => localizeProduct(p, locale));
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideCount = localizedProducts.length;

  const goTo = useCallback(
    (index: number) => {
      if (!slideCount) return;
      setCurrent((index + slideCount) % slideCount);
    },
    [slideCount]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (slideCount <= 1 || isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [slideCount, isPaused, next]);

  if (!localizedProducts.length) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-muted-foreground">
        {t.shop.emptyHero}
      </div>
    );
  }

  const product = localizedProducts[current];

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="grid items-center gap-8 px-6 py-10 sm:px-10 lg:grid-cols-2 lg:px-14 lg:py-12">
        <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl lg:max-w-md">
          <div className="surface-brand absolute inset-0" />
          <div className="relative h-full w-full overflow-hidden rounded-3xl">
            {localizedProducts.map((item, index) => {
              const isPhoto = isProductPhotoUrl(item.thumbnailUrl);
              return (
              <div
                key={item.id}
                className="absolute inset-0 overflow-hidden rounded-3xl transition-all duration-700 ease-in-out"
                style={{
                  opacity: index === current ? 1 : 0,
                  transform:
                    index === current
                      ? "translateX(0) scale(1)"
                      : index < current
                        ? "translateX(-24px) scale(0.96)"
                        : "translateX(24px) scale(0.96)",
                  pointerEvents: index === current ? "auto" : "none",
                }}
              >
                <Image
                  src={item.thumbnailUrl}
                  alt={item.name}
                  fill
                  className={
                    isPhoto
                      ? "rounded-3xl object-cover drop-shadow-lg"
                      : "rounded-3xl object-contain p-8 drop-shadow-lg"
                  }
                  sizes="(max-width: 1024px) 80vw, 400px"
                  priority={index === 0}
                />
              </div>
              );
            })}
          </div>
        </div>

        <div className="relative min-h-[220px] text-center lg:text-left">
          {localizedProducts.map((item, index) => {
            const price = getEffectivePrice(item);
            return (
              <div
                key={item.id}
                className="transition-all duration-700 ease-in-out"
                style={{
                  opacity: index === current ? 1 : 0,
                  transform: index === current ? "translateY(0)" : "translateY(12px)",
                  position: index === current ? "relative" : "absolute",
                  inset: index === current ? undefined : 0,
                  pointerEvents: index === current ? "auto" : "none",
                }}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#9E00FF] sm:text-sm">
                  {item.category.name}
                </p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  {item.name}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                  {item.shortDescription}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {item.rating.toFixed(1)} ({formatReviewCount(item.reviewCount)})
                  </div>
                  <span className="text-2xl font-bold">{formatPrice(price)}</span>
                  {item.discountPercent && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <Link href={`/products/${item.slug}`}>
                    <Button variant="outline" className="rounded-full bg-white/80">
                      {t.product.viewDetail}
                    </Button>
                  </Link>
                  <Link href={`/checkout?buy=${item.slug}`}>
                    <Button className="btn-gradient rounded-full px-6">
                      {t.product.buyNowShort}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition hover:bg-white lg:left-5"
            aria-label={t.product.prev}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition hover:bg-white lg:right-5"
            aria-label={t.product.next}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {localizedProducts.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ir a ${item.name}`}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: index === current ? "2rem" : "0.5rem",
                  background:
                    index === current
                      ? "linear-gradient(135deg, #9E00FF, #3A89FF)"
                      : "rgba(158, 0, 255, 0.25)",
                }}
              />
            ))}
          </div>
        </>
      )}

      <span className="sr-only">
        Mostrando {product.name}, slide {current + 1} de {slideCount}
      </span>
    </div>
  );
}
