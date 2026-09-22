import { NextResponse } from "next/server";
import { capturePayPalSchema } from "@/lib/validations/checkout.schema";
import { capturePayPalOrder } from "@/lib/payments/paypal.provider";
import { markOrderPaid } from "@/lib/delivery/send-digital-goods";
import { updatePayPalOrderId } from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await request.json();
    const parsed = capturePayPalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { orderId, paypalOrderId } = parsed.data;

    await updatePayPalOrderId(orderId, paypalOrderId);

    const capture = await capturePayPalOrder(paypalOrderId);

    if (!capture.success) {
      return NextResponse.json({ error: "PayPal capture failed" }, { status: 402 });
    }

    const result = await markOrderPaid(orderId, capture.captureId ?? paypalOrderId);

    if (!result.success) {
      return NextResponse.json({ error: result.error ?? "Delivery failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error("Capture error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
