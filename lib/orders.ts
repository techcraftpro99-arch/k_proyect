import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, OrderItem } from "@/types/order";

export async function createOrder(params: {
  email?: string;
  customerName?: string;
  paymentMethod: "paypal" | "whatsapp" | "tiktok";
  items: { productId: string; price: number }[];
}): Promise<{ order: Order | null; error?: string }> {
  const supabase = createAdminClient();
  const total = params.items.reduce((sum, i) => sum + i.price, 0);
  const email =
    params.email?.trim() && params.email.includes("@")
      ? params.email.trim()
      : "pending@paypal.checkout";

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      email,
      customer_name: params.customerName ?? null,
      payment_method: params.paymentMethod,
      total,
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !orderRow) {
    return { order: null, error: orderError?.message ?? "Failed to create order" };
  }

  const orderItems = params.items.map((item) => ({
    order_id: orderRow.id,
    product_id: item.productId,
    price_at_purchase: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    return { order: null, error: itemsError.message };
  }

  const { data: products } = await supabase
    .from("products")
    .select("id, name")
    .in(
      "id",
      params.items.map((i) => i.productId)
    );

  const productMap = new Map(products?.map((p) => [p.id, p.name]) ?? []);

  const items: OrderItem[] = params.items.map((item, idx) => ({
    id: `item-${idx}`,
    productId: item.productId,
    productName: productMap.get(item.productId) ?? "Product",
    priceAtPurchase: item.price,
  }));

  return {
    order: {
      id: orderRow.id,
      email: orderRow.email,
      customerName: orderRow.customer_name,
      status: orderRow.status,
      paymentMethod: orderRow.payment_method,
      paymentReference: orderRow.payment_reference,
      paypalOrderId: orderRow.paypal_order_id,
      total: Number(orderRow.total),
      createdAt: orderRow.created_at,
      paidAt: orderRow.paid_at,
      items,
    },
  };
}

export async function getOrders(): Promise<Order[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name))")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    email: row.email,
    customerName: row.customer_name,
    status: row.status,
    paymentMethod: row.payment_method,
    paymentReference: row.payment_reference,
    paypalOrderId: row.paypal_order_id,
    total: Number(row.total),
    createdAt: row.created_at,
    paidAt: row.paid_at,
    items: (row.order_items ?? []).map(
      (item: {
        id: string;
        product_id: string;
        price_at_purchase: number;
        products: { name: string } | null;
      }) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.products?.name ?? "Product",
        priceAtPurchase: Number(item.price_at_purchase),
      })
    ),
  }));
}

export async function updatePayPalOrderId(
  orderId: string,
  paypalOrderId: string
): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("orders")
    .update({ paypal_order_id: paypalOrderId })
    .eq("id", orderId);
}
