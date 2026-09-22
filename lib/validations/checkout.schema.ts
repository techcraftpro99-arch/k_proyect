import { z } from "zod";

export const checkoutSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  customerName: z.string().trim().max(100).optional(),
  paymentMethod: z.enum(["paypal", "whatsapp", "tiktok"]),
  items: z
    .array(
      z.object({
        productId: z.string().uuid("Invalid product ID"),
        quantity: z.literal(1),
      })
    )
    .min(1, "Cart cannot be empty")
    .max(20, "Too many items"),
});

export const approveOrderSchema = z.object({
  orderId: z.string().uuid(),
});

export const capturePayPalSchema = z.object({
  orderId: z.string().uuid(),
  paypalOrderId: z.string().min(1),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
