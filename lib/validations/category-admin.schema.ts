import { z } from "zod";
import { slugify } from "@/lib/validations/product-admin.schema";

export const CATEGORY_ICON_VALUES = [
  "sparkles",
  "gift",
  "image",
  "layout-template",
  "pen-tool",
  "sun",
  "folder",
] as const;

export const CATEGORY_ICONS = [
  { value: "sparkles", label: "Sparkles" },
  { value: "gift", label: "Regalo" },
  { value: "image", label: "Imagen" },
  { value: "layout-template", label: "Plantilla" },
  { value: "pen-tool", label: "Diseño" },
  { value: "sun", label: "Sol" },
  { value: "folder", label: "Carpeta" },
] as const;

export const categoryAdminSchema = z.object({
  name: z.string().trim().min(2, "Nombre muy corto").max(80),
  nameEn: z.string().trim().max(80).optional().default(""),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: solo minúsculas, números y guiones"),
  icon: z.enum(CATEGORY_ICON_VALUES).default("folder"),
  sortOrder: z.coerce.number().int().min(0).max(999).optional().default(0),
});

export type CategoryAdminInput = z.infer<typeof categoryAdminSchema>;

export { slugify };
