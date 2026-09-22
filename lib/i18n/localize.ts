import type { Locale } from "@/lib/i18n/dictionaries";
import type { Category, Product } from "@/types/product";

function pick(primary: string, english: string | null | undefined, locale: Locale): string {
  if (locale === "en" && english?.trim()) return english.trim();
  return primary;
}

export function localizeCategory(category: Category, locale: Locale): Category {
  return {
    ...category,
    name: pick(category.name, category.nameEn, locale),
  };
}

export function localizeProduct(product: Product, locale: Locale): Product {
  return {
    ...product,
    name: pick(product.name, product.nameEn, locale),
    shortDescription: pick(product.shortDescription, product.shortDescriptionEn, locale),
    description: pick(product.description, product.descriptionEn, locale),
    category: localizeCategory(product.category, locale),
  };
}

export function localizeProducts(products: Product[], locale: Locale): Product[] {
  return products.map((p) => localizeProduct(p, locale));
}

export function localizeCategories(categories: Category[], locale: Locale): Category[] {
  return categories.map((c) => localizeCategory(c, locale));
}
