import type { PaymentProvider, PaymentSession } from "./types";

export class PayPalProvider implements PaymentProvider {
  readonly method = "paypal" as const;

  async createSession(
    orderId: string,
    total: number
  ): Promise<PaymentSession> {
    return {
      metadata: {
        orderId,
        total: total.toFixed(2),
        currency: "USD",
      },
    };
  }
}

export async function capturePayPalOrder(
  paypalOrderId: string
): Promise<{ success: boolean; captureId?: string }> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const baseUrl =
    process.env.PAYPAL_MODE === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  if (!clientId || !clientSecret) {
    console.warn("PayPal credentials not configured — skipping capture");
    return { success: false };
  }

  const authRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!authRes.ok) return { success: false };
  const { access_token } = await authRes.json();

  const captureRes = await fetch(
    `${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!captureRes.ok) return { success: false };
  const data = await captureRes.json();
  const captureId = data.purchase_units?.[0]?.payments?.captures?.[0]?.id;
  return { success: data.status === "COMPLETED", captureId };
}
