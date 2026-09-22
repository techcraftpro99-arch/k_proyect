"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types/product";
import { isProductPhotoUrl } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images =
    product.previewImages.length > 0
      ? product.previewImages
      : [product.thumbnailUrl];
  const [active, setActive] = useState(0);
  const isPhoto = isProductPhotoUrl(images[active] ?? "");

  return (
    <div className="space-y-3">
      <div className="glass-card relative aspect-square overflow-hidden rounded-3xl">
        <div className="surface-brand absolute inset-0" />
        <Image
          src={images[active]}
          alt={`${product.name} — ${active + 1}`}
          fill
          className={cn(
            "relative z-10 rounded-3xl",
            isPhoto ? "object-cover" : "object-contain p-10"
          )}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl border-2 transition",
                index === active
                  ? "border-[#9E00FF] shadow-md"
                  : "border-transparent opacity-80 hover:opacity-100"
              )}
            >
              <div className="surface-brand absolute inset-0 rounded-2xl" />
              <Image
                src={src}
                alt={`${product.name} preview ${index + 1}`}
                fill
                className="rounded-2xl object-cover"
                sizes="150px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
