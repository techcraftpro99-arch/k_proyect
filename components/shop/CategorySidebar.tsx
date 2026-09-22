"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronDown,
  Gift,
  Image,
  LayoutTemplate,
  PenTool,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/product";
import { useState } from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { localizeCategories } from "@/lib/i18n/localize";

const iconMap: Record<string, LucideIcon> = {
  image: Image,
  gift: Gift,
  sparkles: Sparkles,
  "layout-template": LayoutTemplate,
  "pen-tool": PenTool,
  sun: Sun,
};

interface CategorySidebarProps {
  categories: Category[];
  className?: string;
}

export function CategorySidebar({ categories, className }: CategorySidebarProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const [featuredOpen, setFeaturedOpen] = useState(true);
  const { t, locale } = useI18n();
  const localizedCategories = localizeCategories(categories, locale);

  function buildHref(params: Record<string, string | null>) {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v) sp.set(k, v);
      else sp.delete(k);
    });
    sp.set("section", "shop");
    return `/?${sp.toString()}`;
  }

  return (
    <aside className={cn("glass-card p-5", className)}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {t.shop.byCategory}
      </h2>

      <ul className="space-y-1">
        <li>
          <Link
            href={buildHref({ category: null })}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/60",
              !activeCategory && "bg-white/80 font-medium"
            )}
          >
            {t.shop.allProducts}
          </Link>
        </li>
        {localizedCategories.map((cat) => {
          const Icon = iconMap[cat.icon] ?? Image;
          return (
            <li key={cat.id}>
              <Link
                href={buildHref({ category: cat.slug })}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/60",
                  activeCategory === cat.slug && "bg-white/80 font-medium"
                )}
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {cat.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 border-t border-white/50 pt-4">
        <button
          type="button"
          onClick={() => setFeaturedOpen(!featuredOpen)}
          className="flex w-full items-center justify-between text-sm font-medium"
        >
          {t.shop.featuredItems}
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", featuredOpen && "rotate-180")}
          />
        </button>
        {featuredOpen && (
          <ul className="mt-2 space-y-1 pl-1">
            <li>
              <Link
                href={buildHref({ featured: "true", bestseller: null })}
                className="block rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-white/60 hover:text-foreground"
              >
                {t.shop.featuredLink}
              </Link>
            </li>
            <li>
              <Link
                href={buildHref({ bestseller: "true", featured: null })}
                className="block rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-white/60 hover:text-foreground"
              >
                {t.shop.bestSelling}
              </Link>
            </li>
            <li>
              <Link
                href="/?section=shop&sort=price-asc"
                className="block rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-white/60 hover:text-foreground"
              >
                {t.shop.onDiscounts}
              </Link>
            </li>
          </ul>
        )}
      </div>
    </aside>
  );
}
