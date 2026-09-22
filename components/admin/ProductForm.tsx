"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  DigitalFileUploadField,
  GalleryUploadField,
  ImageUploadField,
  type DigitalFileValue,
} from "@/components/admin/FileUploadField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/validations/product-admin.schema";
import type { Category, Product } from "@/types/product";

interface ProductFormProps {
  categories: Category[];
  editing: Product | null;
  onSaved: () => void;
  onCancel: () => void;
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  price: "",
  categoryId: "",
  thumbnailPath: "",
  previewImagePaths: [] as string[],
  tags: "",
  isFeatured: false,
  isBestseller: false,
  discountPercent: "",
  rating: "5",
  reviewCount: "0",
  nameEn: "",
  shortDescriptionEn: "",
  descriptionEn: "",
  paymentLink: "",
  isActive: true,
};

function extractPath(urlOrPath: string): string {
  if (urlOrPath.includes("/product-previews/")) {
    return urlOrPath.split("/product-previews/")[1] ?? urlOrPath;
  }
  if (urlOrPath.startsWith("/images/")) return urlOrPath;
  return urlOrPath.replace(/^\//, "");
}

function formFromProduct(editing: Product) {
  const previewPaths = editing.previewImages.map(extractPath);
  const thumbnailPath = extractPath(editing.thumbnailUrl);

  return {
    name: editing.name,
    slug: editing.slug,
    description: editing.description,
    shortDescription: editing.shortDescription,
    price: String(editing.price),
    categoryId: editing.category.id,
    thumbnailPath,
    previewImagePaths:
      previewPaths.length > 0
        ? previewPaths
        : thumbnailPath
          ? [thumbnailPath]
          : [],
    tags: editing.tags.join(", "),
    isFeatured: editing.isFeatured,
    isBestseller: editing.isBestseller,
    discountPercent: editing.discountPercent ? String(editing.discountPercent) : "",
    rating: String(editing.rating),
    reviewCount: String(editing.reviewCount),
    nameEn: editing.nameEn ?? "",
    shortDescriptionEn: editing.shortDescriptionEn ?? "",
    descriptionEn: editing.descriptionEn ?? "",
    paymentLink: editing.paymentLink ?? "",
    isActive: true,
  };
}

function previewUrlFromPath(path: string): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (base) {
    return `${base}/storage/v1/object/public/product-previews/${path}`;
  }
  return path;
}

export function ProductForm({
  categories,
  editing,
  onSaved,
  onCancel,
}: ProductFormProps) {
  return (
    <ProductFormFields
      key={editing?.id ?? "new"}
      categories={categories}
      editing={editing}
      onSaved={onSaved}
      onCancel={onCancel}
    />
  );
}

function ProductFormFields({
  categories,
  editing,
  onSaved,
  onCancel,
}: ProductFormProps) {
  const [form, setForm] = useState(() =>
    editing ? formFromProduct(editing) : emptyForm
  );
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(() =>
    editing ? previewUrlFromPath(formFromProduct(editing).thumbnailPath) : null
  );
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(() =>
    editing
      ? formFromProduct(editing).previewImagePaths.map(previewUrlFromPath)
      : []
  );
  const [digitalFile, setDigitalFile] = useState<DigitalFileValue | null>(null);
  const [digitalFileLoaded, setDigitalFileLoaded] = useState(!editing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSlug, setAutoSlug] = useState(!editing);
  const [draftFolder] = useState(() => `products/borrador-${crypto.randomUUID()}`);

  const uploadFolder = form.slug ? `products/${form.slug}` : draftFolder;

  useEffect(() => {
    if (!editing?.id) return;

    let cancelled = false;

    fetch(`/api/admin/products/${editing.id}/files`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const file = data.files?.[0];
        if (file) {
          setDigitalFile({
            storagePath: file.storagePath,
            fileName: file.fileName,
            fileSize: file.fileSize,
            mimeType: file.mimeType,
          });
        } else {
          setDigitalFile(null);
        }
      })
      .finally(() => {
        if (!cancelled) setDigitalFileLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [editing?.id]);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && autoSlug) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.thumbnailPath) {
      setError("Sube una imagen de portada antes de guardar");
      return;
    }

    setLoading(true);
    setError(null);

    const previewImages =
      form.previewImagePaths.length > 0
        ? form.previewImagePaths
        : form.thumbnailPath
          ? [form.thumbnailPath]
          : [];

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      shortDescription: form.shortDescription,
      price: Number(form.price),
      categoryId: form.categoryId,
      thumbnailPath: form.thumbnailPath,
      previewImages,
      digitalFile,
      tags: form.tags,
      isFeatured: form.isFeatured,
      isBestseller: form.isBestseller,
      discountPercent: form.discountPercent ? Number(form.discountPercent) : null,
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
      nameEn: form.nameEn,
      shortDescriptionEn: form.shortDescriptionEn,
      descriptionEn: form.descriptionEn,
      paymentLink: form.paymentLink,
      isActive: form.isActive,
    };

    try {
      const url = editing
        ? `/api/admin/products/${editing.id}`
        : "/api/admin/products";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al guardar");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-4 p-6">
      <h3 className="text-lg font-semibold">
        {editing ? "Editar producto" : "Nuevo producto"}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nombre (ES) *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug (URL) *</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => {
              setAutoSlug(false);
              updateField("slug", e.target.value);
            }}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="price">Precio (USD) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="category">Categoría *</Label>
          <select
            id="category"
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
            required
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-white/80 px-3 text-sm"
          >
            <option value="">Seleccionar...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
          <Label htmlFor="shortDescription">Descripción corta (ES) *</Label>
        <Input
          id="shortDescription"
          value={form.shortDescription}
          onChange={(e) => updateField("shortDescription", e.target.value)}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción completa (ES) *</Label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          required
          rows={4}
          className="mt-1 flex w-full rounded-md border border-input bg-white/80 px-3 py-2 text-sm"
        />
      </div>

      <div className="rounded-2xl border border-dashed border-[#9E00FF]/25 bg-white/40 p-4 space-y-4">
        <p className="text-sm font-medium">Versión en inglés (opcional)</p>
        <p className="text-xs text-muted-foreground">
          Si está vacío, en EN se muestra el texto en español.
        </p>
        <div>
          <Label htmlFor="nameEn">Nombre (EN)</Label>
          <Input
            id="nameEn"
            value={form.nameEn}
            onChange={(e) => updateField("nameEn", e.target.value)}
            className="mt-1"
            placeholder="BADGES #1 (No numbers)"
          />
        </div>
        <div>
          <Label htmlFor="shortDescriptionEn">Descripción corta (EN)</Label>
          <Input
            id="shortDescriptionEn"
            value={form.shortDescriptionEn}
            onChange={(e) => updateField("shortDescriptionEn", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="descriptionEn">Descripción completa (EN)</Label>
          <textarea
            id="descriptionEn"
            value={form.descriptionEn}
            onChange={(e) => updateField("descriptionEn", e.target.value)}
            rows={4}
            className="mt-1 flex w-full rounded-md border border-input bg-white/80 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <ImageUploadField
        label="Portada *"
        folder={uploadFolder}
        path={form.thumbnailPath}
        previewUrl={thumbnailPreview}
        onUploaded={(path, url) => {
          updateField("thumbnailPath", path);
          setThumbnailPreview(url);
          if (form.previewImagePaths.length === 0) {
            updateField("previewImagePaths", [path]);
            setGalleryPreviews([url]);
          }
        }}
        onClear={() => {
          updateField("thumbnailPath", "");
          setThumbnailPreview(null);
        }}
        hint="Imagen principal del producto en la tienda y carrusel"
      />

      <GalleryUploadField
        label="Galería de previews"
        folder={uploadFolder}
        paths={form.previewImagePaths}
        previewUrls={galleryPreviews}
        onChange={(paths, urls) => {
          updateField("previewImagePaths", paths);
          setGalleryPreviews(urls);
          if (!form.thumbnailPath && paths[0]) {
            updateField("thumbnailPath", paths[0]);
            setThumbnailPreview(urls[0] ?? null);
          }
        }}
      />

      {digitalFileLoaded ? (
        <DigitalFileUploadField
          label="Archivo digital para el comprador"
          folder={uploadFolder}
          value={digitalFile}
          onUploaded={setDigitalFile}
          onClear={() => setDigitalFile(null)}
        />
      ) : (
        <div className="rounded-2xl border border-white/50 bg-white/40 p-4 text-sm text-muted-foreground">
          Cargando archivo digital...
        </div>
      )}

      <div>
        <Label htmlFor="paymentLink">Link de pago PayPal</Label>
        <Input
          id="paymentLink"
          type="url"
          value={form.paymentLink}
          onChange={(e) => updateField("paymentLink", e.target.value)}
          placeholder="https://www.paypal.com/ncp/payment/XXXX o https://paypal.me/..."
          className="mt-1"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          URL HTTPS del botón/link de PayPal de este producto. El comprador será
          redirigido aquí al pagar.
        </p>
      </div>

      <div>
        <Label htmlFor="tags">Tags (separados por coma)</Label>
        <Input
          id="tags"
          value={form.tags}
          onChange={(e) => updateField("tags", e.target.value)}
          placeholder="insignias, tiktok, png"
          className="mt-1"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => updateField("isFeatured", e.target.checked)}
          />
          Destacado (aparece en el carrusel)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isBestseller}
            onChange={(e) => updateField("isBestseller", e.target.checked)}
          />
          Bestseller
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => updateField("isActive", e.target.checked)}
          />
          Activo
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="rating">Calificación (0–5)</Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={form.rating}
            onChange={(e) => updateField("rating", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="reviewCount">Cantidad de reseñas</Label>
          <Input
            id="reviewCount"
            type="number"
            min="0"
            value={form.reviewCount}
            onChange={(e) => updateField("reviewCount", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="max-w-xs">
        <Label htmlFor="discount">Descuento (%)</Label>
        <Input
          id="discount"
          type="number"
          min="0"
          max="100"
          value={form.discountPercent}
          onChange={(e) => updateField("discountPercent", e.target.value)}
          className="mt-1"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" className="btn-gradient rounded-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : editing ? (
            "Actualizar"
          ) : (
            "Crear producto"
          )}
        </Button>
        {editing && (
          <Button type="button" variant="outline" className="rounded-full" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
