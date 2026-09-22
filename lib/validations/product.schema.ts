import { z } from "zod";

export const productFilterSchema = z.object({
  category: z.string().optional(),
  search: z.string().trim().max(100).optional(),
  sort: z.enum(["price-asc", "price-desc", "newest", "rating"]).optional(),
  featured: z.coerce.boolean().optional(),
  bestseller: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});
