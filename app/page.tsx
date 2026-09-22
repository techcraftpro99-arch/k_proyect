import { Suspense } from "react";
import { HeroSection } from "@/components/shop/HeroSection";
import { SearchBar } from "@/components/shop/SearchBar";
import { CategorySidebar } from "@/components/shop/CategorySidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { MobileCategorySheet } from "@/components/shop/MobileCategorySheet";
import { ShopSectionTitle } from "@/components/shop/ShopSectionTitle";
import {
  getCategories,
  getProducts,
  isCatalogOnline,
} from "@/lib/products";

interface HomePageProps {
  searchParams: Promise<{
    section?: string;
    category?: string;
    search?: string;
    sort?: string;
    featured?: string;
    bestseller?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const showShop = params.section === "shop" || params.category || params.search;

  const catalogOnline = await isCatalogOnline();
  const categories = catalogOnline ? await getCategories() : [];
  const allProducts = catalogOnline ? await getProducts({}) : [];
  const products = catalogOnline
    ? await getProducts({
        category: params.category,
        search: params.search,
        sort: params.sort as "price-asc" | "price-desc" | "rating" | undefined,
        featured: params.featured === "true",
        bestseller: params.bestseller === "true",
      })
    : [];

  return (
    <>
      <HeroSection products={allProducts} />

      <div className="py-6">
        <Suspense fallback={<div className="mx-auto h-16 max-w-7xl animate-pulse rounded-2xl bg-white/50" />}>
          <SearchBar />
        </Suspense>
      </div>

      <section id="shop" className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <ShopSectionTitle showShop={Boolean(showShop)} />
          <MobileCategorySheet categories={categories} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <CategorySidebar categories={categories} className="hidden lg:block" />
          <ProductGrid products={products} unavailable={!catalogOnline} />
        </div>
      </section>
    </>
  );
}
