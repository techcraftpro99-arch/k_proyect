import { HeroProductCarousel } from "@/components/shop/HeroProductCarousel";
import type { Product } from "@/types/product";

interface HeroSectionProps {
  products: Product[];
}

export function HeroSection({ products }: HeroSectionProps) {
  const featured =
    products.filter((p) => p.isFeatured).length > 0
      ? products.filter((p) => p.isFeatured)
      : products.slice(0, 5);

  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-16">
      <div className="relative overflow-hidden rounded-3xl glass-card">
        <div className="absolute inset-0 surface-brand opacity-50" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 20% 30%, rgba(158,0,255,0.1), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(58,137,255,0.12), transparent 50%)",
          }}
        />
        <div className="relative z-10">
          <HeroProductCarousel products={featured} />
        </div>
      </div>
    </section>
  );
}
