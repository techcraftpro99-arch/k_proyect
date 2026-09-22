import { createAdminClient } from "@/lib/supabase/admin";
import { buildDownloadEmailHtml, sendEmail } from "@/lib/email/resend";

const DOWNLOAD_EXPIRY_SECONDS = 86400; // 24 hours

export async function sendDigitalGoods(orderId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = createAdminClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "DesignStore";

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, order_items(product_id, products(name))")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return { success: false, error: "Order not found" };
  }

  if (order.status === "paid" && order.paid_at) {
    const { data: existingTokens } = await supabase
      .from("download_tokens")
      .select("id")
      .eq("order_id", orderId)
      .limit(1);

    if (existingTokens?.length) {
      return { success: true };
    }
  }

  const productIds = order.order_items.map(
    (item: { product_id: string }) => item.product_id
  );

  const { data: files, error: filesError } = await supabase
    .from("product_files")
    .select("*")
    .in("product_id", productIds);

  if (filesError || !files?.length) {
    return { success: false, error: "No files found for order" };
  }

  const expiresAt = new Date(Date.now() + DOWNLOAD_EXPIRY_SECONDS * 1000);
  const downloads: { fileName: string; url: string }[] = [];

  for (const file of files) {
    const { data: signed, error: signError } = await supabase.storage
      .from("digital-assets")
      .createSignedUrl(file.storage_path, DOWNLOAD_EXPIRY_SECONDS);

    if (signError || !signed?.signedUrl) {
      console.error("Signed URL error:", signError);
      continue;
    }

    const token = crypto.randomUUID();
    await supabase.from("download_tokens").insert({
      order_id: orderId,
      product_file_id: file.id,
      token,
      expires_at: expiresAt.toISOString(),
    });

    downloads.push({
      fileName: file.file_name,
      url: `${appUrl}/api/download/${token}`,
    });
  }

  if (!downloads.length) {
    return { success: false, error: "Could not generate download links" };
  }

  const html = buildDownloadEmailHtml({
    storeName,
    orderId,
    downloads,
    expiresAt,
  });

  const sent = await sendEmail({
    to: order.email,
    subject: `Your ${storeName} downloads are ready`,
    html,
  });

  return { success: sent };
}

export async function markOrderPaid(
  orderId: string,
  paymentReference?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      payment_reference: paymentReference ?? null,
    })
    .eq("id", orderId)
    .eq("status", "pending");

  if (error) {
    return { success: false, error: error.message };
  }

  return sendDigitalGoods(orderId);
}
