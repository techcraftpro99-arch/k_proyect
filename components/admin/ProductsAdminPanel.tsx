"use client";

import { useCallback, useEffect, useState } from "react";
import { CategoriesPanel } from "@/components/admin/CategoriesPanel";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductsTable } from "@/components/admin/ProductsTable";
import type { Category, Product } from "@/types/product";

export function ProductsAdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    if (res.ok) setProducts(data.products ?? []);
  }, []);

  const loadCategories = useCallback(async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    if (res.ok) setCategories(data.categories ?? []);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadProducts(), loadCategories()]);
    } finally {
      setLoading(false);
    }
  }, [loadProducts, loadCategories]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/categories"),
        ]);
        const [productsData, categoriesData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
        ]);
        if (cancelled) return;
        if (productsRes.ok) setProducts(productsData.products ?? []);
        if (categoriesRes.ok) setCategories(categoriesData.categories ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-6">
        <ProductForm
          categories={categories}
          editing={editing}
          onSaved={() => {
            setEditing(null);
            void refresh();
          }}
          onCancel={() => setEditing(null)}
        />
        <CategoriesPanel categories={categories} onChanged={() => void loadCategories()} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Productos ({products.length})</h3>
        {loading ? (
          <div className="glass-card p-8 text-center text-muted-foreground">
            Cargando...
          </div>
        ) : (
          <ProductsTable
            products={products}
            onEdit={setEditing}
            onRefresh={() => void refresh()}
          />
        )}
      </div>
    </div>
  );
}
