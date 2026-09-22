import { z } from "zod";

export const productAdminSchema = z.object({
  name: z.string().trim().min(2, "Nombre muy corto").max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: solo minúsculas, números y guiones"),
  description: z.string().trim().min(10).max(5000),
  shortDescription: z.string().trim().min(5).max(200),
  price: z.coerce.number().min(0).max(99999),
  categoryId: z.string().uuid("Selecciona una categoría"),
  thumbnailPath: z.string().trim().max(500).optional().default(""),
  previewImages: z.array(z.string().trim().max(500)).optional().default([]),
  digitalFile: z
    .object({
      storagePath: z.string().trim().min(1).max(500),
      fileName: z.string().trim().min(1).max(255),
      fileSize: z.coerce.number().min(0),
      mimeType: z.string().trim().min(1).max(120),
    })
    .nullable()
    .optional(),
  tags: z.string().trim().optional().default(""),
  isFeatured: z.coerce.boolean().optional().default(false),
  isBestseller: z.coerce.boolean().optional().default(false),
  discountPercent: z.coerce.number().min(0).max(100).nullable().optional(),
  rating: z.coerce.number().min(0).max(5).optional().default(5),
  reviewCount: z.coerce.number().int().min(0).max(9999999).optional().default(0),
  nameEn: z.string().trim().max(120).optional().default(""),
  shortDescriptionEn: z.string().trim().max(200).optional().default(""),
  descriptionEn: z.string().trim().max(5000).optional().default(""),
  paymentLink: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .default("")
    .refine(
      (val) => !val || /^https:\/\/.+/i.test(val),
      "El link de pago debe ser una URL HTTPS válida"
    ),
  isActive: z.coerce.boolean().optional().default(true),
});

export type ProductAdminInput = z.infer<typeof productAdminSchema>;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
