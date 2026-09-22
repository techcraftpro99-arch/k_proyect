"use client";

import { useState } from "react";
import { Loader2, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CATEGORY_ICONS,
  slugify,
} from "@/lib/validations/category-admin.schema";
import type { Category } from "@/types/product";

interface CategoriesPanelProps {
  categories: Category[];
  onChanged: () => void;
}

export function CategoriesPanel({ categories, onChanged }: CategoriesPanelProps) {
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("folder");
  const [autoSlug, setAutoSlug] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setName("");
    setNameEn("");
    setSlug("");
    setIcon("folder");
    setAutoSlug(true);
    setEditing(null);
  }

  function startEdit(category: Category) {
    setEditing(category);
    setName(category.name);
    setNameEn(category.nameEn ?? "");
    setSlug(category.slug);
    setIcon(category.icon);
    setAutoSlug(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name,
        nameEn,
        slug,
        icon,
        sortOrder: editing?.sortOrder ?? categories.length + 1,
      };

      const res = await fetch(
        editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al guardar categoría");

      resetForm();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(category: Category) {
    if (
      !confirm(
        `¿Eliminar la categoría "${category.name}"? Solo funciona si no tiene productos.`
      )
    ) {
      return;
    }

    setDeletingId(category.id);
    setError(null);

    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al eliminar");
      if (editing?.id === category.id) resetForm();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="glass-card space-y-4 p-6">
      <div>
        <h3 className="text-lg font-semibold">Categorías</h3>
        <p className="text-xs text-muted-foreground">
          Nombre en español e inglés (aparecen según el idioma de la tienda)
        </p>
      </div>

      <ul className="max-h-48 space-y-1 overflow-y-auto text-sm">
        {categories.length === 0 ? (
          <li className="text-muted-foreground">Sin categorías</li>
        ) : (
          categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-white/50 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{cat.name}</p>
                {cat.nameEn && (
                  <p className="truncate text-xs text-muted-foreground">
                    EN: {cat.nameEn}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(cat)}
                  className="text-muted-foreground hover:text-foreground"
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(cat)}
                  disabled={deletingId === cat.id}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50"
                  title="Eliminar categoría"
                >
                  {deletingId === cat.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3 border-t border-white/50 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {editing ? "Editar categoría" : "Nueva categoría"}
          </p>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
              Cancelar
            </button>
          )}
        </div>
        <div>
          <Label htmlFor="cat-name">Nombre (ES) *</Label>
          <Input
            id="cat-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (autoSlug) setSlug(slugify(e.target.value));
            }}
            required
            className="mt-1"
            placeholder="Insignias"
          />
        </div>
        <div>
          <Label htmlFor="cat-name-en">Nombre (EN)</Label>
          <Input
            id="cat-name-en"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="mt-1"
            placeholder="Badges"
          />
        </div>
        <div>
          <Label htmlFor="cat-slug">Slug</Label>
          <Input
            id="cat-slug"
            value={slug}
            onChange={(e) => {
              setAutoSlug(false);
              setSlug(e.target.value);
            }}
            required
            className="mt-1"
            placeholder="insignias"
          />
        </div>
        <div>
          <Label htmlFor="cat-icon">Icono</Label>
          <select
            id="cat-icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-white/80 px-3 text-sm"
          >
            {CATEGORY_ICONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button
          type="submit"
          variant="outline"
          className="w-full rounded-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : editing ? (
            "Actualizar categoría"
          ) : (
            "Agregar categoría"
          )}
        </Button>
      </form>
    </div>
  );
}
