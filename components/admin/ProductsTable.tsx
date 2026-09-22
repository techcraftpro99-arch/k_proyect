"use client";

import { useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onRefresh: () => void;
}

export function ProductsTable({ products, onEdit, onRefresh }: ProductsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) onRefresh();
    } finally {
      setDeletingId(null);
    }
  }

  if (!products.length) {
    return (
      <div className="glass-card p-8 text-center text-muted-foreground">
        No hay productos. Crea el primero con el formulario.
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/50 text-left text-muted-foreground">
              <th className="p-4 font-medium">Producto</th>
              <th className="p-4 font-medium">Categoría</th>
              <th className="p-4 font-medium">Precio</th>
              <th className="p-4 font-medium">Estado</th>
              <th className="p-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-white/30">
                <td className="p-4">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.slug}</p>
                </td>
                <td className="p-4">{product.category.name}</td>
                <td className="p-4">{formatPrice(product.price)}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {product.isFeatured && (
                      <Badge className="bg-[#9E00FF]/10 text-[#9E00FF]">Featured</Badge>
                    )}
                    {product.isBestseller && (
                      <Badge className="bg-[#3A89FF]/10 text-[#3A89FF]">Bestseller</Badge>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => onEdit(product)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full text-red-600"
                      disabled={deletingId === product.id}
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      {deletingId === product.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
