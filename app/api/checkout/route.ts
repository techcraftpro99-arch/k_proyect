import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validations/checkout.schema";
import { createOrder } from "@/lib/orders";
import { getProducts } from "@/lib/products";
import { getEffectivePrice } from "@/lib/format";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

function isSafePaymentUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured. Set Supabase environment variables." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { customerName, paymentMethod, items } = parsed.data;

    if (items.length !== 1) {
      return NextResponse.json(
        { error: "Paga un producto a la vez con el link de PayPal" },
        { status: 400 }
      );
    }

    const allProducts = await getProducts({});
    const product = allProducts.find((p) => p.id === items[0].productId);

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 400 });
    }

    const paymentLink = product.paymentLink?.trim() || null;
    if (!paymentLink || !isSafePaymentUrl(paymentLink)) {
      return NextResponse.json(
        {
          error:
            "Este producto no tiene un link de pago PayPal configurado. Contacta al vendedor.",
        },
        { status: 400 }
      );
    }

    const { order, error } = await createOrder({
      customerName: customerName.trim(),
      paymentMethod,
      items: [
        {
          productId: product.id,
          price: getEffectivePrice(product),
        },
      ],
    });

    if (!order) {
      return NextResponse.json({ error: error ?? "Failed to create order" }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      total: order.total,
      paymentMethod,
      redirectUrl: paymentLink,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
