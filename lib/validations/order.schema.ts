import { z } from "zod";

export const orderStatusSchema = z.enum([
  "pending",
  "paid",
  "cancelled",
  "refunded",
]);

export const paymentMethodSchema = z.enum(["paypal", "whatsapp", "tiktok"]);
